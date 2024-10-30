import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
    type: String,
    required: true,
    unique: true,
    },
    fullName:{
    type: String,
    required: true,
    },
    password:{
    type: String,
    required: true,
    minLength: 6,
    },
    email:{
    type: String,
    required: true,
    unique: true
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],

    profileImg:{
        type: String,
        default: "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
    },
    coverImg:{
         type: String,
         default: "",
    },
    bio:{
         type: String,
         default: "",
    },
    link:{
         type: String,
         default: "",
    },
    likedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post",
            default:[],
        },
    ],

},
{timestamps:true}
);




const User = mongoose.model("User", userSchema); 

export default User;
