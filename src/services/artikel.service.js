import ResponseClass from "../models/response.model.js";
import { Artikel } from "../models/artikel.model.js";
import { Admin } from "../models/admin.model.js";
import cloudinaryConfig from "../configs/cloudinary.config.js";

async function getAllArticle(req) {
    var responseError = new ResponseClass.ErrorResponse();
    var responseSuccess = new ResponseClass.SuccessResponse();

    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : null

        const articleResult = await Artikel.findAll({
            attributes: ['id', 'title', 'konten', 'tgl_terbit'],
            limit: limit
        });

        if (!articleResult) {
            responseError.message = "article not found!";
            return responseError;
        }

        responseSuccess.message = "get all article successful!";
        responseSuccess.data = articleResult;
        return responseSuccess;


    } catch (error) {
        console.log(error);
        responseError.message = error.message;
        return responseError;
    }
}

async function getDetailsArticle(request) {
    var responseError = new ResponseClass.ErrorResponse();
    var responseSuccess = new ResponseClass.SuccessResponse();

    const { articleId } = request.params;

    try {
        const articleDetailsResult = await Artikel.findOne({
            where: { id: articleId },
            attributes: ['id', 'title', 'tgl_terbit', 'konten', 'img_url', 'adminId']
        });

        if (!articleDetailsResult) {
            responseError.message = `Article details with id: ${articleId} not found!`;
            return responseError;
        }

        const adminData = await Admin.findOne({
            where: {id: articleDetailsResult.adminId},
            attributes: ['name']
        })

        delete articleDetailsResult.dataValues.adminId
        articleDetailsResult.dataValues.adminName = adminData.name

        responseSuccess.message = `get article ${articleDetailsResult.title} successful!`;
        responseSuccess.data = articleDetailsResult;
        return responseSuccess;

    } catch (error) {
        console.log(error);
        responseError.message = "Get from database error";
        return responseError;
    }
}

async function createArticle(request) {
    var responseError = new ResponseClass.ErrorResponse();
    var responseSuccess = new ResponseClass.SuccessResponse();

    const { title, tgl_terbit, konten } = request.body;
    const { adminId } = request.cookies

    //error handling
    if (!title || !tgl_terbit || !konten) {

        const missingFields = [];

        if (!title) {
            missingFields.push('title');
        }

        if (!tgl_terbit) {
            missingFields.push('tgl_terbit');
        }

        if (!konten) {
            missingFields.push('konten');
        }

        responseError.message = `Failed Creating FAQ, Missing Fields: ${missingFields.join(", ")}`;
        return responseError;
    }

    try {
        let imageUrl = null;
        let filename = null;

        if (request.file) {
            imageUrl = request.file.path;
            filename = request.file.filename;
        }

        const defaultImageUrl = 'https://www.jennybeaumont.com/wp-content/uploads/2015/03/placeholder-800x423.gif';
        const finalImageUrl = imageUrl || defaultImageUrl;

        const articleDetailsResult = await Artikel.create({
            title: title,
            tgl_terbit: tgl_terbit,
            konten: konten,
            filenam: filename,
            img_url: finalImageUrl,
            adminId: adminId
        });


        responseSuccess.message = `create article ${articleDetailsResult.title} successful!`;
        responseSuccess.data = articleDetailsResult;
        return responseSuccess;


    } catch (error) {
        console.log(error);
        responseError.message = "create from database error";
        return responseError;
    }
}

async function updateArticle(request) {
    var responseError = new ResponseClass.ErrorResponse();
    var responseSuccess = new ResponseClass.SuccessResponse();

    const { title, tgl_terbit, konten } = request.body;
    const { articleId } = request.params;

    //error handling
    if (!title || !tgl_terbit || !konten) {

        const missingFields = [];

        if (!title) {
            missingFields.push('title');
        }

        if (!tgl_terbit) {
            missingFields.push('tgl_terbit');
        }

        if (!konten) {
            missingFields.push('konten');
        }

        responseError.message = `Failed Creating FAQ, Missing Fields: ${missingFields.join(", ")}`;
        return responseError;
    }

    try {

        const existingArticle = await Artikel.findByPk(articleId);

        const updatedArticle = await existingArticle.update({
            title: title,
            tgl_terbit: tgl_terbit,
            konten: konten,
            updatedAt: new Date()
        });

        if (request.file) {
            console.log(request.file);
            if (updatedArticle.filename !== request.file.filename) {
                await cloudinaryConfig.deleteFile(updatedArticle.filename);
                updatedArticle.filename = request.file.filename;
                updatedArticle.img_url = request.file.path;
                updatedArticle.save();
            }
        }

        responseSuccess.message = `update article ${updatedArticle.title} successful!`;
        responseSuccess.data = updatedArticle;
        return responseSuccess;


    } catch (error) {
        console.log(error);
        responseError.message = "update to database error";
        return responseError;
    }
}

async function deleteArticle(request) {
    var responseError = new ResponseClass.ErrorResponse();
    var responseSuccess = new ResponseClass.SuccessWithNoDataResponse();

    const { articleId } = request.params;

    try {

        const articleResult = await Artikel.findOne({ where: { id: articleId } });

        if (!articleResult) {
            responseError.message = "Article details empty!";
            return responseError;
        }

        if (articleResult.img_url) {
            // Delete the file using the public_id
            const cloudinaryResult = await cloudinaryConfig.deleteFile(articleResult.filename);

            if (cloudinaryResult == true) {

                await articleResult.destroy();

                responseSuccess.message = "Article Deleted Successfull!";
                return responseSuccess;
            } else {
                responseError.message = "Article Deleted Failed!";
                return responseError;
            }
        } else {
            responseError.message = "Error deleting article or file not found in Cloudinary!";
            return responseError;
        }

    } catch (error) {
        console.log(error);
        responseError.message = "Delete from database / clodinary error";
        return responseError;
    }
}

export default {
    getAllArticle,
    getDetailsArticle,
    createArticle,
    updateArticle,
    deleteArticle,
};