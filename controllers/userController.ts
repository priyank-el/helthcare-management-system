import { errorResponse, successResponse } from "../handler/responseHandler";
import User from "../models/user";
import { Request, Response } from "express";
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import data from '../security/keys' 

const registerUser = async (req: Request, res: Response) => {
  try {
    const fullname: string = req.body.fullname;
    const email: string = req.body.email;
    const password: string = req.body.password;
    const role: string = req.body.role;

    const otp: string = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const user = await User.create({
      fullname,
      email,
      password,
      role,
      otp
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

export {
  registerUser
}