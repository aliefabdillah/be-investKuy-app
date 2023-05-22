import verificationService from "../services/verification.service.js";

const create = async (req, res, next) => {
    try {
        res.json(await verificationService.createVerification(req))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getAll = async (req, res, next) => {
    try {
        res.json(await verificationService.getAllVerification())
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getById = async (req, res, next) => {
    try {
        res.json(await verificationService.getDetailsVerificationById(req))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const updateVerified = async (req, res, next) => {
    try {
        res.json(await verificationService.updateUserVerified(req))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export default{
    create,
    getAll,
    getById,
    updateVerified,
}