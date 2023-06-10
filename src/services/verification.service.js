import { Verification } from "../models/verification.model.js";
import Users from "../models/users.model.js";
import ResponseClass from "../models/response.model.js"

async function createVerification(request) {

    var responseError = new ResponseClass.ErrorResponse()
    var responseSuccess = new ResponseClass.SuccessResponse()

    const {username} = request.params

    const {
        nik,
        nama,
        tgl_lahir,
        gender,
        alamat,
    } = request.body

    try {

        if (!nik || !nama || !tgl_lahir || !gender || !alamat) {

            const missingFields = [];

            if (!nik) {
                missingFields.push('nik');
            }

            if (!nama) {
                missingFields.push('nama');
            }

            if (!tgl_lahir) {
                missingFields.push('tgl_lahir');
            }

            if (!gender) {
                missingFields.push('jenis kelamin');
            }

            if (!alamat) {
                missingFields.push('alamat');
            }

            responseError.message = `Failed Creating FAQ, Missing Fields: ${missingFields.join(", ")}`;
            return responseError;
        }

        if (!request.files) {
            responseError.message = "Mohon cantumkan Foto KTP dan Pas Foto anda!"
            return responseError
        }

        const user = await Users.findOne({where: {username: username}})

        //get ktp foto url and filename
        const ktpImg_url = request.files[0].path
        const ktpImg_filename = request.files[0].filename

        //get pas foto url and filename
        const pasFoto_url = request.files[1].path
        const pasFoto_filename = request.files[1].filename

        const newVerification = await Verification.create({
            ktpImg_url: ktpImg_url,
            ktpImg_filename: ktpImg_filename,
            pasFoto_url: pasFoto_url,
            pasFoto_filename: pasFoto_filename,
            nik: nik,
            nama: nama,
            tgl_lahir: tgl_lahir,
            gender: gender,
            alamat: alamat,
            userId: user.id
        })

        responseSuccess.message = "Upload data verification account successfull!"
        responseSuccess.data = newVerification
        return responseSuccess

    } catch (error) {
        console.log(error);
        responseError.message = "upload verification to database error";
        return responseError;
    }
}

async function getAllVerification(){

    var responseError = new ResponseClass.ErrorResponse()
    var responseSuccess = new ResponseClass.SuccessResponse()

    try {
        const verificationData = await Verification.findAll({
            include: [
                {
                    model: Users,
                    as: "userDetails",
                    attributes: ['role', 'is_verified']
                }
            ],
            attributes: ['id','nama','nik']
        })

        if (verificationData.length == 0) {
            responseSuccess.message = "Data Verifikasi tidak ada!"
            return responseSuccess
        }

        responseSuccess.message = "Get All verification successfull!"
        responseSuccess.data = verificationData
        return responseSuccess
    } catch (error) {
        console.log(error);
        responseError.message = "get verification from database error";
        return responseError;
    }
}

async function getDetailsVerificationById(request){

    var responseError = new ResponseClass.ErrorResponse()
    var responseSuccess = new ResponseClass.SuccessResponse()

    const { verificationId } = request.params

    try {
        const verificationDetailsData = await Verification.findOne({
            where: {id: verificationId},
            include: [
                {
                    model: Users,
                    as: "userDetails",
                    attributes: ['role', 'is_verified']
                }
            ],
            attributes: ['id','nama','nik','tgl_lahir','gender','alamat','ktpImg_url','pasFoto_url']
        })

        if(!verificationDetailsData){
            responseError.message = `Data dengan id: ${verificationId} tidak ditemukan!`
            return responseError
        }

        responseSuccess.message = "Get details verifification successfull!"
        responseSuccess.data = verificationDetailsData
        return responseSuccess
    } catch (error) {
        console.log(error);
        responseError.message = "get verification from database error";
        return responseError;
    }
}

async function updateUserVerified(request){
    var responseError = new ResponseClass.ErrorResponse()
    var responseSuccess = new ResponseClass.SuccessWithNoDataResponse()

    const { verificationId, verifiedStatus } = request.params

    let is_verified = null

    try {

        if (verifiedStatus == "accepted") {
            is_verified = true
        }else if(verifiedStatus == "rejected"){
            is_verified = false
        }else{
            responseError.message = "Parameter Status not valid"
            return responseError
        }

        const verificationData = await Verification.findOne({ where: {id: verificationId}})

        const updatedUser = await Users.findOne({
            where: {id: verificationData.userId},
        })

        updatedUser.is_verified = is_verified
        updatedUser.save()

        responseSuccess.message = `Verification Status ${updatedUser.username} has been updated`
        return responseSuccess
    } catch (error) {
        console.log(error);
        responseError.message = "update status verification to database error";
        return responseError;
    }
}

export default {
    createVerification,
    getAllVerification,
    getDetailsVerificationById,
    updateUserVerified,
}
