import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" } // You can add roles such as admin, user
}); // Closing the UserSchema definition

const user = mongoose.model("user", UserSchema);
export default user;