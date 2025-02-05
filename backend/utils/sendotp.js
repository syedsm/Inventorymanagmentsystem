const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
    },
});

const SendEmail = async (email, purpose, otp) => {
    // console.log("Email:", email, "Purpose:", purpose, "OTP:", otp); // Debugging log
    try {
        let subject, introMessage, headerTitle;

        if (purpose === 'forgotpassword') {
            subject = "Your OTP Code for Password Reset";
            headerTitle = "Password Reset OTP";
            introMessage = "Use the OTP code below to reset your password.";
        } else if (purpose === 'activation') {
            subject = "Your OTP Code for Account Activation";
            headerTitle = "Account Activation OTP";
            introMessage = `Hello, <strong>${email}</strong>! Use the OTP code below to activate your account.`;
        } else if (purpose === 'supplieraccactivation') {
            subject = "Your OTP Code for Supplier Account Activation";
            headerTitle = "Account Activation OTP";
            introMessage = `Hello, <strong>${email}</strong>! Use the OTP code below to activate your account.`;
        }else if (purpose === 'staffactivation') {
            subject = "Your OTP Code for Staff Account Activation";
            headerTitle = "Account Activation OTP";
            introMessage = `Hello, <strong>${email}</strong>! Use the OTP code below to activate your account.`;
        }
        let info = await transporter.sendMail({
            from: process.env.NODEMAILER_USER,
            to: email,
            subject: subject,
            text: `Your OTP code is: ${otp}`,
            html: `
                <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333;">
                    <div style="padding: 20px; background-color: #f8f9fa; border-radius: 10px; border: 1px solid #ddd;">
                        <h2 style="color: #007bff; text-align: center;">${headerTitle}</h2>
                        <p style="font-size: 16px; line-height: 1.6;">
                            ${introMessage}
                        </p>
                        
                        <div style="text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; color: #007bff;">
                            ${otp || "OTP not available"}
                        </div>

                        <p style="font-size: 14px; color: #666; text-align: center;">
                            If you didn’t request this, you can safely ignore this email.
                        </p>
                        <hr style="border: 0; border-top: 1px solid #ddd;" />
                        <p style="font-size: 12px; color: #999; text-align: center;">
                            &copy; ${new Date().getFullYear()} Inventory Management System. All rights reserved.
                        </p>
                    </div>
                </div>
            `,
        });

        console.log("OTP email sent successfully:", info.messageId);
        return otp; // Return OTP for further verification
    } catch (error) {
        console.error("Failed to send OTP email:", error);
        throw error;
    }
};


module.exports = SendEmail;
