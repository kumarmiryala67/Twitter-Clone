import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { generatedTokenAndSetCookie } from "../lib/utils/generatedToken.js";

export const signup = async(req, res) => {
 try {
    const {fullName, username, email, password} = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "invalid email format"});
    }

    const existingUser = await User.findOne({ username});
    if(existingUser) {
        return res.status(400).json ( {error: "Username is already taken"}); 
    }
    const existingEmail = await User.findOne({ email });
    if(existingEmail) {
        return res.status(400).json ( {error: "Email is already taken"}); 
    }
   
    if(password.length <6) {
        return res.status(400).json({error: " Password must be at least 6 characters long "})
    }
    // hash password

    const salt = await bcrypt.genSalt(10);
    console.log(salt)
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
    fullName,
    username,
    email,
    password:hashedPassword
    }) 
    console.log(newUser)

    if (newUser) {
      const token =  generatedTokenAndSetCookie(newUser._id,res)
        await newUser.save();

        res.status(201).cookie(token).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg,
        })

    } else {
     res.status(400).json({ error : "invalid user data" });
    }

 } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({error : "internal server error"});
 }
};
export const login = async (req, res) => {

    try {
        
    const {username,password } = req.body;
    const user = await User.findOne({username});
    console.log(user)  //data extracted
    console.log("hello1")
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")
    console.log("hello2")
    
    if(!user || !isPasswordCorrect){
        return res.status(400).json({error:"invalid username or password "}) 
    }
   
    

    const token = generatedTokenAndSetCookie(user._id);
    

    


    res.status(200).cookie("jwt",token,{
        maxAge: 15*24*60*60*1000, //MS
      httponly: true, // prevent xss attacks cross-site scripting attacks  
      sameSite: "strict", // CSRF attacks cross-site request forgery attacks
      secure: process.env.NODE_ENV !== "development",
    })
    
    
    
    
    .json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
    });
    

    } catch (error) {
        console.log("Error in login controller", error.message);
       
    } 
};

export const logout = async (req, res) => {
   try {
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:"Logged out successfully"})
   } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({error:"intrnal server Error"});
   }
};

export const getMe = async (req, res) => {
    try {
       const user = await User.findById(req.user._id).select("-password");
       console.log(user)
       res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMe controller", error.message);
        res.status(500).json({error:"intrnal server Error"});   
    }
}