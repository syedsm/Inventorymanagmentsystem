const bcrypt = require("bcrypt");

const validateOtp = async (otp, userData) => {
    console.log("Received OTP:", otp);
    console.log("Received userData:", userData);

    if (!userData) {
        throw new Error("Error Occurred. Try Resend OTP.");
    }

    const { otpHash, iat } = userData;
    const issuedAt = new Date(iat);
    const currentTime = new Date();
    const expirationTime = new Date(issuedAt.getTime() + 5 * 60000);

    if (currentTime > expirationTime) {
        throw new Error("OTP Expired");
    }

    const isCorrect = await bcrypt.compare(otp, otpHash);

    console.log("OTP Verification Status:", isCorrect);
    return isCorrect;
};

module.exports = validateOtp;
