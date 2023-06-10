import FaqService from '../services/faq.service.js';

const get = async (req, res) => {
    try {
        const response = await FaqService.getFaq()
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
    }
}

const create = async(req, res, next) => {
    try {
        const response = await FaqService.createFaq(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
        next(error);
    }
}

const update = async(req, res, next) => {
    try {
        const response = await FaqService.updateFaqById(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const deleteById = async(req, res, next) => {
    try {
        const response = await FaqService.deleteFaqById(req)
        res.status(response.code).send(response)
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