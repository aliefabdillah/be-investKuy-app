import FaqService from '../services/faq.service.js';

const get = async (req, res) => {
    try {
        res.json(await FaqService.getFaq())
    } catch (error) {
        console.log(error)
    }
}

const create = async(req, res, next) => {
    try {
        res.json(await FaqService.createFaq(req));
    } catch (error) {
        console.log(error)
        next(error);
    }
}

const update = async(req, res, next) => {
    try {
        res.json(await FaqService.updateFaqById(req))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const deleteById = async(req, res, next) => {
    try {
        res.json(await FaqService.deleteFaqById(req))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

/* const getById = async(req, res, next) => {
    try {
        res.json(await ProgramsService.getProgramById(req));
    } catch (error) {
        console.log(error)
        next(error)
    }
} */

export default{
    get,
    create,
    update,
    deleteById,
}