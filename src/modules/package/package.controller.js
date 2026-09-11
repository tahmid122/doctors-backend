import { packageService } from "./package.service";
const createPackage = async (req, res) => {
    const result = await packageService.createPackage(req.body);
    res.status(201).send({
        success: true,
        message: "Package successfully created.",
        data: result,
    });
};
const updatePackage = async (req, res) => {
    const result = await packageService.updatePackage(req.body, req.params.id);
    res
        .status(201)
        .send({ success: true, message: "Package updated.", data: result });
};
const getAllPackages = async (req, res) => {
    const result = await packageService.getAllPackages(req.query);
    res.status(200).send({ success: true, ...result });
};
const getSinglePackage = async (req, res) => {
    const result = await packageService.getSinglePackage(req.params.id);
    res.status(200).send({
        success: true,
        message: "Single package successfully retrieved.",
        data: result,
    });
};
const deleteSinglePackage = async (req, res) => {
    const result = await packageService.deleteSinglePackage(req.params.id);
    res.status(200).send({
        success: true,
        message: "Package successfully deleted.",
        data: result,
    });
};
export const packageController = {
    createPackage,
    updatePackage,
    getAllPackages,
    getSinglePackage,
    deleteSinglePackage,
};
