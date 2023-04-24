import  mongoose, { Schema, model } from "mongoose";
const userSchema = new Schema({
  id: Number,
  first_name: String,
  last_name: String,
  email: String,
  gender: String,
  income: String,
  city: String,
  car: String,
  quote: String,
  phone_price: Number,
});

export default mongoose.models.user || model("user", userSchema);
