import mongoose from 'mongoose';
const { Schema } = mongoose;

const userModel = new Schema({
  first_name:  String, // 
  last_name: String,
  age: Number,
  address: String,
  number: String,
  zip_code: String,
  city: String,
  cellphone: String,
  email: String,
  password: String,
  passwordResetToken: {type: String, select: false},
  passwordResetExpires: {type: Date, select: false}
  },
  {
    timestamps: true
  }

  
);

export default mongoose.model('Users', userModel);