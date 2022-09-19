"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const dotenv = __importStar(require("dotenv")); // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
const Users_1 = __importDefault(require("../../../database/models/Users"));
const bcrypt_1 = require("bcrypt");
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_jwt_1 = __importDefault(require("../../../config/auth_jwt"));
const api_errors_1 = require("../../../helpers/api-errors");
const nodemailer = __importStar(require("nodemailer"));
class UserController {
    async create(req, res) {
        const { first_name, last_name, age, address, number, zip_code, city, cellphone, email, password } = req.body;
        const userExists = await Users_1.default.findOne({ email });
        if (userExists) {
            throw new api_errors_1.ApiError('User already exists', 409);
        }
        const salt = await (0, bcrypt_1.genSalt)(15);
        const hashedPassword = await (0, bcrypt_1.hash)(password.toString(), salt);
        const userData = new Users_1.default({
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
        });
        await userData.save();
        return res.json({ message: "User registered successfully." });
    }
    async login(req, res) {
        const { email, password } = req.body;
        const userExists = await Users_1.default.findOne({ email });
        if (!userExists) {
            throw new api_errors_1.BadRequestError('Email/password incorrect. Please try again.');
        }
        try {
            const checkPassword = await (0, bcrypt_1.compare)(password, userExists.password);
            if (checkPassword === false) {
                return res.status(400).json({ message: 'Email/password incorrect. Please try again.' });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'An unexpected error ocurred. Sorry :( ' });
        }
        const secret = process.env.APP_SECRET;
        const token = (0, jsonwebtoken_1.sign)({}, secret, {
            subject: userExists.id,
            expiresIn: auth_jwt_1.default.jwt.expiresIn
        });
        return res.json({ message: 'User logged!', token });
    }
    async showUsers(req, res) {
        const users = await Users_1.default.find().select('-password');
        if (!users) {
            throw new api_errors_1.ApiError('No users found', 404);
        }
        return res.json(users);
    }
    async forgotPassword(req, res) {
        const { email } = req.body;
        const user = await Users_1.default.findOne({ email });
        if (!user) {
            throw new api_errors_1.BadRequestError('Email incorrect. Please try again.');
        }
        const token = crypto_1.default.randomBytes(20).toString("hex");
        const now = new Date();
        now.setHours(now.getHours() + 1);
        await Users_1.default.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        });
        // envio de e-mail
        const email_user = process.env.EMAIL_USER;
        const email_pass = process.env.EMAIL_PASS;
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
        }).then(() => {
            return res.json({ message: 'Email was sent! Please check your inbox.' });
        }).catch((err) => {
            console.log(err);
            throw new api_errors_1.ApiError('An unexpected error ocurred. Please try again.', 500);
        });
    }
    async resetPassword(req, res) {
        const { email, token, password } = req.body;
        const user = await Users_1.default.findOne({ email })
            .select('+passwordResetToken passwordResetExpires');
        if (!user) {
            throw new api_errors_1.BadRequestError('Email/token is incorrect. Please try again.');
        }
        if (token != user.passwordResetToken) {
            throw new api_errors_1.UnauthorizedError('Email/token is incorrect. Please try again.');
        }
        const nowDate = new Date();
        if (nowDate > user.passwordResetExpires) {
            throw new api_errors_1.UnauthorizedError('Email/token is incorrect. Please try again.');
        }
        const salt = await (0, bcrypt_1.genSalt)(15);
        const hashedPassword = await (0, bcrypt_1.hash)(password.toString(), salt);
        user.password = hashedPassword;
        await user.save();
        return res.json({ message: 'Password successfully changed' });
    }
}
exports.UserController = UserController;
