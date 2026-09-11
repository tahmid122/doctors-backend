import { supportService } from "./support.service";
//create support
const createSupport = async (req, res) => {
    const result = await supportService.createSupport(req.body, req.user);
    res
        .status(201)
        .send({ success: true, message: "Support ticket created.", data: result });
};
//get all support tickets
const getAllSupportTickets = async (req, res) => {
    const result = await supportService.getAllSupportTickets(req.user, req.query);
    res.status(200).send(result);
};
//update support ticket
const updateSupportTicket = async (req, res) => {
    const result = await supportService.updateSupportTicket(req.body, req.params.id);
    res
        .status(201)
        .send({ success: true, message: "Ticket updated.", data: result });
};
export const supportController = {
    createSupport,
    getAllSupportTickets,
    updateSupportTicket,
};
