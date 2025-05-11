const JWT = require("jsonwebtoken");

const secret="ASD$$!";

function createUserToken(user){
    const payload={
        _id: user._id,
        fullname:user.fullname,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role
    };
    const token=JWT.sign(payload, secret,{
        expiresIn:60*60*24
    }); 
    return token;
}

function validateToken(token){
    const payload=JWT.verify(token,secret);
    return payload;
}

module.exports={
    createUserToken,
    validateToken,
};