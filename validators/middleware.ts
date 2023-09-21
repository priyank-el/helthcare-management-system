
import * as Validator from 'validatorjs';
import { Request,Response } from 'express';
import mongoose from 'mongoose';

Validator.registerAsync('isUniqueemail', async function (username , attribute , req , passes) {
  
  const array = attribute.split(',')
  const {0:model,1:field} = array

  const isUser = await mongoose.model(model).findOne( { [field]:username } )

  if(!isUser){
    return passes()
  }
  await passes(false , "email already in use..")
}, '')

Validator.registerAsync('isUnique', async function (username , attribute , req , passes) {
  const array = attribute.split(',')
  const {0:model,1:field} = array

  const isUser = await mongoose.model(model).findOne( { [field]:username } )

  if(!isUser){
    return passes()
  }
  await passes(false ,'This medicine is already available in store.')
}, '')

// main function for do validation
const validaeWithCallback = (rules:any,req:Request,res:Response,next:any) => {
    const validation = new Validator.default(req.body, rules, {});
     validation.passes(() => next());
    validation.fails(() => {
        sendError(req,res, formattedErrors(validation.errors.errors) )  }
    );
}

//** function for error handling */ 
async function sendError(req:Request, res:Response, data:any, statusCode = 422) {
  return res.status(statusCode).json(data)
}

function formattedErrors(err:any) {
  let transformed:any = {};
  Object.keys(err).forEach(function (key) {
      transformed[key] = err[key][0];
  })
  return transformed
}

export = {
  validaeWithCallback
}