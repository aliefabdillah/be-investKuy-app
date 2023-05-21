import { Pendanaan } from "../models/pendanaan.model";
import { Pengajuan } from "../models/pengajuan.model";
import ResponseClass from "../models/response.model.js"

async function createPendanaan(request) {
    let responseSuccess = new ResponseClass.SuccessResponse()
    let responseError = new ResponseClass.ErrorResponse()

    const { userId, pengajuanId} = request.params
    const { nominal } = request.body

    try {    
        //ambil data plafond. tenor, dan bagi_hasil
        const pengajuanData = await Pengajuan.findOne({ 
            where: {id: pengajuanId}, 
            attributes:['plafond', 'tenor', 'bagi_hasil']
        })

        //cek pengajuan
        if (!pengajuanData) {
            responseError.message = "Pengajuan not found!"
            return responseError
        }

        //hitung profit setiap pendanaan
        const profit = hitungProfit(pengajuanData, nominal)

        //create pendanaan baru
        const newPendanaan = await Pendanaan.create({
            nominal: nominal,
            profit: profit,
            pengajuanId: pengajuanId,
            investorId: userId,
        })

        // TODO : PENGURANGAN SALDO DI INVESTOR DAN PENAMBAHAN JML_PENDANAAN DI PENGAJUAN

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
            }
        })

        //cek pendanaan ada atau tidak
        if (!existingPendanaan) {
            responseError.message = `Cannot find Pendanaan!`
            return responseError
        }

        //change status pendanaan
        existingPendanaan.status = "Canceled"
        existingPendanaan.save()

        // TODO : PENGEMBALIAN SALDO KE INVESTOR DAN PENGURANGAN JUMLAH PENDANAAN DI PENGAJUAN

        responseSuccess.message = "Delete pendanaan successfull!"
        return responseSuccess
    } catch (error) {
        console.log(error.message)
        responseError.message = "Pendanaan gagal disimpan ke database!"
        return responseError
    }
}

function hitungProfit(pengajuanData, nominal){

    /* 
        1. rumus perhitungan jmlh bagi hasil:
        = jumlah angsuran per-tenor * Tenor
        
        2. Rumus perhitungan jumlah angsuran per-tenor
        = (plafond/tenor * %bagi hasil)

        3. Perhitungan keuntungan setiap investor
        = (inves/plafond * 100%) * jumlah bagi hasil
    */

    const jml_bagi_hasil = pengajuanData.plafond/pengajuanData.tenor * 11.5/100
    const profit = (nominal/pengajuanData.plafond * 100) * jml_bagi_hasil

    return profit
}

export default {
    createPendanaan,
    cancelPendanaan,
}