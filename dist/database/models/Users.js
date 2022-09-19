"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const userModel = new Schema({
    first_name: String,
    last_name: String,
    age: Number,
    address: String,
    number: String,
    zip_code: String,
    city: String,
    cellphone: String,
    email: String,
    password: String,
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Users', userModel);
