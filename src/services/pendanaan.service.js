import { Pendanaan } from "../models/pendanaan.model.js";
import { Pengajuan } from "../models/pengajuan.model.js";
import ResponseClass from "../models/response.model.js"
import Wallets from "../models/wallet.model.js";
import walletCredits from "../models/walletCredit.model.js";
import utilsService from "./utils.service.js";
import Users from "../models/users.model.js";
import WalletDebits from "../models/walletDebit.model.js";
import { request } from "express";

async function createPendanaan(request) {
    let responseSuccess = new ResponseClass.SuccessResponse()
    let responseError = new ResponseClass.ErrorResponse()

    const { userId, pengajuanId} = request.params
    const { nominal } = request.body

    try {    
        //ambil data plafond. tenor, dan bagi_hasil
        const pengajuanData = await Pengajuan.findOne({ 
            where: {id: pengajuanId}, 
            attributes:['id', 'plafond', 'tenor', 'bagi_hasil', 'jml_pendanaan']
        })

        //cek pengajuan
        if (!pengajuanData) {
            responseError.message = "Pengajuan not found!"
            return responseError
        }

        if (pengajuanData.plafond == pengajuanData.jml_pendanaan) {
            responseError.message = "Pendanaan sudah mencapai maximal!"
            return responseError
        }

        //cek jumlah saldo
        const currentWallet = await Wallets.findOne({
            where: {userId: userId}, 
            include: [
                {
                    model: Users,
                    as: "walletsDetails",
                    attributes: ['is_verified']
                }
            ],
            attributes:['id','balance']
        })

        if (!currentWallet) {
            responseError.message = "Wallet Not Found"
            return responseError
        }

        if (!currentWallet.walletsDetails.is_verified) {
            responseError.message = "Akun Belum Diverifikasi!"
            return responseError
        }

        if (currentWallet.balance < nominal) {
            responseError.message = "Saldo anda tidak mencukupi!"
            return responseError
        }

        //cek apakah user sudah melakukan pendanaan pada pengajuan terkait atau belum
        const existingInvestor = await Pendanaan.findOne({
            where: {
                investorId: userId,
                pengajuanId: pengajuanId,
                status: "In Progress"
            }
        })

        if (existingInvestor) {
            responseError.message = "Anda sudah melakukan pendanaan pada pengajuan ini silahkan selesaikan terlebih dahulu!"
            return responseError
        }

        //hitung profit setiap pendanaan
        // const profit = hitungProfit(pengajuanData, nominal)

        //create pendanaan baru
        const newPendanaan = await Pendanaan.create({
            nominal: nominal,
            pengajuanId: pengajuanId,
            investorId: userId,
        })

        // proses CREDIT / uang keluar dari rekening investor
        const investorCredits = await walletCredits.create({ 
            amount: nominal,
            type: "Pendanaan",
            walletId: currentWallet.id
        })
        
        const transactionCode = "CC" + utilsService.generateId() + currentWallet.id + investorCredits.id;
        investorCredits.transactionCode = transactionCode
        investorCredits.save()

        /* PENGURANGAN SALDO DI INVESTOR DAN PENAMBAHAN JML_PENDANAAN DI PENGAJUAN */
        //saldo berkurang
        currentWallet.balance -= investorCredits.amount
        currentWallet.save()

        //saldo dari investor masuk ke jumlah pendanaan sampai waktu berakhirnya crowdfunding
        pengajuanData.jml_pendanaan += investorCredits.amount
        pengajuanData.save() 
       
        responseSuccess.message = "Pendanaan berhasil dibuat!"
        responseSuccess.data = newPendanaan
        return responseSuccess

    } catch (error) {
        console.log(error.message)
        responseError.message = "Pendanaan gagal disimpan ke database!"
        return responseError
    }
}

async function cancelPendanaan(request) {
    let responseSuccess = new ResponseClass.SuccessWithNoDataResponse()
    let responseError = new ResponseClass.ErrorResponse()

    const { userId, pengajuanId } = request.params

    try {

        //get pendanaan dengan userId dan pengajuan id
        const existingPendanaan = await Pendanaan.findOne({ 
            where: { 
                investorId: userId,
                pengajuanId: pengajuanId, 
                status: "In Progress",
            },
            include: [
                {
                    model: Pengajuan,
                    as: "pengajuanDetails",
                    attributes: ['tgl_berakhir']
                }
            ]
        })

        //cek pendanaan ada atau tidak
        if (!existingPendanaan) {
            responseError.message = `Cannot find Pendanaan!`
            return responseError
        }

        //ambil data pengajuan dan wallet
        const pengajuanData = await Pengajuan.findOne({ where: {id: pengajuanId}, attributes:['id', 'jml_pendanaan']})
        const currentWallet = await Wallets.findOne({where: {userId: userId}, attributes:['id','balance']})

        if (!currentWallet) {
            responseError.message = "Wallet Not Found"
            return responseError
        }

        //cek apakah tanggal pembatalan sudah melebih tanggal terakhir crowdfunding atau tidak
        const currentDate = new Date()
        if (currentDate > existingPendanaan.pengajuanDetails.tgl_berakhir) {
            responseError.message = `Anda tidak dapat membatalkan pendanaan karena dana sudah disetorkan ke umkm`
            return responseError
        }

        //change status pendanaan
        existingPendanaan.status = "Canceled"
        existingPendanaan.save()

        // PENGEMBALIAN SALDO KE INVESTOR DAN PENGURANGAN JUMLAH PENDANAAN DI PENGAJUAN
        currentWallet.balance += existingPendanaan.nominal
        currentWallet.save()
        pengajuanData.jml_pendanaan -= existingPendanaan.nominal
        pengajuanData.save()

        //input data pengembalian pada WalletDebit
        const investorDebits = await WalletDebits.create({
            amount: existingPendanaan.nominal,
            walletId: currentWallet.id,
            type: "Pembatalan Pendanaan"
        })

        const transactionCode = "CC" + currentWallet.id + utilsService.generateId() + investorDebits.id;
        const paymentCode = currentWallet.id + utilsService.generateCode() + investorDebits.id;

        investorDebits.transactionCode = transactionCode
        investorDebits.paymentCode = paymentCode
        investorDebits.save()

        responseSuccess.message = "Cancel pendanaan successfull!"
        return responseSuccess

    } catch (error) {
        console.log(error.message)
        responseError.message = "Pendanaan gagal disimpan ke database!"
        return responseError
    }
}

async function tarikIncomePendanaan(request) {
    let responseSuccess = new ResponseClass.SuccessWithNoDataResponse()
    let responseError = new ResponseClass.ErrorResponse()

    const {pendanaanId} = request.params

    try {
        const pendanaanData = await Pendanaan.findOne({
            where: {
                id: pendanaanId,
            },
            attributes: ['id', 'tgl_selesai', 'repayment', 'investorId']
        })

        if (!pendanaanData) {
            responseError.message = "Pendanaan tidak ditemukan"
            return responseError
        }

        if (!pendanaanData.tgl_selesai) {
            responseError.message = "Anda dapat menarik income ketika pendaan telah selesai"
            return responseError
        }

        const currentWalletInvestor = await Wallets.findOne({
            where: {userId: pendanaanData.investorId},
            attributes: ['id', 'balance']
        })

        if (!currentWalletInvestor) {
            responseError.message = "wallet tidak ditemukan"
            return responseError
        }

        currentWalletInvestor.balance += pendanaanData.repayment
        currentWalletInvestor.save()

        const walletInvestorDebit = await WalletDebits.create({
            amount: pendanaanData.repayment,
            type: "Penarikan Income Pendanaan",
            walletId: currentWalletInvestor.id
        })
        
        const transactionCode = "CC" + currentWalletInvestor.id + utilsService.generateId() + walletInvestorDebit.id;
        const paymentCode = currentWalletInvestor.id + utilsService.generateCode() + walletInvestorDebit.id;

        walletInvestorDebit.transactionCode = transactionCode
        walletInvestorDebit.paymentCode = paymentCode
        walletInvestorDebit.save()

        responseSuccess.message = "Penarikan dana ke saldo berhasil!"
        return responseSuccess

    } catch (error) {
        console.log(error.message)
        responseError.message = "Gagal melakukan tarik dana ke database!"
        return responseError
    }
}

async function getInProgressPendanaan(request) {
    let responseSuccess = new ResponseClass.SuccessResponse()
    let responseError = new ResponseClass.ErrorResponse()

    const {userId} = request.params

    try {
        const pendanaanData = await Pendanaan.findAll({
            where: {
                investorId: userId,
                status: "In Progress"
            },
            include: [
                {
                    model: Pengajuan,
                    as: "pengajuanDetails",
                    include: [
                        {
                            model: Users,
                            as: "pemilikDetails",
                            attributes: ['id', 'name', 'alamat']
                        }
                    ],
                    attributes: ['id', 'sektor', 'plafond', 'bagi_hasil', 'tenor']
                }
            ],
            attributes: ['id', 'nominal', 'repayment']
        })

        if (!pendanaanData) {
            responseError.message = "Pendanaan Tidak Ada!"
            return responseError
        }

        if (pendanaanData.length == 0) {
            responseSuccess.message = "Tidak Ada Pendanaan Berlangsung!"
            responseSuccess.data = pendanaanData
            return responseSuccess
        }

        responseSuccess.message = "Get Riwayat Pendanaan In Progress successfull!"
        responseSuccess.data = pendanaanData
        return responseSuccess
    } catch (error) {
        console.log(error.message)
        responseError.message = "Gagal mengambil data pendanaan dari database!"
        return responseError
    }
}

async function getCompletedPendanaan(request) {
    let responseSuccess = new ResponseClass.SuccessResponse()
    let responseError = new ResponseClass.ErrorResponse()

    const {userId} = request.params

    try {
        const pendanaanData = await Pendanaan.findAll({
            where: {
                investorId: userId,
                status: "Lunas Dini" || "Tepat Waktu" || "Lunas"
            },
            include: [
                {
                    model: Pengajuan,
                    as: "pengajuanDetails",
                    include: [
                        {
                            model: Users,
                            as: "pemilikDetails",
                            attributes: ['id', 'name', 'alamat']
                        }
                    ],
                    attributes: ['id', 'sektor', 'plafond', 'bagi_hasil', 'tenor']
                }
            ],
            attributes: ['id', 'nominal', 'profit', 'status', 'tgl_selesai']
        })

        if (!pendanaanData) {
            responseError.message = "Pendanaan Tidak Ada!"
            return responseError
        }

        if (pendanaanData.length == 0) {
            responseSuccess.message = "Pendanaan Selesai Tidak Ada!"
            responseSuccess.data = pendanaanData
            return responseSuccess
        }

        responseSuccess.message = "Get Riwayat Pendanaan Completed successfull!"
        responseSuccess.data = pendanaanData
        return responseSuccess
    } catch (error) {
        console.log(error.message)
        responseError.message = "Gagal mengambil data pendanaan dari database!"
        return responseError
    }
}


export default {
    createPendanaan,
    cancelPendanaan,
    tarikIncomePendanaan,
    getInProgressPendanaan,
    getCompletedPendanaan,
}