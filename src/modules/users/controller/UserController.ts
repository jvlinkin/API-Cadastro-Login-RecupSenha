import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import { Request, Response } from "express";
import Users from "../../../database/models/Users";
import { compare, genSalt, hash } from "bcrypt";
import crypto from 'crypto';
import { Secret, sign } from "jsonwebtoken";
import auth_jwt from "../../../config/auth_jwt"; 
import { ApiError, BadRequestError, ForbiddenError, UnauthorizedError } from "../../../helpers/api-errors";
import * as nodemailer from 'nodemailer';


export class UserController {

    public async create(req:Request, res:Response): Promise<Response>{
        const {first_name, last_name, age,
               address, number, zip_code,
               city, cellphone, email, password} = req.body;

        
        const userExists = await Users.findOne({email});

        if(userExists){
            throw new ApiError('User already exists', 409)
        }

        const salt = await genSalt(15)
        const hashedPassword = await hash(password.toString(), salt)
        
        const userData = new Users({
            first_name,
            last_name,
            age,
            address,
            number,
            zip_code,
            city,
            cellphone,
            email,
            password: hashedPassword
        })

        await userData.save()
        return res.json({message: "User registered successfully."});

    }

    public async login(req: Request, res: Response): Promise<Response>{
        const {email, password} = req.body;
        

        const userExists = await Users.findOne({email});

        if(!userExists){
            throw new BadRequestError('Email/password incorrect. Please try again.');            
        }

        try {
            const checkPassword = await compare(password as string, userExists.password as string)

            if(checkPassword === false){
                return res.status(400).json({message: 'Email/password incorrect. Please try again.'})
            }
            
        } catch (error) {
            console.log(error)
            return res.status(400).json({message: 'An unexpected error ocurred. Sorry :( '})
        }
        


        const secret = process.env.APP_SECRET as Secret;

        const token = sign({}, secret, {
        subject:userExists.id,
        expiresIn: auth_jwt.jwt.expiresIn
        });

        return res.json({message:'User logged!', token})
    }

    public async showUsers(req: Request, res: Response): Promise<Response>{


        const users = await Users.find().select('-password');
        if(!users){
            throw new ApiError('No users found', 404);
        }

        return res.json(users);

    }

    public async forgotPassword(req: Request, res: Response){
        const {email} = req.body;


            const user = await Users.findOne({email})

            if(!user){
                throw new BadRequestError('Email incorrect. Please try again.');
            }

            const token = crypto.randomBytes(20).toString("hex");
            const now = new Date();
            now.setHours(now.getHours()+1);

            await Users.findByIdAndUpdate(user.id, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now
                }

            })

            // envio de e-mail
            const email_user = process.env.EMAIL_USER
            const email_pass = process.env.EMAIL_PASS

            const transport = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                secure: false,
                auth: {
                  user: email_user,
                  pass: email_pass
                }
              });
              
              let message = await transport.sendMail({
                from: email_user,
                to: email,
                subject: "Forgot password", 
                html: `<h2> Hi ${user.first_name}! </h2> <br> <h3>Need to reset your password? No problem,
                use your secret code:</h3><br>
                <p>${token}</p>
                <br><br>

                <p>Equipe API</p>
                <p>api-login.com.br</p><br>`,
                
              }).then(
                ()=>{
                    return res.json({message:'Email was sent! Please check your inbox.'})
                }
              ).catch(
                (err)=>{
                    console.log(err)
                    throw new ApiError('An unexpected error ocurred. Please try again.', 500);
                }
              )


    }

    public async resetPassword(req: Request, res: Response){
        const {email, token, password} = req.body;

        const user = await Users.findOne({email})
        .select('+passwordResetToken passwordResetExpires')

        if(!user){
            throw new BadRequestError('Email/token is incorrect. Please try again.');
        }

        if(token != user.passwordResetToken){
            throw new UnauthorizedError('Email/token is incorrect. Please try again.');
        }

        const nowDate = new Date();

        if(nowDate > user.passwordResetExpires! ){
            
            throw new UnauthorizedError('Email/token is incorrect. Please try again.');
        }

        const salt = await genSalt(15)
        const hashedPassword = await hash(password.toString(), salt)

        user.password = hashedPassword;
        await user.save();
        return res.json({message: 'Password successfully changed'});
    }

}