import pengajuanService from "../services/pengajuan.service.js";

const create = async(req, res, next) => {
    try {
        const response = await pengajuanService.createPengajuan(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const updateById= async(req, res, next) => {
    try {
        const response = await pengajuanService.updatePengajuanById(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getAll = async (req,res, next) => {
    try {
        const response = await pengajuanService.getAllPengajuan(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getRiwayatCrowdfunding = async(req, res, next) => {
    try {
        const response = await pengajuanService.getRiwayatCrowdfunding(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getRiwayatPayment = async(req, res, next) => {
    try {
        const response = await pengajuanService.getRiwayatPayment(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getById = async(req, res, next) => {
    try {
        const response = await pengajuanService.getPengajuanById(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getLaporan = async(req, res, next) => {
    try {
        const response = await pengajuanService.getLaporanKeuangan(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getInvestor = async(req, res, next) => {
    try {
        const response = await pengajuanService.getInvestor(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const addLaporanKeuangan = async(req, res, next) => {
    try {
        const response = await pengajuanService.addLaporanKeuangan(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const cancel = async(req, res, next) => {
    try {
        const response = await pengajuanService.cancelPengajuan(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const tarikPendanaan = async(req, res, next) => {
    try {
        const response = await pengajuanService.tarikUangPendanaan(req)
        res.status(response.code).send(response) 
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const bayarCicilanPengajuan = async(req, res, next) => {
    try {
        const response = await pengajuanService.bayarCicilan(req)
        res.status(response.code).send(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export default {
    create,
    updateById,
    getRiwayatCrowdfunding,
    getRiwayatPayment,
    getById,
    cancel,
    addLaporanKeuangan,
    getAll,
    getLaporan,
    getInvestor,
    tarikPendanaan,
    bayarCicilanPengajuan,
}