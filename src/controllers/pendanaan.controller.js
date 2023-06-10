import { response } from "express";
import pendanaanService from "../services/pendanaan.service.js";

const create = async (req, res, next) => {
    try {
        const response = await pendanaanService.createPendanaan(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const cancel = async (req, res, next) => {
    try {
        const response = await pendanaanService.cancelPendanaan(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const tarikIncome = async(req, res, next) => {
    try {
        const response = await pendanaanService.tarikIncomePendanaan(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getInProgressPendanaan = async(req, res, next) => {
    try {
        const response = await pendanaanService.getInProgressPendanaan(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getCompletedPendanaan = async(req, res, next) => {
    try {
        const response = await pendanaanService.getCompletedPendanaan(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export default {
    create,
    cancel,
    tarikIncome,
    getInProgressPendanaan,
    getCompletedPendanaan
}