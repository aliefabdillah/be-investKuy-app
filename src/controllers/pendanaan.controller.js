import pendanaanService from "../services/pendanaan.service";

const create = async (req, res, next) => {
    try {
        res.json(await pendanaanService.createPendanaan(req))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export default {
    create
}