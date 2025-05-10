const {validateToken}=require("../services/auth")
function checkauth(cookiename){
    return (req,res,next)=>{
        const tokenValue=req.cookies[cookiename];
        if(!tokenValue){
            return next();
        }
        try {
            const payload=validateToken(tokenValue);
            req.user=payload;
            return next();
        } catch (error) {
            return next();
        }
    }
}
module.exports={
    checkauth,
}