import { userService } from "./user.service";
const updateUserStatus = async (req, res) => {
    const result = await userService.updateUserStatus(req.params.id);
    res
        .status(201)
        .send({ success: true, message: "User status Updated.", data: result });
};
const getAllUsers = async (req, res) => {
    const result = await userService.getAllUsers(req.query);
    res
        .status(200)
        .send({ success: true, message: "Users retrieved.", ...result });
};
export const userController = { updateUserStatus, getAllUsers };
