import { errorResponse, successResponse } from "../handler/responseHandler";
import User from "../models/user";
import { Request, Response } from "express";
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import data from '../security/keys';
import jwt from 'jsonwebtoken'

const TokenGenerator = require("token-generator")({
  salt: "your secret ingredient for this magic recipe",
  timestampMap: "abcdefghij", // 10 chars array for obfuscation proposes
});
const bcrypt = require('bcrypt');

const registerUser = async (req: Request, res: Response) => {
  try {
    const fullname: string = req.body.fullname;
    const email: string = req.body.email;
    const pass: string = req.body.password;
    const role: string = req.body.role;

    const otp: string = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const password = await bcrypt.hash(pass,10);

    const token:string = TokenGenerator.generate();

    const user = await User.create({
      fullname,
      email,
      password,
      role,
      otp,
      token
    });

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<< SENDING MAIL >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data.ADMIN_EMAIL,
        pass: data.ADMIN_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: data.ADMIN_EMAIL, // sender address
        to: user.email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: `Hello ${user.fullname}, Your otp is ${otp} `, // plain text body
      });
    } catch (error) {
      throw 'mail not send because of invalid credentials..'
    }

    successResponse(res,`${user.fullname} registered..`,201)
  } catch (error) {
    errorResponse(res, error, 401)
  }
}

const verifyotp = async (req:Request,res:Response) => {
try {
    const otp:string = req.body.otp;
    const token = req.headers.token;

    const user = await User.findOne({ token })

    if(user?.otp !== otp) throw 'otp not matched..';

    await User.findOneAndUpdate({ token },{
      otpVerification :true
    })
  
    successResponse(res,'otp verified..',200)
} catch (error) {
    errorResponse(res,error,400)
}
}

const loginUser = async (req:Request,res:Response) => {
  try {
    const email:string = req.body.email;
    const password:string = req.body.password;
  
    const isUser = await User.findOne({ email })
    const pass = await bcrypt.compare(password,isUser?.password);
  
    if(!pass) throw 'password miss matched..';

    const token = jwt.sign({ email }  , data.SECRET_KEY );

    res.cookie('JwtToken',token)    // store jwt token inside cookies
  
    successResponse(res,`${isUser?.fullname} loged in..` , 200)
  } catch (error) {
    errorResponse(res,error,400)
  }
}

export {
  registerUser,
  verifyotp,
  loginUser
}