import bcrypt from "bcrypt";
export const otpGenerator = async (minute = 5) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + minute * 60 * 1000);
    const hashOtp = await bcrypt.hash(otp, 10);
    return { otp, expiresAt, hashOtp };
};
