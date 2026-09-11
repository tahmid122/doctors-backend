import { promotionService } from "./promotion.service";
//create promotion
const createPromotion = async (req, res) => {
    const result = await promotionService.createPromotion(req.body);
    res.status(201).send({
        success: true,
        message: "Promotion created successfully",
        data: result,
    });
};
//update promotion
const updatePromotion = async (req, res) => {
    const result = await promotionService.updatePromotion(req.params.id, req.body);
    res
        .status(201)
        .send({ success: true, message: "Promotion updated", data: result });
};
//get all promotions
const getAllPromotions = async (req, res) => {
    const result = await promotionService.getAllPromotions(req.query);
    res.status(200).send({ success: true, ...result });
};
//get single promotion
const getSinglePromotion = async (req, res) => {
    const result = await promotionService.getSinglePromotion(req.params.id);
    res
        .status(200)
        .send({ success: true, message: "Promotion retrieved.", data: result });
};
//delete promotion
const deleteAPromotion = async (req, res) => {
    const result = await promotionService.deleteAPromotion(req.params.id);
    res
        .status(201)
        .send({ success: true, message: "Promotion deleted", data: result });
};
//get all categories
const getAllCategories = async (req, res) => {
    const result = await promotionService.getAllCategories();
    res.status(200).send({
        success: true,
        message: "All categories retrieved.",
        data: result,
    });
};
export const promotionController = {
    createPromotion,
    updatePromotion,
    getAllPromotions,
    getSinglePromotion,
    deleteAPromotion,
    getAllCategories,
};
