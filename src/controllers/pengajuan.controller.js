import pengajuanService from "../services/pengajuan.service.js";

const create = async(req, res, next) => {
    try {
        res.json(await pengajuanService.createPengajuan(req))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const updateById= async(req, res, next) => {
    try {
        res.json(await pengajuanService.updatePengajuanById(req))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getAll = async (req,res, next) => {
    try {
        res.json(await pengajuanService.getAllPengajuan(req))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getRiwayatCrowdfunding = async(req, res, next) => {
    try {
        res.json(await pengajuanService.getRiwayatCrowdfunding(req))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getRiwayatPayment = async(req, res, next) => {
    try {
        res.json(await pengajuanService.getRiwayatPayment(req))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getById = async(req, res, next) => {
    try {
        res.json(await pengajuanService.getPengajuanById(req))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getLaporan = async(req, res, next) => {
    try {
        res.json(await pengajuanService.getLaporanKeuangan(req))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getInvestor = async(req, res, next) => {
    try {
        res.json(await pengajuanService.getInvestor(req))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const addLaporanKeuangan = async(req, res, next) => {
    try {
        res.json(await pengajuanService.addLaporanKeuangan(req))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const cancel = async(req, res, next) => {
    try {
        res.json(await pengajuanService.cancelPengajuan(req))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const tarikPendanaan = async(req, res, next) => {
    try {
        res.json(await pengajuanService.tarikUangPendanaan(req))
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
}