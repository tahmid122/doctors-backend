import { authenticationService } from "./authentication.service";
const register = async (req, res) => {
    const result = await authenticationService.register(req.body);
    return res.status(201).send(result);
};
const verifyAccount = async (req, res) => {
    await authenticationService.verifyAccount(req.body);
    return res.status(200).send({ success: true, message: "Account verified." });
};
const resendVerificationEmail = async (req, res) => {
    await authenticationService.resendVerificationEmail(req.body);
    return res
        .status(200)
        .send({ success: true, message: "Resend verification email sent" });
};
const login = async (req, res) => {
    const result = await authenticationService.login(req.body);
    // res.cookie("accessToken", result.data.token, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   maxAge: 3600000 * 24,
    // });
    res.status(200).send(result);
};
const forgotPassword = async (req, res) => {
    const result = await authenticationService.forgotPassword(req.body);
    res.status(200).send(result);
};
const verifyForgotPassword = async (req, res) => {
    const result = await authenticationService.verifyForgotPassword(req.body);
    res.status(200).send(result);
};
const setNewPassword = async (req, res) => {
    const result = await authenticationService.setNewPassword(req.body);
    res.status(201).send(result);
};
const changePassword = async (req, res) => {
    const result = await authenticationService.changePassword(req.body, req.user);
    res.status(201).send(result);
};
const updateUser = async (req, res) => {
    const result = await authenticationService.updateUser(req.params.id, req.body);
    res.status(201).json(result);
};
const getProfile = async (req, res) => {
    const result = await authenticationService.getProfile(req.user);
    res.status(200).json(result);
};
export const authenticationController = {
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
