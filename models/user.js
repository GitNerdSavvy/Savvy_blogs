const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { createUserToken } = require("../services/auth");

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    
    },
    password: {
      type: String,
      required: true,
    },
    profilePicURL: {
      type: String,
      default: "/images/pic.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString("hex");
  const hashedPass = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

    this.salt=salt;
    this.password=hashedPass;
    next();
});
userSchema.static("matchPass", async function(email,password){
  const user=await this.findOne({email});
  if(!user) throw new Error('User Not Found!');

  const salt=user.salt;
  const hashedPass=user.password;

  const userPass=createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if(hashedPass !== userPass) throw new Error("Incorrect Password");
  const token=createUserToken(user);
  return token;
})
const User = model("user", userSchema);
module.exports = User;
