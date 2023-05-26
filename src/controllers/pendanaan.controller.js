import pendanaanService from "../services/pendanaan.service.js";

const create = async (req, res, next) => {
    try {
        res.json(await pendanaanService.createPendanaan(req))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const cancel = async (req, res, next) => {
    try {
        res.json(await pendanaanService.cancelPendanaan(req))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const tarikIncome = async(req, res, next) => {
    try {
        res.json(await pendanaanService.tarikIncomePendanaan(req))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export default {
    create,
    cancel,
    tarikIncome
}