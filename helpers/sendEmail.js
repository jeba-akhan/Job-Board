const nodemailer = require("nodemailer");
exports.sendEmail =async (email, otp, name)=>{

  const transporter =  nodemailer.createTransport({
  service: "gmail",
   
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

try {
  const info = await transporter.sendMail({
    from: 'SMTP_USER', 
    to: email,
    subject: "Hello", 
    text: "Hello world?", 
    html:`<div style=font-family:Arial,sans-serif;max-width:450px;margin:auto;padding:25px;background-color:#f5f3ff;border-radius:12px;color:#374151><div style=background-color:#fff;padding:25px;border-radius:10px><h2 style="color:#7c3aed;margin:0 0 25px">JobPortal</h2><h3 style=color:#1f2937;margin-bottom:12px>Verify Your Email</h3><p style=font-size:14px;line-height:1.7>Hello ${name},<p style=font-size:14px;line-height:1.7>Welcome to JobPortal! Use the code below to verify your email.<div style="background-color:#f3e8ff;padding:18px;text-align:center;border-radius:8px;margin:22px 0"><p style="font-size:12px;color:#7c3aed;margin:0 0 10px">YOUR OTP CODE<h2 style=color:#6d28d9;letter-spacing:8px;margin:0>${otp}</h2></div><p style=font-size:13px;color:#6b7280;line-height:1.6>This code expires in 5 minutes. Please don't share it with anyone.<p style=font-size:14px;line-height:1.7;margin-bottom:0>Best regards,<br><strong style=color:#7c3aed>JobPortal Team</strong></div><p style="text-align:center;font-size:11px;color:#9ca3af;margin:18px 0 0">© 2026 JobPortal. All rights reserved.</div>`, 
  });

  console.log("Message sent: %s", info.messageId);
 

} catch (err) {
  console.error("Error while sending mail:", err);
}

}