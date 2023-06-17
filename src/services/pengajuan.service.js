import ResponseClass from "../models/response.model.js"
import { Pengajuan } from "../models/pengajuan.model.js"
import { LaporanKeuangan } from "../models/laporan_keuangan.model.js"
import { FotoUmkm } from "../models/foto_umkm.model.js"
import Users from "../models/users.model.js"
import { Op, Sequelize } from "sequelize"
import { Pendanaan } from "../models/pendanaan.model.js"
import Wallets from "../models/wallet.model.js"
import WalletDebits from "../models/walletDebit.model.js"
import utilsService from "./utils.service.js"
import walletCredits from "../models/walletCredit.model.js"
import schedule from "node-schedule"
import moment from "moment-timezone"

async function createPengajuan(request){

    const {
        pekerjaan,
        sektor,
        deskripsi,
        penghasilan,
        plafond,
        tenor,
        bagi_hasil,
        jenis_angsuran,
        akad,
        username,
    } = request.body

    var responseError = new ResponseClass.ErrorResponse();
    var responseSuccess = new ResponseClass.SuccessResponse();

    try {
        
        moment.tz.setDefault('Asia/Jakarta')
        //menghitung tanggal berakhir (crowdfunding  dilakukan selama 7 hari)
        const tgl_mulai = moment().toDate()
        const tgl_berakhir = moment().add(7, 'days').toDate()
        const tgl_mulai_bayar = moment().add(37, 'days').toDate()

        const pemilik = await Users.findOne({ 
            where:{username: username},
            attributes: ['id']
        })

        //check apakah akun sudah melakukan pengajuan atau belum
        const existingPengajuan = await Pengajuan.findOne({
            where: {
                pemilikId: pemilik.id,
                status: ["Menunggu Verifikasi", "In Progress", "Payment Period"]
            }
        })

        console.log(existingPengajuan)
        if (existingPengajuan) {
            responseError.message = "Anda sudah melakukan pengajuan mohon selesaikan terlebih dahulu"
            return responseError
        }
        
        //menghitung jumlah angsuran
        const jml_angsuran = hitungJmlAngsuran(plafond, tenor, bagi_hasil)

        //post data ke database
        const newPengajuan = await Pengajuan.create({
            pemilikId: pemilik.id,
            pekerjaan,
            sektor,
            deskripsi,
            penghasilan: penghasilan,
            plafond: parseInt(plafond),
            tenor: parseInt(tenor),
            bagi_hasil: parseInt(bagi_hasil),
            jenis_angsuran,
            jml_angsuran,
            akad,
            tgl_mulai: tgl_mulai,
            tgl_berakhir: tgl_berakhir,
            tgl_mulai_bayar: tgl_mulai_bayar,
        })

        //cek apakah input file ada
        if (!request.files) {
            responseError.message = "Mohon cantumkan Foto dan laporan keuangan dari UMKM!"
            return responseError
        }

        //ambil url dari cloudinary
        const image1_url = request.files[0].path
        const image2_url = request.files[1].path
        const image3_url = request.files[2].path

        const pengajuanId = newPengajuan.id

        //masukan foto UMKM ke dalam tabel fotoUMKM
        const newFotoUmkm = await FotoUmkm.create({
            pengajuanId,
            image1_url: image1_url,
            image2_url: image2_url,
            image3_url: image3_url,
            image1_filename: request.files[0].filename,
            image2_filename: request.files[1].filename,
            image3_filename: request.files[2].filename,
        })

        //ambil url laporan dan masukan k dalam tabel laporan
        const laporan_url = request.files[3].path
        const newLaporan = await LaporanKeuangan.create({
            laporan_url: laporan_url,
            laporan_filename: request.files[3].filename,
            pengajuanId,
        })

        responseSuccess.message = "Create Pengajuan Successfull!"
        responseSuccess.data = {
            ...newPengajuan['dataValues'],
            foto_umkm: newFotoUmkm,
            laporan_keuangan: newLaporan,
        }
        return responseSuccess

    } catch (error) {
        console.log(error);
        responseError.message = error.message;
        return responseError;
    }
}

async function updatePengajuanById(request){
    var responseError = new ResponseClass.ErrorResponse();
    var responseSuccess = new ResponseClass.SuccessResponse();

    const { pengajuanId } = request.params

    const {
        pekerjaan,
        sektor,
        deskripsi,
        penghasilan,
        plafond,
        tenor,
        bagi_hasil,
        jenis_angsuran,
        akad,
        username,
    } = request.body

    try {
        const pemilik = await Users.findOne({
            where: {username: username},
        })
        const existingPengajuan = await Pengajuan.findByPk(pengajuanId)

        const jml_angsuran = hitungJmlAngsuran(plafond, tenor, bagi_hasil)
        const updatedPengajuan = await existingPengajuan.update({
            pekerjaan: pekerjaan,
            sektor: sektor,
            deskripsi: deskripsi,
            penghasilan: penghasilan,
            plafond: plafond,
            tenor: tenor,
            bagi_hasil: bagi_hasil,
            jenis_angsuran: jenis_angsuran,
            jml_angsuran: jml_angsuran,
            akad: akad,
        })

        const existingFotoUmkm = await FotoUmkm.findOne({where: {pengajuanId: pengajuanId}})
        if (request.file) {
            if (existingFotoUmkm.image1_filename !== request.files[0].filename) {
                existingFotoUmkm.image1_filename = request.files[0].filename
                existingFotoUmkm.image1_url = request.files[0].path
                existingFotoUmkm.save()
            }
            if (existingFotoUmkm.image2_filename !== request.files[1].filename) {
                existingFotoUmkm.image2_filename = request.files[1].filename
                existingFotoUmkm.image2_url = request.files[1].path
                existingFotoUmkm.save()
            }
            if (existingFotoUmkm.image3_filename !== request.files[2].filename) {
                existingFotoUmkm.image3_filename = request.files[2].filename
                existingFotoUmkm.image3_url = request.files[2].path
                existingFotoUmkm.save()
            }
        }

        responseSuccess.message = `Update Data UMKM ${pemilik.name} successfull!`
        responseSuccess.data = {
            ...updatedPengajuan['dataValues'],
            foto_umkm: existingFotoUmkm,
        }
        return responseSuccess


    } catch (error) {
        console.log(error);
        responseError.message = "update Pengajuan to database error";
        return responseError;
    }
}

async function getRiwayatCrowdfunding(request) {
    var responseError = new ResponseClass.ErrorResponse();
    var responseSuccess = new ResponseClass.SuccessResponse();

    const { username } = request.params

    try {
        //mengambil id pemilik pengajuan / akun
        const pemilik = await Users.findOne({ 
            where:{username: username},
            attributes: ['id']
        })

        //cari pengajuan berdasarkan pemilik
        const pengajuanResult = await Pengajuan.findAll({
            where: {
                pemilikId: pemilik.id,
                status: ['In Progress', 'Canceled', 'Menunggu Verifikasi', 'Rejected']
            },
            attributes: ['id', 'plafond', 'bagi_hasil', 'tenor', 'jml_pendanaan', 'tgl_mulai', 'tgl_berakhir', 'status']
        })

        if (pengajuanResult.length == 0) {
            responseSuccess.message = `akun ${username} saat ini tidak memiliki pengajuan pendanaan!`
            return responseSuccess
        }

        responseSuccess.message = "Get Riwayat Pengajuan Successful!"
        responseSuccess.data = pengajuanResult
        return responseSuccess
    } catch (error) {
        console.log(error);
        responseError.message = "get riwayat Pengajuan from database error";
        return responseError;
    }
}

async function getRiwayatPayment(request) {
    var responseError = new ResponseClass.ErrorResponse();
    var responseSuccess = new ResponseClass.SuccessResponse();

    const { username } = request.params

    try {
        //mengambil id pemilik pengajuan / akun
        const pemilik = await Users.findOne({ 
            where:{username: username},
            attributes: ['id']
        })

        //cari pengajuan berdasarkan pemilik
        const pengajuanResult = await Pengajuan.findAll({
            where: {
                pemilikId: pemilik.id,
                status: ["Payment Period" , "Lunas" , "Lunas Dini" , "Tepat Waktu"]
            },
            attributes: ['id', 'plafond', 'bagi_hasil', 'tenor', 'jml_pendanaan', 'tgl_mulai_bayar', 'jml_angsuran', 'status']
        })

        if (pengajuanResult.length == 0) {
            responseSuccess.message = `akun ${username} saat ini tidak memiliki pengajuan!`
            return responseSuccess
        }

        pengajuanResult.forEach(data => {
            const momentMulaiBayar = moment(data.tgl_mulai_bayar)
            data.dataValues.jatuh_tempo = momentMulaiBayar.add(data.tenor, 'weeks').toDate()
            // data.dataValues.jatuh_tempo = new Date(data.tgl_mulai_bayar.getTime() + (data.tenor * 7 * 24 * 60 * 60 * 1000))
            console.log(data)
        });

        responseSuccess.message = "Get Riwayat Pengajuan Successful!"
        responseSuccess.data = pengajuanResult
        return responseSuccess
    } catch (error) {
        console.log(error);
        responseError.message = "get riwayat Pengajuan from database error";
        return responseError;
    }
}

async function getPengajuanById(request) {
    var responseError = new ResponseClass.ErrorResponse();
    var responseSuccess = new ResponseClass.SuccessResponse();

    const {userId, pengajuanId} = request.params

    try {
        const pengajuanDetails = await Pengajuan.findOne({ 
            where: {id: pengajuanId},
            include: [
                {
                    model: Users,
                    as: "pemilikDetails",
                    attributes: ['name', 'alamat', 'img_url']
                }
            ]
        })

        const listInvestor = await Pendanaan.findAll({
            where: {pengajuanId: pengajuanId, status: "In Progress"},
            attributes: ['investorId']
        })

        let isFunded = false

        listInvestor.forEach((investor) => {
            if (userId == investor.investorId) {
                isFunded = true
            }
        })

        const fotoUmkm = await FotoUmkm.findOne({
            where: {pengajuanId: pengajuanId},
            attributes: ['image1_url', 'image2_url', 'image3_url']
        })

        if (!pengajuanDetails) {
            responseError.message = "Pengajuan Tidak ada!"
            return responseError
        }

        responseSuccess.message = `Get Pengajuan UMKM ${pengajuanDetails.pemilikDetails.name} successfull!`
        responseSuccess.data = {
            isFunded: isFunded,
            ...pengajuanDetails['dataValues'],
            foto_umkm: fotoUmkm
        }
        return responseSuccess
    } catch (error) {
        console.log(error);
        responseError.message = "get Pengajuan by id from database error";
        return responseError;
    }
}

async function addLaporanKeuangan(request){
    var responseError = new ResponseClass.ErrorResponse();
    var responseSuccess = new ResponseClass.SuccessResponse();

    const {pengajuanId} = request.params

    try {
        if (!request.file) {
            responseError.message = "File Laporan Keuangan tidak ada!"
            return responseError
        }

        let imageUrl = request.file.path
        let filename = request.file.filename

        const newLaporan = await LaporanKeuangan.create({
            pengajuanId: pengajuanId,
            laporan_url: imageUrl,
            laporan_filename: filename
        })

        responseSuccess.message = "Add new Laporan Keuangan successfull"
        responseSuccess.data = newLaporan
        return responseSuccess

    } catch (error) {
        console.log(error);
        responseError.message = "add new laporan keuangan to database error";
        return responseError;
    }
}

async function cancelPengajuan(request){
    var responseError = new ResponseClass.ErrorResponse();
    var responseSuccess = new ResponseClass.SuccessWithNoDataResponse();

    const { pengajuanId } = request.params

    try {
        
        //check apakah pengajuan memiliki pendanaan atau tidak
        const existingPendanaan = await Pendanaan.findAll({ where: {pengajuanId: pengajuanId}})
        
        if (existingPendanaan.length != 0) {
            //jika ada 
            responseError.message = "Pengajuan tidak dapat dibatalkan karena sudah memiliki Investor";
            return responseError;
        }

        //jika tidak ada batalkan
        const existingPengajuan = await Pengajuan.findOne({ where: {id : pengajuanId}})
        await existingPengajuan.update({
            status: "Canceled"
        })

        responseSuccess.message = "Pengajuan berhasil dibatalkan!"
        return responseSuccess
    } catch (error) {
        console.log(error);
        responseError.message = "change status in database error";
        return responseError;
    }
}

async function getAllPengajuan(req) {
    var responseError = new ResponseClass.ErrorResponse();
    var responseSuccess = new ResponseClass.SuccessResponse();

    try {   
        //pagination
        const pageNumber = req.query.page ? parseInt(req.query.page, 10) : 1
        const itemsPerPage = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10

        const offset = (pageNumber - 1) * itemsPerPage;
        const limit = itemsPerPage

        //query dan sort
        const wherePengajuan = {};
        const wherePemilik = {};
        let sortColumn = 'jml_pendanaan';
        if (req.query.sort) {
            sortColumn = 'createdAt';
        }
        const sortOrder = req.query.order ? req.query.order : 'DESC';

        wherePengajuan.status = {
            [Op.like]: `%In Progress%`
        };

        wherePengajuan.is_withdraw = false

        if (req.query.sektor) {
            wherePengajuan.sektor = {
              [Op.like]: `%${req.query.sektor}%`
            };
        }

        if (req.query.tenor) {
            wherePengajuan.tenor = {
                [Op.like]: `%${req.query.tenor}%`
            };
        }

        if (req.query.plafond) {
            wherePengajuan.plafond = {
                [Op.like]: `%${req.query.plafond}%`
            };
        }

        if (req.query.lokasi) {
            wherePemilik.alamat = {
                [Op.like]: `%${req.query.lokasi}%`
            }
        }

        const pengajuanResult = await Pengajuan.findAll({
            where: wherePengajuan,
            include:[
                {
                    model: Users,
                    as: "pemilikDetails",
                    attributes: ['name', 'alamat', 'img_url'],
                    where: wherePemilik,
                }
            ],
            order:[
                [sortColumn, sortOrder]
            ],
            offset: offset,
            limit: limit,
            attributes: ['id', 'sektor', 'plafond', 'bagi_hasil', 'tenor', 'jml_pendanaan', 'tgl_mulai', 'tgl_berakhir']
        })

        if (pengajuanResult.length == 0) {
            responseSuccess.message = "Tidak ada list pengajuan saat ini!"
            responseSuccess.data = pengajuanResult
            return responseSuccess
        }

        responseSuccess.message = "Get all pengajuan successfull!"
        responseSuccess.data = pengajuanResult
        return responseSuccess

    } catch (error) {
        console.log(error)
        responseError.message = "Get pengajuan from database error!"
        return responseError
    }
}

async function getLaporanKeuangan(request){
    var responseError = new ResponseClass.ErrorResponse();
    var responseSuccess = new ResponseClass.SuccessResponse();

    const { pengajuanId } = request.params

    try {
        const laporanResult = await LaporanKeuangan.findAll({
            where: {pengajuanId: pengajuanId},
            attributes: ['id', 'laporan_url']
        })

        if (!laporanResult) {
            responseSuccess.message = "Laporan Keuangan is not found"
            return responseSuccess
        }

        if (laporanResult.length == 0) {
            responseSuccess.message = "Belum ada Laporan keuangan yang dimasukan!"
            responseSuccess.data = laporanResult
            return responseSuccess
        }

        responseSuccess.message = "get laporan keuangan successfull!"
        responseSuccess.data = laporanResult
        return responseSuccess
    } catch (error) {
        console.log(error)
        responseError.message = "Get pengajuan from database error!"
        return responseError
    }
}

async function getInvestor(request) {
    var responseError = new ResponseClass.ErrorResponse();
    var responseSuccess = new ResponseClass.SuccessResponse();

    const {pengajuanId} = request.params

    try {

        const listInvestor = await Pendanaan.findAll({
            where: {
                pengajuanId: pengajuanId,
                status: ["In Progress", "Completed"],
            },
            include: [
                {
                    model: Users,
                    as: "investorDetails",
                    attributes: ['name', 'img_url']
                }
            ],
            attributes: ['investorId', 'nominal']
        })
        
        if (listInvestor.length == 0) {
            responseSuccess.message = "Tidak ada Investor yang melakukan pendaanaan"
            responseSuccess.data = listInvestor
            return responseSuccess
        }


        responseSuccess.message = "Get list investor successfull!"
        responseSuccess.data = listInvestor
        return responseSuccess
    } catch (error) {
        console.log(error)
        responseError.message = "Get list investor from database error!"
        return responseError
    }
}

async function tarikUangPendanaan(request){
    let responseError = new ResponseClass.ErrorResponse();
    let responseSuccess = new ResponseClass.SuccessWithNoDataResponse();

    const {pengajuanId} = request.params

    try {
        const pengajuanData = await Pengajuan.findOne({ 
            where: {
                id: pengajuanId,
                status: "In Progress"
            }, 
            attributes:['id', 'plafond', 'tenor', 'bagi_hasil', 'tgl_mulai_bayar', 'jml_angsuran', 'status', 'jml_pendanaan', 'pemilikId']
        })

        const walletUmkm = await Wallets.findOne({
            where: {userId: pengajuanData.pemilikId},
            attributes: ['id', 'balance']
        })   

        if (!walletUmkm) {
            responseError.message = "Wallet tidak ditemukan!"
            return responseError
        }

        if (!pengajuanData) {
            responseError.message = "Pengajuan tidak ditemukan!"
            return responseError
        }

        //transfer uang ke saldo umkm
        walletUmkm.balance += pengajuanData.jml_pendanaan
        walletUmkm.save()

        //input data penarikan hasil crowdfungding pada WalletDebit START
        const umkmDebits = await WalletDebits.create({
            amount: pengajuanData.jml_pendanaan,
            walletId: walletUmkm.id,
            type: "Penarikan Uang Crowdfunding"
        })

        const transactionCode = "CC" + walletUmkm.id + utilsService.generateId() + umkmDebits.id;
        const paymentCode = walletUmkm.id + utilsService.generateCode() + umkmDebits.id;

        umkmDebits.transactionCode = transactionCode
        umkmDebits.paymentCode = paymentCode
        umkmDebits.save()
        //input data penarikan hasil crowdfungding pada WalletDebit END

        // Hitung profit total dan weekly profit ketika crowdfunding selesai dilakukan START
        const listInvestor = await Pendanaan.findAll({
            where: {
                pengajuanId: pengajuanId,
                status: "In Progress"
            },
            attributes: ['id', 'nominal', 'profit', 'weekly_profit', 'weekly_income']
        })

        if (!listInvestor) {
            responseError.message = "Pengajuan tidak memiliki investor!"
            return responseError
        }

        listInvestor.forEach((investor) => {
            const weeklyProfit = hitungWeeklyProfit(pengajuanData, investor.nominal)
            const totalProfit = weeklyProfit * pengajuanData.tenor
            investor.profit = totalProfit
            investor.weekly_profit = weeklyProfit
            investor.weekly_income = investor.nominal/pengajuanData.tenor
            investor.save()
        })
        // Hitung profit total dan weekly profit ketika crowdfunding selesai dilakukan END

        // Ganti status crowdfunding menjadi finished
        pengajuanData.is_withdraw = true
        pengajuanData.jml_angsuran = hitungJmlAngsuran(pengajuanData.jml_pendanaan, pengajuanData.tenor, pengajuanData.bagi_hasil)
        pengajuanData.save()

        //setup node schedule
        schedule.scheduleJob(pengajuanData.tgl_mulai_bayar, () => {
            pengajuanData.status = "Payment Period"
            pengajuanData.save()
        })
       
        responseSuccess.message = "Uang Pendanaan berhasil disimpan ke saldo anda!"
        return responseSuccess

    } catch (error) {
        console.log(error)
        responseError.message = "Tarik pendanaan in database error!"
        return responseError
    }
}

async function bayarCicilan(request){
    let responseError = new ResponseClass.ErrorResponse();
    let responseSuccess = new ResponseClass.SuccessWithNoDataResponse();

    const {pengajuanId} = request.params

    try {
        const pengajuanData = await Pengajuan.findOne({
            where: {
                id: pengajuanId,
                status: "Payment Period",
            },
            attributes: ['id', 'tenor', 'jml_angsuran', 'status', 'pemilikId', 'angsuran_dibayar', 'tgl_mulai_bayar']
        })

        //pengurangan saldo umkm
        const walletUmkm = await Wallets.findOne({
            where: {userId: pengajuanData.pemilikId},
            attributes: ['id','balance']
        })

        if (walletUmkm.balance < pengajuanData.jml_angsuran) {
            responseError.message = "Saldo anda tidak mencukupi!"
            return responseError
        }

        // ambil data list investor
        const listInvestor = await Pendanaan.findAll({
            where: {
                pengajuanId: pengajuanId,
                status: "In Progress"
            },
        })

        if (!listInvestor) {
            responseError.message = "Pengajuan tidak memiliki investor!"
            return responseError
        }

        walletUmkm.balance -= pengajuanData.jml_angsuran
        walletUmkm.save()

        // pencatatan CREDIT / uang keluar dari saldo umkm
        const umkmCredits = await walletCredits.create({ 
            amount: pengajuanData.jml_angsuran,
            type: "Bayar Cicilan",
            walletId: walletUmkm.id
        })

        const transactionCode = "CC" + utilsService.generateId() + walletUmkm.id + umkmCredits.id;
        umkmCredits.transactionCode = transactionCode
        umkmCredits.save()

        //jumlah angsuran dibayar bertambah
        pengajuanData.angsuran_dibayar += pengajuanData.jml_angsuran
        pengajuanData.save()
        const totalKewajibanBayar = pengajuanData.tenor * pengajuanData.jml_angsuran

        const mulaiBayar = moment(pengajuanData.tgl_mulai_bayar)
        const jatuhTempo = mulaiBayar.add(pengajuanData.tenor, 'weeks')

        // const jatuhTempo = new Date(pengajuanData.tgl_mulai_bayar.getTime() + (pengajuanData.tenor * 7 * 24 * 60 * 60 * 1000))

        
        //memasukan jumlah repayment dan status pembayaran ke data penadanaan
        listInvestor.forEach((investorData) => {
            investorData.repayment += investorData.weekly_income + investorData.weekly_profit
            const expectedTotalIncome = investorData.nominal + investorData.profit

            if (investorData.repayment >= expectedTotalIncome) {
                investorData.tgl_selesai = moment().toDate()

                if (investorData.tgl_selesai < jatuhTempo) {
                    investorData.status = "Lunas Dini"
                }else if(investorData.tgl_selesai == jatuhTempo){
                    investorData.status = "Tepat Waktu"
                }else{
                    investorData.status = "Lunas"
                }

                if (pengajuanData.angsuran_dibayar >= totalKewajibanBayar) {
                    pengajuanData.status = investorData.status
                }
                pengajuanData.save()
            }
            investorData.save()
        })

        responseSuccess.message = "Pembayaran Cicilan berhasil!"
        return responseSuccess

    } catch (error) {
        console.log(error)
        responseError.message = "Update Bayar Cicilan to database error!"
        return responseError
    }
}

async function getRekomendasiPengajuan(){
    let responseError = new ResponseClass.ErrorResponse();
    let responseSuccess = new ResponseClass.SuccessWithNoDataResponse();
    
    try {
        const pengajuanCounts = await Pengajuan.findAll({
            attributes: [
                'id', 'sektor', 'plafond', 'bagi_hasil', 'tenor', 'jml_pendanaan', 'tgl_mulai', 'tgl_berakhir', 
                [Sequelize.fn('COUNT', Sequelize.col('status')), 'lunas_dini_count']
            ],
            where: {
                status: 'lunas dini'
            },
            include:[
                {
                    model: Users,
                    as: "pemilikDetails",
                    attributes: ['name', 'alamat'],
                }
            ],
            group: ['id', 'sektor', 'plafond', 'bagi_hasil', 'tenor', 'jml_pendanaan', 'tgl_mulai', 'tgl_berakhir', 'pemilikDetails.name', 'pemilikDetails.alamat'],
            order: [[Sequelize.literal('lunas_dini_count'), 'DESC']],
        });
          
        responseSuccess.message = "Get Rekomenadasi Pengajuan Success!"
        responseSuccess.data = pengajuanCounts;
        return responseSuccess;
          
    } catch (error) {
        console.log(error);
        responseError.message = "Get Rekomendasi Pengajuan from database error!"
        return responseError
    }
}

function hitungWeeklyProfit(pengajuanData, nominal){

    /* 
        1. rumus perhitungan persenan bagi hasil setiap investor per minggu
        = nominal pendanaan / jml_pendanaan yang terkumpul * 100%

        2. Menghitung weekly bagi hasil 
        = ((pendanaan terkumpul / tenor) * %bagi hasil) * (persenan bagi hasil perminggu)
    */

    const persen_weekly_bagi_hasil = (nominal/pengajuanData.jml_pendanaan) * 100
    const weekly_bagi_hasil = ((pengajuanData.jml_pendanaan / pengajuanData.tenor) * (pengajuanData.bagi_hasil/100)) * (persen_weekly_bagi_hasil/100)

    return weekly_bagi_hasil
}

function hitungJmlAngsuran(plafond, tenor, bagi_hasil) {
    /* 
        1. Rumus perhitungan jumlah angsuran per-tenor
        = (plafond/tenor * %bagi hasil)

        2.  rumus jml_angsuran
        = (plafond/tenor) + jml_bagi hasil 
    */
    const jml_bagi_hasil = (plafond/tenor) * (bagi_hasil/100)

    const jml_angsuran = (plafond/tenor) + jml_bagi_hasil

    return jml_angsuran
}

export default {
    createPengajuan,
    updatePengajuanById,
    getRiwayatCrowdfunding,
    getPengajuanById,
    addLaporanKeuangan,
    cancelPengajuan,
    getAllPengajuan,
    getLaporanKeuangan,
    getInvestor,
    tarikUangPendanaan,
    getRiwayatPayment,
    bayarCicilan,
    getRekomendasiPengajuan,
}