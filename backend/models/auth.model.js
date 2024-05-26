import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    photo: { type: String ,default : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" },
    gender: { type: String, enum: ["Male", "Female", "Other"],required : true },
    occupation : {type : String},
    economicStatus : {type : String,enum : ["High","Medium","Low"]},
    phoneNumber : {type : Number},
    age : {type : Number,required : true}
})

UserSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

export default mongoose.model("User", UserSchema);