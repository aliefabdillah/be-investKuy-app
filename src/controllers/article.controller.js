import artikelService from "../services/artikel.service.js";

const getAll = async (req, res, next) => {
    try {
        const response = await artikelService.getAllArticle()
        res.status(response.code).send(response)
    } catch (error) {
        console.error(error)
        next(error)
    }
}

const getById = async (req, res) => {
    try {
        const response = await artikelService.getDetailsArticle(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.error(error)
    }
}

const create = async (req, res) => {
    try {
        const response = await artikelService.createArticle(req)
        res.json()
    } catch (error) {
        console.error(error)
    }
}

const update = async (req, res) => {
    try {
        const response = await artikelService.updateArticle(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.error(error)
    }
}

const deleteById = async (req, res) => {
    try {
        const response = await artikelService.deleteArticle(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.error(error)
    }
}

export default {
    getAll,
    getById, 
    create,
    update,
    deleteById
}