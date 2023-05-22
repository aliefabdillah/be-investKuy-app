import Users from "../models/users.model.js";
import ResponseClass from "../models/response.model.js";
import bcrypt from 'bcrypt';

async function getProfile(request) {
    let responseSuccess = new ResponseClass.SuccessResponse()
    let responseError = new ResponseClass.ErrorResponse()
    const { userId } = request.params

    try {
        const userData = await Users.findOne({
            where: {id: userId},
            attributes: ['img_url', 'name', 'role', 'email', 'no_telepon', 'alamat', 'is_verified']
        })

        responseSuccess.message = `Get profile successfull!`
        responseSuccess.data = userData
        return responseSuccess
    } catch (error) {
        console.log(error.message)
        responseError.message = "Get users profile from database error"
        return responseError
    }
}

async function updateInfoAkun(request){
    let responseSuccess = new ResponseClass.SuccessResponse()
    let responseError = new ResponseClass.ErrorResponse()

    const { name, email, no_telepon, alamat} = request.body
    const { userId } = request.params

    try {
        const existingInfoAkun = await Users.findOne({
            where: {id: userId},
            attributes: ['id', 'img_url', 'name', 'email', 'no_telepon', 'alamat']
        })

        
        if (!existingInfoAkun) {
            responseError.message = "Informasi Akun tidak ditemukan"
            return responseError
        }
        
        // regex for email format
        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegexp.test(email)) {
            responseError.message = "Email is invalid.";
            return responseError;
        }
        existingInfoAkun.name = name
        existingInfoAkun.email = email
        existingInfoAkun.no_telepon = no_telepon
        existingInfoAkun.alamat = alamat

        if (request.file) {
            if (existingInfoAkun.img_filename !== request.file.filename) {
                existingInfoAkun.img_filename = request.file.filename
                existingInfoAkun.img_url = request.file.path
            }
        }

        existingInfoAkun.save()

        responseSuccess.message = "Informasi Akun berhasil di update!"
        responseSuccess.data = existingInfoAkun
        return responseSuccess
        
    } catch (error) {
        console.log(error.message)
        responseError.message = "Gagal mengupdate informasi akun!"
        return responseError
    }
}

async function updatePassword(request) {
    let responseSuccess = new ResponseClass.SuccessWithNoDataResponse()
    let responseError = new ResponseClass.ErrorResponse()

    const { oldPass, newPass, confirmNewPass, pin } = request.body
    const { userId } = request.params

    try {

        const userData = await Users.findOne({ 
            where: {id: userId },
            attributes: ['id', 'password', 'pin']
        })

        /* cek password lama */
        const match = await bcrypt.compare(oldPass, userData.password);

        if (!match) {
            responseError.message = "Password lama tidak sesuai dengan password yang terdaftar pada akun!"
            return responseError
        }

        //cek password konfirmasi
        if (newPass !== confirmNewPass) {
            responseError.message = "Password dan Password konfirmasi tidak sesuai!"
            return responseError
        }

        //cek pin pada akun
        if (pin !== userData.pin) {
            responseError.message = "Pin Tidak Sesuai!"
            return responseError
        }

        //enkripsi password
        const salt = await bcrypt.genSalt();
        const hashedNewPassword = await bcrypt.hash(newPass, salt);

        userData.password = hashedNewPassword
        userData.save()

        responseSuccess.message = "Update password sucessfully"
        return responseSuccess

    } catch (error) {
        console.log(error.message)
        responseError.message = "Gagal mengupdate password akun!"
        return responseError
    }
}

async function updatePin(request) {
    let responseSuccess = new ResponseClass.SuccessWithNoDataResponse()
    let responseError = new ResponseClass.ErrorResponse()

    const { oldPin, newPin, confirmNewPin, password } = request.body
    const { userId } = request.params

    try {

        const userData = await Users.findOne({ 
            where: {id: userId },
            attributes: ['id', 'password', 'pin']
        })

        //cek kesesuaian pin yang terdaftar
        if (oldPin !== userData.pin) {
            responseError.message = "Pin Lama Tidak Sesuai dengan yang terdaftar pada akun!"
            return responseError
        }

        //cek konfirmasi pin
        if (newPin !== confirmNewPin) {
            responseError.message = "Pin dan Pin konfirmasi tidak sesuai!"
            return responseError
        }
        
        /* cek password lama */
        const match = await bcrypt.compare(password, userData.password);

        if (!match) {
            responseError.message = "Pin tidak sesuai!"
            return responseError
        }

        //update pin
        userData.pin = newPin
        userData.save()

        responseSuccess.message = "Update nomor pin sucessfully"
        return responseSuccess

    } catch (error) {
        console.log(error.message)
        responseError.message = "Gagal mengupdate nomor pin akun!"
        return responseError
    }
}

export default {
    getProfile,
    updateInfoAkun,
    updatePassword,
    updatePin,
}