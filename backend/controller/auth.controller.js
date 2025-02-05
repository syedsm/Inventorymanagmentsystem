const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SendEmail = require('../utils/sendotp');
const validateOtp = require('../utils/otpvalidate');
const UserModel = require('../models/User.model');
require('dotenv').config();
const tempUserStore = {};

// local users
exports.login = async (req, res) => {
    // console.log(req.body);
    try {
        const { email, password } = req.body;

        // Validate email and password
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if the user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        if (user.authType == 'google') {
            return res.status(404).json({ message: "User Already Sign in Google" })
        }
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET
            // ,{expiresIn: "1h"}
        );

        res.status(200).json({ message: "Login successful", token: token, email: user.email });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.Googlelogin = async (req, res) => {
    // console.log("Credentials Received:", req.body.data);

    try {
        // Validate request body
        if (!req.body.data) {
            return res.status(400).json({ message: "Missing token data in request body" });
        }
        // console.log("AccessToken",req.body.data);

        // Decode JWT token to extract user details
        const decodedHeader = jwt.decode(req.body.data.accessToken.trim(""));
        // decodedHeader ? console.log("token  token") : console.log("token vlaid")

        if (!decodedHeader) {
            return res.status(400).json({ message: "Invalid token data" });
        }
        // console.log("Decoded Header", decodedHeader);
        const { email, name, picture, sub } = decodedHeader;

        // Check if user already exists by email or authProviderId (sub for Google)
        const existingUser = await UserModel.findOne({
            $or: [{ email: email }, { authProviderId: sub }]
        });
        // console.log("Existing user Found", existingUser);
        if (existingUser) {
            // If user exists and was registered with another method, handle conflict
            // if (existingUser.authType === 'local' || existingUser.authType === 'fb') {
            //     return res.json({
            //         message: `User already registered with ${existingUser.authType}. Please log in with email and password.`,
            //         conflict: true, // Indicate conflict
            //     });

            // If no conflict (user exists and logged in via Google), generate JWT and log in
            const token = jwt.sign(
                { id: existingUser._id, email: existingUser.email, role: existingUser.role },
                process.env.JWT_SECRET
            );

            return res.status(200).json({
                message: "User logged in successfully",
                token,
            });
            // }
        }

        // If user doesn't exist, create a new user record for Google login
        const newUser = new UserModel({
            username: name,
            email,
            profileImg: picture,
            authType: "google",  // Indicating user registered via Google
            authProviderId: sub, // Use 'sub' from Google as unique identifier
        });

        await newUser.save();

        // Generate a JWT for the new user
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET
        );

        return res.status(201).json({
            message: "User created successfully",
            token
        });

    } catch (error) {
        console.error("Error in Google login:", error.message);
        return res.status(500).json({ message: "An error occurred during Google login." });
    }
};

exports.FBlogin = async (req, res) => {
    try {
        // Validate request body
        if (!req.body.data) {
            return res.status(400).json({ message: "Missing token data in request body" });
        }

        // Decode the access token
        const decodedHeader = jwt.decode(req.body.data.accessToken.trim());

        if (!decodedHeader) {
            return res.status(400).json({ message: "Invalid token data" });
        }

        const { email, name, picture, sub } = decodedHeader;

        // Check if user already exists in the database
        const existingUser = await UserModel.findOne({
            $or: [{ email: email }, { authProviderId: sub }]
        });

        if (existingUser) {
            // Check if the user is already registered with the same provider
            // if (existingUser.authType === 'local' || existingUser.authType === 'google') {
            //     return res.json({
            //         message: `User already registered with ${existingUser.authType}. Please log in with your email and password.`,
            //         conflict: true, // You can add a 'conflict' field to indicate the conflict
            //     });
            // }

            // Generate JWT token for the existing user
            const token = jwt.sign(
                { id: existingUser._id, email: existingUser.email, role: newUser.role },
                process.env.JWT_SECRET,
                // { expiresIn: '1h' } // Optionally, set expiry time for JWT
            );

            return res.status(200).json({
                message: "User logged in successfully",
                token,
            });
        }

        // If the user does not exist, create a new user
        const newUser = new UserModel({
            username: name,
            email,
            profileImg: picture,
            authType: "fb", // Facebook as the authType
            authProviderId: sub,
        });

        await newUser.save();

        // Generate JWT token for new user
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            // { expiresIn: '1h' } // Optionally, set expiry time for JWT
        );

        res.status(201).json({
            message: "User created successfully",
            token
        });

    } catch (error) {
        console.error("Error in Facebook login:", error.message);
        res.status(500).json({ message: "An error occurred during Facebook login." });
    }
};

exports.send_otp = async (req, res) => {
    const { email, password } = req.body;

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    // Generate OTP Function
    const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();
    const otp = generateOtp();
    console.log("OTP", otp);
    // Hash OTP for secure storage
    const otpHash = await bcrypt.hash(otp, 10);

    try {
        purpose = "activation"
        // Pass OTP to the email function
        await SendEmail(email, purpose, otp);
        // Store OTP details in tempUserStore
        tempUserStore[email] = { email, password, otpHash, iat: Date.now() };

        res.status(200).json({ tempdata: email, message: "OTP sent to your email." });
    } catch (error) {
        res.status(500).json({ message: "Failed to send OTP." });
    }
};

exports.verifyotp = async (req, res) => {
    const { otp, email } = req.body;

    // Debug: Log incoming request body
    console.log("Received request data:", req.body);

    const userData = tempUserStore[email];
    if (!userData) {
        console.error("User data not found for email:", email);
        return res.status(400).json({ message: "User data not found. Please resend OTP." });
    }

    // Debug: Log user data retrieved from tempUserStore
    // console.log("Retrieved user data from tempUserStore:", userData);

    try {
        const isOtpValid = await validateOtp(otp, userData);
        if (isOtpValid) {
            const { email, password } = userData;

            if (!email || !password) {
                console.error("Missing email or password in userData:", userData);
                return res.status(400).json({ message: "Email or password missing. Please try again." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const userPayload = {
                email,
                password: hashedPassword,
                authType: "local",
            };

            // Debug: Log user payload before saving to DB
            // console.log("User payload to save:", userPayload);

            const newUser = await UserModel.create(userPayload);

            // Debug: Log confirmation of user save
            // console.log("User saved successfully:", newUser);

            delete tempUserStore[email];
            res.status(200).json({ message: "OTP verified successfully! Please log in again." });
        } else {
            res.status(400).json({ message: "Invalid OTP." });
        }
    } catch (error) {
        console.error("Database save error:", error);
        res.status(500).json({ message: "An error occurred while saving user data.", error: error.message });
    }
};

exports.resendotp = async (req, res) => {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    // Retrieve user data from tempUserStore
    const userData = tempUserStore[email];
    if (!userData) {
        return res.status(404).json({ message: "User not found. Please sign up first." });
    }

    // Generate OTP
    const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();
    const otp = generateOtp();

    // Hash the OTP for secure storage
    const otpHash = await bcrypt.hash(otp, 10);

    try {
        // Send OTP via email
        await SendEmail(email, otp);

        // Store OTP details in tempUserStore with original user data
        tempUserStore[email] = { ...userData, otpHash, iat: Date.now() }; // Copy original data, add otpHash and iat

        res.status(200).json({ tempdata: email, message: "OTP sent to your email." });
    } catch (error) {
        console.error("Error sending OTP email:", error);
        res.status(500).json({ message: "Failed to send OTP." });
    }
};

exports.resetpage = async (req, res) => {
    try {
        // console.log(req.body);

        // Check if the request body contains the email
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email not received" });
        }

        // Generate OTP function
        const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();
        const otp = generateOtp();

        // Uncomment and use if you store the OTP securely in the database
        // const otpHash = await bcrypt.hash(otp, 10);

        const purpose = 'forgotpassword';
        // Hash OTP for secure storage
        const otpHash = await bcrypt.hash(otp, 10);
        // Attempt to send the email
        const mailResponse = await SendEmail(email, purpose, otp);
        tempUserStore[email] = { email, otpHash, iat: Date.now() }; // Store OTP details in tempUserStore

        // Check if the email sending was successful
        if (mailResponse) {
            res.status(200).json({
                email: email,
                message: "OTP sent to your email successfully"
            });
        } else {
            // Handle failure in sending email
            res.status(500).json({
                message: "Failed to send OTP. Please try again later."
            });
        }
    } catch (error) {
        // Log the error and send a response
        console.error("Error in sending email:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.forgot_verify_otp = async (req, res) => {
    // console.log("Data Received", req.body);
    const { email, otp } = req.body;

    const userData = tempUserStore[email];
    if (!userData) {
        console.error("User data not found for email:", email);
        return res.status(400).json({ message: "User data not found. Please resend OTP." });
    }
    try {
        const isOtpValid = await validateOtp(otp, userData);
        if (isOtpValid) {
            delete tempUserStore[email];
            res.status(200).json({ message: "OTP verified successfully! Set new Password." });
        } else {
            res.status(400).json({ message: "Invalid OTP." });
        }
    } catch (error) {
        console.error("Database save error:", error);
        res.status(500).json({ message: "An error occurred while saving user data.", error: error.message });
    }
};

exports.forgot_resend_otp = async (req, res) => {
    // console.log("resend Email Recived", req.body);
    try {

        // Check if the request body contains the email
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email not received" });
        }

        // Generate OTP function
        const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();
        const otp = generateOtp();

        const purpose = 'forgotpassword';
        const mailResponse = await SendEmail(email, purpose, otp);
        const otpHash = await bcrypt.hash(otp, 10);
        tempUserStore[email] = { email, otpHash, iat: Date.now() }; // Store OTP details in tempUserStore

        // Check if the email sending was successful
        if (mailResponse) {
            res.status(200).json({
                email: email,
                message: "OTP resent to your email successfully"
            });
        } else {
            // Handle failure in sending email
            res.status(500).json({
                message: "Failed to send OTP. Please try again later."
            });
        }
    } catch (error) {
        // Log the error and send a response
        console.error("Error in sending email:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.resetpassword = async (req, res) => {
    const { newpassword, email } = req.body;
    // console.log(req.body);

    // Validate the new password
    if (!newpassword || newpassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    try {
        // Find the user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newpassword, 10);

        user.password = hashedPassword;
        await user.save();
        // console.log(user);

        return res.status(200).json({ message: "Password has been reset successfully." });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// supplier registration
exports.supplierregactivation = async (req, res) => {
    // console.log("Data recieved", req.body);

    const { email, password, companyName, gstNumber } = req.body
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    // Generate OTP Function
    const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();
    const otp = generateOtp();
    // console.log("OTP", otp);
    // Hash OTP for secure storage
    const otpHash = await bcrypt.hash(otp, 10);

    try {
        purpose = "supplieraccactivation"
        // Pass OTP to the email function
        await SendEmail(email, purpose, otp);
        // Store OTP details in tempUserStore
        tempUserStore[email] = { email, password, otpHash, iat: Date.now(), companyName, gstNumber };
        res.status(200).json({ tempdata: email, message: "OTP sent to your email." });
    } catch (error) {
        res.status(500).json({ message: "Failed to send OTP." });
    }
}

exports.supplierverifyotp = async (req, res) => {
    const { otp, email } = req.body;

    // Debug: Log incoming request body
    // console.log("Received request data:", req.body);

    const userData = tempUserStore[email];
    if (!userData) {
        console.error("User data not found for email:", email);
        return res.status(400).json({ message: "User data not found. Please resend OTP." });
    }

    // Debug: Log user data retrieved from tempUserStore
    // console.log("Retrieved user data from tempUserStore:", userData);

    try {
        const isOtpValid = await validateOtp(otp, userData);
        if (isOtpValid) {
            const { email, password, companyName, gstNumber } = userData;

            if (!email || !password) {
                console.error("Missing email or password in userData:", userData);
                return res.status(400).json({ message: "Email or password missing. Please try again." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const userPayload = {
                email,
                password: hashedPassword,
                isActive: false,
                authType: "local",
                role: "supplier",
                supplierDetails: {
                    companyName,
                    gstNumber,
                },
            };

            // Debug: Log user payload before saving to DB
            // console.log("User payload to save:", userPayload);

            const newUser = await UserModel.create(userPayload);

            // Debug: Log confirmation of user save
            // console.log("User saved successfully:", newUser);

            delete tempUserStore[email];
            res.status(200).json({ message: "OTP verified successfully! Please log in again." });
        } else {
            res.status(400).json({ message: "Invalid OTP." });
        }
    } catch (error) {
        console.error("Database save error:", error);
        res.status(500).json({ message: "An error occurred while saving user data.", error: error.message });
    }
}
// staff registration
exports.staffregactivation = async (req, res) => {
    // console.log("Data recieved", req.body);

    const { email, password } = req.body
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    // Generate OTP Function
    const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();
    const otp = generateOtp();
    // console.log("OTP", otp);
    // Hash OTP for secure storage
    const otpHash = await bcrypt.hash(otp, 10);

    try {
        purpose = "staffactivation"
        // Pass OTP to the email function
        await SendEmail(email, purpose, otp);
        // Store OTP details in tempUserStore
        tempUserStore[email] = { email, password, otpHash, iat: Date.now() };
        res.status(200).json({ tempdata: email, message: "OTP sent to your email." });
    } catch (error) {
        res.status(500).json({ message: "Failed to send OTP." });
    }
}

exports.staffverifyotp = async (req, res) => {
    const { otp, email } = req.body;

    // Debug: Log incoming request body
    // console.log("Received request data:", req.body);

    const userData = tempUserStore[email];
    if (!userData) {
        console.error("User data not found for email:", email);
        return res.status(400).json({ message: "User data not found. Please resend OTP." });
    }

    // Debug: Log user data retrieved from tempUserStore
    // console.log("Retrieved user data from tempUserStore:", userData);

    try {
        const isOtpValid = await validateOtp(otp, userData);
        if (isOtpValid) {
            const { email, password } = userData;

            if (!email || !password) {
                console.error("Missing email or password in userData:", userData);
                return res.status(400).json({ message: "Email or password missing. Please try again." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const userPayload = {
                email,
                password: hashedPassword,
                authType: "local",
                role: "staff",

            };

            // Debug: Log user payload before saving to DB
            // console.log("User payload to save:", userPayload);

            const newUser = await UserModel.create(userPayload);

            // Debug: Log confirmation of user save
            // console.log("User saved successfully:", newUser);

            delete tempUserStore[email];
            res.status(200).json({ message: "OTP verified successfully! Please log in again." });
        } else {
            res.status(400).json({ message: "Invalid OTP." });
        }
    } catch (error) {
        console.error("Database save error:", error);
        res.status(500).json({ message: "An error occurred while saving user data.", error: error.message });
    }
}