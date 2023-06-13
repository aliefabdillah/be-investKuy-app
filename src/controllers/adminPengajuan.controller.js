import adminPengajuanService from "../services/adminPengajuan.service.js"

const getAll = async (req,res, next) => {
  try {
      const response = await adminPengajuanService.getAllPengajuan(req)
      res.status(response.code).send(response)
  } catch (error) {
      console.log(error)
      next(error)
  }
}

const getDetails = async (req,res, next) => {
  try {
      const response = await adminPengajuanService.getDetailsPengajuanById(req)
      res.status(response.code).send(response)
  } catch (error) {
      console.log(error)
      next(error)
  }
}

const acceptPengajuan = async (req,res, next) => {
  try {
      const response = await adminPengajuanService.terimaPengajuan(req)
      res.status(response.code).send(response)
  } catch (error) {
      console.log(error)
      next(error)
  }
}

const rejectPengajuan = async (req,res, next) => {
  try {
      const response = await adminPengajuanService.tolakPengajuan(req)
      res.status(response.code).send(response)
  } catch (error) {
      console.log(error)
      next(error)
  }
}

export default {
  getAll,
  acceptPengajuan,
  rejectPengajuan,
  getDetails,
}