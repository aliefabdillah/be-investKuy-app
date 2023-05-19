import artikelService from "../services/artikel.service.js";

const getAll = async (req, res, next) => {
    try {
        res.json(await artikelService.getAllArticle())
    } catch (error) {
        console.error(error)
        next(error)
    }
}

const getById = async (req, res) => {
    try {
        res.json(await artikelService.getDetailsArticle(req))
    } catch (error) {
        console.error(error)
    }
}

const create = async (req, res) => {
    try {
        res.json(await artikelService.createArticle(req))
    } catch (error) {
        console.error(error)
    }
}

const update = async (req, res) => {
    try {
        res.json(await artikelService.updateArticle(req))
    } catch (error) {
        console.error(error)
    }
}

const deleteById = async (req, res) => {
    try {
        res.json(await artikelService.deleteArticle(req))
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