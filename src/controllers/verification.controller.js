import verificationService from "../services/verification.service.js";

const create = async (req, res, next) => {
    try {
        const response = await verificationService.createVerification(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getAll = async (req, res, next) => {
    try {
        const response = await verificationService.getAllVerification()
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getById = async (req, res, next) => {
    try {
        const response = await verificationService.getDetailsVerificationById(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const updateVerified = async (req, res, next) => {
    try {
        const response = await verificationService.updateUserVerified(req)
        res.status(response.code).send(response)
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