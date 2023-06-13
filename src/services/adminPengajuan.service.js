import ResponseClass from "../models/response.model.js"
import { Pengajuan } from "../models/pengajuan.model.js"
import Users from "../models/users.model.js";
import { Op } from "sequelize";
import { FotoUmkm } from "../models/foto_umkm.model.js";
import { LaporanKeuangan } from "../models/laporan_keuangan.model.js";

async function getAllPengajuan(req) {
  let responseError = new ResponseClass.ErrorResponse();
  let responseSuccess = new ResponseClass.SuccessResponse();

  try {   
    //pagination
    const pageNumber = req.query.page ? parseInt(req.query.page, 10) : 1
    const itemsPerPage = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10

    const offset = (pageNumber - 1) * itemsPerPage;
    const limit = itemsPerPage

    const wherePengajuan = {};
    const wherePemilik = {};

    if (req.query.status) {
      wherePengajuan.status = {
        [Op.like]: `%${req.query.status}%`
      };
    }

    if (req.query.sektor) {
      wherePengajuan.sektor = {
        [Op.like]: `%${req.query.sektor}%`
      };
    }

    if (req.query.lokasi) {
      wherePemilik.alamat = {
        [Op.like]: `%${req.query.lokasi}%`
      }
    }

    if (req.query.namaPemilik) {
      wherePemilik.name = {
        [Op.like]: `%${req.query.namaPemilik}%`
      }
    }

    const pengajuanResult = await Pengajuan.findAll({
      where: wherePengajuan,
      include:[
          {
              model: Users,
              as: "pemilikDetails",
              attributes: ['name', 'alamat'],
              where: wherePemilik
          }
      ],
      offset: offset,
      limit: limit,
      attributes: ['id', 'sektor', 'plafond', 'bagi_hasil', 'tenor', 'jml_pendanaan', 'tgl_mulai', 'tgl_berakhir', 'status']
    })

    if (pengajuanResult.length == 0) {
      responseSuccess.message = "Tidak ada list pengajuan saat ini!"
      responseSuccess.data = pengajuanResult
      return responseSuccess
    }

    responseSuccess.message = "Get all pengajuan successfull!"
    responseSuccess.data = pengajuanResult
    return responseSuccess

  } catch (error){
    console.log(error)
    responseError.message = "Get pengajuan from database error!"
    return responseError
  }
}

async function getDetailsPengajuanById(req){
  let responseError = new ResponseClass.ErrorResponse();
  let responseSuccess = new ResponseClass.SuccessResponse();

  const {pengajuanId} = req.params;

  try {
    const pengajuanDetails = await Pengajuan.findOne({ 
      where: {id: pengajuanId},
      include: [
          {
              model: Users,
              as: "pemilikDetails",
              attributes: ['name', 'alamat']
          }
      ]
    })

    const fotoUmkm = await FotoUmkm.findOne({
      where: {pengajuanId: pengajuanId},
      attributes: ['image1_url', 'image2_url', 'image3_url']
    })

    const laporan_keuangan = await LaporanKeuangan.findOne({
      where: {pengajuanId: pengajuanId},
      attributes: ['laporan_url']
    })

    if (!pengajuanDetails) {
      responseError.message = "Pengajuan Tidak ada!"
      return responseError
    }

    if (!fotoUmkm) {
      responseError.message = "Daftar Foto UMKM Tidak ada!"
      return responseError
    }

    if (!laporan_keuangan) {
      responseError.message = "Laporan Keuangan Tidak ada!"
      return responseError
    }

    responseSuccess.message = `Get Pengajuan UMKM ${pengajuanDetails.pemilikDetails.name} successfull!`
    responseSuccess.data = {
        ...pengajuanDetails['dataValues'],
        foto_umkm: fotoUmkm,
        laporan_keuangan: laporan_keuangan,
    }

    return responseSuccess;
  } catch (error) {
    console.log(error);
        responseError.message = "get Pengajuan details from database error";
        return responseError;
  }
}

async function terimaPengajuan(req){
  let responseError = new ResponseClass.ErrorResponse();
  let responseSuccess = new ResponseClass.SuccessWithNoDataResponse();

  const {pengajuanId} = req.params

  try {
      //get data pengajuan
      const existingPengajuanData = await Pengajuan.findOne({
        where: {
          id: pengajuanId
        },
        attributes: ['id', 'status'],
      })

      if (!existingPengajuanData) {
        responseError.message = "Pengajuan tidak ada!"
        return responseError;
      }

      existingPengajuanData.status = "In Progress";
      existingPengajuanData.save();

      responseSuccess.message = "Verifikasi pengajuan diterima!";
      return responseSuccess;
  } catch (error) {
    console.log(error);
    responseError.message = "verifikasi Pengajuan in database error";
    return responseError;
  }
} 

async function tolakPengajuan(req) {
  let responseError = new ResponseClass.ErrorResponse();
  let responseSuccess = new ResponseClass.SuccessWithNoDataResponse();

  const {pengajuanId} = req.params

  try {
      //get data pengajuan
      const existingPengajuanData = await Pengajuan.findOne({
        where: {
          id: pengajuanId
        },
        attributes: ['id','status'],
      })

      if (!existingPengajuanData) {
        responseError.message = "Pengajuan tidak ada!"
        return responseError;
      }

      existingPengajuanData.status = "Rejected";
      existingPengajuanData.save();

      responseSuccess.message = "Verifikasi pengajuan ditolak!";
      return responseSuccess;
  } catch (error) {
    console.log(error);
    responseError.message = "verifikasi Pengajuan in database error";
    return responseError;
  }
}


export default {
  terimaPengajuan,
  tolakPengajuan,
  getAllPengajuan,
  getDetailsPengajuanById,
}