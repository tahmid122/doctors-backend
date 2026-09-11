import { serviceRequestService } from "./serviceRequests.service";
const createRequest = async (req, res) => {
    const result = await serviceRequestService.createRequest(req.body, req.user);
    res.status(201).send({
        success: true,
        message: "Request sent successfully",
        data: result,
    });
};
const getAllRequests = async (req, res) => {
    const result = await serviceRequestService.getAllRequests(req.query, req.user);
    res
        .status(200)
        .send({ success: true, message: "Request retrieved.", ...result });
};
const deleteRequest = async (req, res) => {
    const result = await serviceRequestService.deleteRequest(req.params.id, req.user);
    res.status(201).send({
        success: true,
        message: "Request successfully deleted",
        data: result,
    });
};
const updateStatus = async (req, res) => {
    const result = await serviceRequestService.updateStatus(req.params.id, req.body.status);
    res
        .status(201)
        .send({ success: true, message: "Status updated", data: result });
};
export const serviceRequestController = {
    createRequest,
    getAllRequests,
    deleteRequest,
    updateStatus,
};
