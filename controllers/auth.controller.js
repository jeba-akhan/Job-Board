const { sendEmail } = require("../helpers/sendEmail");
const User = require("../model/user.model");
const apiResponse = require("./utils/apiResponse");
const { asyncHandler } = require("./utils/asyncHandler");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signupController = asyncHandler(async (req, res) => {
  let { name, email, password } = req.body;

  let existingUser = await User.findOne({email})
  if(existingUser){
  apiResponse(res, 409, "user already exists");
  }else{
    
    bcrypt.hash(password, 10, async function (err, hash) {
    if (err) {
      apiResponse(res, 500, err || "internal server error");
    } else {
      const otp = uuidv4().toString().substring(0, 5);

      let user = new User({
        name,
        email,
        password: hash,
        otpExpired: Date.now() + 5 * 60 * 1000,
        otp
      });

      await user.save();

      setTimeout(async() => {

        user.otp = null;
        user.otpExpired = null;

        await user.save();

      }, 60000);

      sendEmail(email, otp, name);

      apiResponse(res, 201, "account create successful", user);
    }
  });

  }

 
});

exports.signinController = asyncHandler(async (req, res) => {
  let { email, password } = req.body;
  let existingUser = await User.findOne({ email }).select("+password");

  if (!existingUser) {
    apiResponse(res, 404, "email not found");
  } else {
    bcrypt.compare(password, existingUser.password, function (err, result) {
      if (result) {

        let user = {
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
          isVerified: existingUser.isVerified,
          isActive: existingUser.isActive,
        };

        jwt.sign(
          { email:existingUser.email, id:existingUser._id },

           process.env.privateKey,
          { expiresIn: '5m' },
          function (err, token) {
           apiResponse(res, 200, "user login successful",{... user, token});
          },
        );

        
      } else {
        apiResponse(res, 404, "invalid password");
      }
    });
  }
});

exports.otpVerifyController = asyncHandler(async(req,res)=>{
  let {email, otp} = req.body
  let user = await User.findOne({email})
  
  if(user.otp == otp){

    if(user.otpExpired > new Date()){

     user.otp = null;
     user.isVerified = true;

     await user.save()
    
     apiResponse(res, 200, "otp Verify success");
    
  }else{
    apiResponse(res, 400, "otp expired");
  }

  }else{
     apiResponse(res, 400, "otp not matched");
  }

});


exports.resendOtpController = asyncHandler(async (req, res) => {
  let { email } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    return apiResponse(res, 404, "email not found");
  }

  if (user.isVerified) {
    return apiResponse(res, 400, "account already verified");
  }

  const otp = uuidv4().substring(0, 5);

  user.otp = otp;
  user.otpExpired = Date.now() + 5 * 60 * 1000;

  await user.save();

  await sendEmail(email, otp, user.name);

  return apiResponse(res, 200, "OTP resend successful");
});

exports.forgotPasswordController = asyncHandler(async (req, res) => {
    let { email } = req.body;

    let user = await User.findOne({ email });

    if (user) {
        const otp = uuidv4().toString().substring(0, 4);
        user.otp = otp;
        user.otpExpire = Date.now() + 2 * 60 * 1000;

        await user.save();

        sendEmail(email, otp, user.name, "forgot-password");
        apiResponse(res, 200, "forgot password otp send successful");
    } else {
        apiResponse(res, 404, "No account found.");
    }
});


exports.resetPasswordController = asyncHandler(async (req, res) => {
  let { email, otp, newPassword } = req.body;

  let user = await User.findOne({ email }).select("+password");

  if (!user) {
    return apiResponse(res, 404, "email not found");
  }

  if (user.otp !== otp) {
    return apiResponse(res, 400, "otp not matched");
  }

  if (user.otpExpire < new Date()) {
    return apiResponse(res, 400, "otp expired");
  }

  const hash = await bcrypt.hash(newPassword, 10);

  user.password = hash;
  user.otp = null;
  user.otpExpire = null;

  await user.save();

  return apiResponse(res, 200, "password reset successful");
});
