import { OtpPurpose } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import transporter from "../../utils/transporter";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config";
import { otpGenerator } from "../../utils/otpGenerator";
const register = async (data) => {
    const userAlready = await prisma.user.findFirst({
        where: { email: data.email },
    });
    if (userAlready && userAlready.isVerified) {
        throw new AppError("User already exist. Please login to continue");
    }
    if (userAlready && userAlready.isVerified === false) {
        return {
            success: true,
            message: "Please verify your account. Check you email.",
            data: userAlready,
        };
    }
    const hashPassword = await bcrypt.hash(data.password, 10);
    const createdUser = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (createdUser) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        const hashOtp = await bcrypt.hash(otp, 10);
        //delete previous otp
        await prisma.oTP.deleteMany({
            where: {
                email: createdUser.email,
            },
        });
        await prisma.oTP.create({
            data: {
                email: createdUser.email,
                expiresAt,
                otp: hashOtp,
                purpose: "REGISTER",
            },
        });
        if (Boolean(config.SEND_EMAIL)) {
            try {
                const info = await transporter.sendMail({
                    from: '"Backend Initialization Team" <mdtahmidalam.work@gmail.com>',
                    to: createdUser.email,
                    subject: "Account verification code",
                    text: "Account verification code",
                    html: `<b>Verification code is ${otp}</b>`,
                });
                console.log("Message sent: %s", info.messageId);
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            }
            catch (err) {
                console.error("Error while sending mail:", err);
            }
        }
        return {
            success: true,
            message: "Registration successful. Verify your account.",
            otp: otp,
            data: createdUser,
        };
    }
};
const verifyAccount = async (data) => {
    const otpRecord = await prisma.oTP.findFirst({
        where: {
            email: data.email,
            purpose: "REGISTER",
            isUsed: false,
        },
    });
    if (!otpRecord) {
        throw new AppError("Invalid OTP", 400);
    }
    if (otpRecord.expiresAt < new Date()) {
        throw new AppError("OTP has been expired.", 400);
    }
    const isMatch = await bcrypt.compare(data.otp, otpRecord.otp);
    if (!isMatch) {
        throw new AppError("Invalid OTP", 400);
    }
    await prisma.oTP.update({
        where: { id: otpRecord.id },
        data: {
            isUsed: true,
        },
    });
    await prisma.user.update({
        where: { email: data.email },
        data: {
            isVerified: true,
        },
    });
    await prisma.oTP.deleteMany({
        where: {
            email: data.email,
            isUsed: true,
        },
    });
    return { message: "Account verified successfully" };
};
const resendVerificationEmail = async (data) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const hashOtp = await bcrypt.hash(otp, 10);
    //delete previous otp
    await prisma.oTP.deleteMany({
        where: {
            email: data.email,
            purpose: "REGISTER",
        },
    });
    await prisma.oTP.create({
        data: {
            email: data.email,
            expiresAt,
            otp: hashOtp,
            purpose: "REGISTER",
        },
    });
    if (Boolean(config.SEND_EMAIL)) {
        try {
            const info = await transporter.sendMail({
                from: '"Backend Initialization Team" <mdtahmidalam.work@gmail.com>',
                to: data.email,
                subject: "Account verification code",
                text: "Account verification code",
                html: `<b>Verification code is ${otp}</b>`,
            });
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
        catch (err) {
            console.error("Error while sending mail:", err);
        }
    }
    return { otp: otp, message: "Verification email sent." };
};
const login = async (data) => {
    const { email, password } = data;
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    if (!user) {
        throw new AppError("Invalid credentials.", 400);
    }
    if (!user.isVerified) {
        const { password, ...others } = user;
        return {
            success: true,
            message: "Account not verified. Please verify.",
            data: others,
        };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError("Invalid credentials.", 400);
    }
    if (user.status === "BANNED")
        throw new AppError("Your account has been banned.", 400);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.JWT_SECRET);
    const { password: userPassword, ...others } = user;
    return {
        success: true,
        message: "Login successful.",
        data: { user: others, token },
    };
};
const forgotPassword = async (data) => {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
        throw new AppError("No account found with this email.");
    }
    await prisma.oTP.deleteMany({ where: { email: data.email } });
    const { otp, hashOtp, expiresAt } = await otpGenerator();
    await prisma.oTP.create({
        data: {
            email: data.email,
            expiresAt,
            otp: hashOtp,
            purpose: "FORGOT_PASSWORD",
        },
    });
    if (Boolean(config.SEND_EMAIL)) {
        try {
            const info = await transporter.sendMail({
                from: '"Backend Initialization Team" <mdtahmidalam.work@gmail.com>',
                to: data.email,
                subject: "Forgot password verification code",
                text: "Forgot password verification code",
                html: `<b>Forgot password verification code is ${otp}</b>`,
            });
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
        catch (err) {
            console.error("Error while sending mail:", err);
        }
    }
    return { success: true, otp, message: "Verification email sent" };
};
const verifyForgotPassword = async (data) => {
    const otpRecord = await prisma.oTP.findFirst({
        where: { email: data.email, purpose: "FORGOT_PASSWORD", isUsed: false },
    });
    if (!otpRecord) {
        throw new AppError("Invalid OTP", 400);
    }
    if (otpRecord.expiresAt < new Date()) {
        throw new AppError("OTP expired.", 400);
    }
    const isMatch = await bcrypt.compare(data.otp, otpRecord.otp);
    if (!isMatch) {
        throw new AppError("Invalid OTP", 400);
    }
    await prisma.oTP.update({
        where: { id: otpRecord.id },
        data: {
            isUsed: true,
        },
    });
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
        throw new AppError("User not found");
    }
    const token = jwt.sign({ id: user?.id, type: OtpPurpose.FORGOT_PASSWORD, email: user?.email }, config.JWT_SECRET);
    return { success: true, message: "OTP verified.", data: token };
};
const setNewPassword = async (data) => {
    const { token, newPassword } = data;
    if (!token || !newPassword) {
        throw new AppError("Token and new password are required.", 400);
    }
    let decoded;
    try {
        decoded = jwt.verify(token, config.JWT_SECRET);
    }
    catch (error) {
        throw new AppError("Invalid or expired token", 400);
    }
    if (decoded.type !== OtpPurpose.FORGOT_PASSWORD || !decoded.email) {
        throw new AppError("Invalid token", 400);
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: {
            email: decoded.email,
        },
        data: {
            password: hashPassword,
        },
    });
    return {
        success: true,
        message: "Password reset successfully.",
    };
};
const changePassword = async (data, userData) => {
    const user = await prisma.user.findUnique({
        where: { email: userData.email },
    });
    if (!user) {
        throw new AppError("User not found");
    }
    const isMatch = await bcrypt.compare(data.oldPassword, user.password);
    if (!isMatch) {
        throw new AppError("Password not matched. Invalid Old password.");
    }
    const hashPassword = await bcrypt.hash(data.newPassword, 10);
    await prisma.user.update({
        where: { email: user.email },
        data: { password: hashPassword },
    });
    return { success: true, message: "Password updated successfully." };
};
const updateUser = async (id, data) => {
    if (!id)
        throw new AppError("Id is required to update user.");
    if (Object.keys(data).length === 0) {
        throw new AppError("At least one field required to update");
    }
    const updatedUser = await prisma.user.update({
        where: { id },
        data,
    });
    return { success: true, message: "User details updated", data: updatedUser };
};
const getProfile = async (user) => {
    if (!user.id)
        throw new AppError("Id is required to get user details.");
    const userData = await prisma.user.findUnique({
        where: { id: user.id },
        omit: { password: true },
    });
    return { success: true, message: "User details retrieved", data: userData };
};
export const authenticationService = {
    register,
    verifyAccount,
    resendVerificationEmail,
    login,
    forgotPassword,
    verifyForgotPassword,
    setNewPassword,
    changePassword,
    updateUser,
    getProfile,
};
