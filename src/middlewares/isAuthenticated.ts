import auth_jwt from '../config/auth_jwt';
import {Request, Response, NextFunction} from 'express';
import {Secret, verify} from "jsonwebtoken";
import { ApiError, BadRequestError, UnauthorizedError } from '../helpers/api-errors';

export default function isAuthenticated(req: Request,res:Response,next:NextFunction){
    const authHeader = req.headers.authorization;

    

        if(!authHeader){
            return res.json({message:'JWT is missing.'});
        }    
        const [,token] = authHeader.split(' ');
    
            const secret = auth_jwt.jwt.secret as Secret;

            try {

                verify(token, secret, function(err){
                    if(err){
                        console.log(err)
                        return res.status(400).json({message:'JWT is invalid.'})
                    }
                
                    return next();
        
                });
                
            } catch (error) {
                console.log(error)
                return res.status(500).json({message:'Internal server error.'})
                
            }

            
        


}