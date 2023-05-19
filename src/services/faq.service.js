import ResponseClass from "../models/respones.model.js";
import { Faq } from "../models/faq.model.js";

async function getFaq(){
    var responseError = new ResponseClass.ErrorResponse()
    var responseSuccess = new ResponseClass.SuccessResponse()

    try {
        const faqResult = await Faq.findAll({
            attributes: ['id', 'question', 'answer', 'category', 'adminId']
        })
    
        if (!faqResult) {
            responseError.message = "FAQ not found!"
            return responseError
        }

        responseSuccess.message = "get all faq successful!"
        responseSuccess.data = faqResult
        return responseSuccess

    
    } catch (error) {
        console.log(error)
        responseError.message = "Get from database error"
        return responseError
    }
    
    
}

async function createFaq(request){
    var responseError = new ResponseClass.ErrorResponse()
    var responseSuccess = new ResponseClass.SuccessResponse()

    const { question, answer, category, adminId } = request.body
    // const adminId = request.cookies['adminId']

    //error handling
    if (!question || !answer || !category) {
        
        const missingFields = [];

        if (!question) {
            missingFields.push('question')
        }

        if (!answer) {
            missingFields.push('answer')
        }

        if (!categories) {
            missingFields.push('categories')
        }

        responseError.message = `Failed Creating FAQ, Missing Fields: ${missingFields.join(", ")}`
        return responseError
    }

    try {

        const newFaq = await Faq.create({
            question: question,
            answer: answer,
            category: category,
            adminId: adminId,
        })

        responseSuccess.message = "Create Faq successfully!"
        responseSuccess.data = newFaq
        return responseSuccess

    } catch (error) {
        console.log(error)
        responseError.code = 501
        responseError.message = "Creat to Database Error"
        return responseError
    }
}

async function updateFaqById(request) {
    var responseError = new ResponseClass.ErrorResponse()
    var responseSuccess = new ResponseClass.SuccessWithNoDataResponse()

    const { question, answer, category } = request.body
    const faqId = request.params.faqId

    //error handling
    if (!question || !answer || !category) {
        
        const missingFields = [];

        if (!question) {
            missingFields.push('question')
        }

        if (!answer) {
            missingFields.push('answer')
        }

        if (!categories) {
            missingFields.push('categories')
        }

        responseError.message = `Failed Creating FAQ, Missing Fields: ${missingFields.join(", ")}`
        return responseError
    }

    try {
        const existingFaq = await Faq.findOne({ where: {id: faqId}})

        if (!existingFaq) {
            responseError.message = "FAQ not Found!"
            responseError.code = 401
        }

        existingFaq.question = question
        existingFaq.answer = answer
        existingFaq.category = category
        existingFaq.save()

        responseSuccess.message = `update FAQ successfully`;
        return responseSuccess
    } catch (error) {
        responseError.code = 500
        responseError.message = "Input to database error"
        return responseError;
    }
}

async function deleteFaqById(request){
    var responseError = new ResponseClass.ErrorResponse()
    var responseSuccess = new ResponseClass.SuccessWithNoDataResponse()

    const faqId  = request.params.faqId
    console.log(request.params)
    
    try {
        //find by id in DB
        const faqResult = await Faq.findOne({ where: {id: faqId} })

        if (!faqResult) {
            responseError.message = "Faq Not Found!"
            return responseError
        }
        
        //delete row
        await faqResult.destroy();

        responseSuccess.message = "Delete programs successfully!"
        return responseSuccess

    } catch (error) {
        console.error(error)
        responseError.code = 500
        responseError.message = error
        return responseError
    }
}

export default {
    createFaq,
    updateFaqById,
    getFaq,
    deleteFaqById,
}