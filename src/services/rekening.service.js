import ResponseClass from '../models/response.model.js';
import Rekening from '../models/rekening.model.js';
import Merchants from '../models/merchant.model.js';
import Users from '../models/users.model.js';

/**
 * 
 * @param {*} userId 
 * @returns 
 */
const getAllRekenings = async (userId) => {
  const responseSuccess = new ResponseClass.SuccessResponse();
  const responseError = new ResponseClass.ErrorResponse();

  try {
    const data = await Rekening.findAll({
      where: {
        userId: userId
      },
      include: [
        {
          model: Merchants,
          as: 'merchantsDetails'
        },
        {
          model: Users,
          as: 'userDetails'
        }
      ]
    });

    if (!data) {
      responseError = `Couldn't find rekening data for user with userId ${userId}`;
      return responseError;
    }

    responseSuccess.message = `Successfully retrieving rekening data for user with userId ${userId}`;
    responseSuccess.data = data;
    return responseSuccess;
  } catch (error) {
    responseError.code = 500;
    responseError.message = error.message;
    return responseError;
  }
};

/**
 * 
 * @param {*} id 
 * @returns 
 */
const getRekeningById = async (id) => {
  const responseSuccess = new ResponseClass.SuccessResponse();
  const responseError = new ResponseClass.ErrorResponse();

  try {
    const data = await Rekening.findOne({
      where: {
        id: id
      },
      include: [
        {
          model: Merchants,
          as: 'merchantsDetails'
        },
        {
          model: Users,
          as: 'userDetails'
        }
      ]
    });

    if (!data) {
      responseError.message = `Couldn't find rekening data with id ${id}`;
      return responseError;
    }

    responseSuccess.message = `Successfully retrieving rekening data with id ${id}`;
    responseSuccess.data = data;
    return responseSuccess;
  } catch (error) {
    responseError.code = 500;
    responseError.message = error.message;
    return responseError;
  }
};

/**
 * 
 * @param {*} requestBody 
 * @returns 
 */
const createRekening = async (requestBody) => {
  const responseSuccess = new ResponseClass.SuccessResponse();
  const responseError = new ResponseClass.ErrorResponse();
  const { userId, merchantId, no_rekening } = requestBody;

  if (!userId || !merchantId || !no_rekening) {
    responseError.message = "userId, merchantId, or no_rekening is missing!";
    return responseError;
  }

  try {
    const data = await Rekening.create({
      userId: userId,
      merchantId: merchantId,
      no_rekening: no_rekening
    });

    responseSuccess.message = "Successfully creating new rekening data.";
    responseSuccess.data = data;
    return responseSuccess;
  } catch (error) {
    responseError.code = 500;
    responseError.message = error.message;
    return responseError;
  }

};

/**
 * 
 * @param {*} request 
 * @returns 
 */
const updateRekening = async (request) => {
  const responseSuccess = new ResponseClass.SuccessResponse();
  const responseError = new ResponseClass.ErrorResponse();
  const { userId, merchantId, no_rekening } = request.body;
  const id = request.params.id;

  try {
    const rekening = await Rekening.findOne({
      where: {
        id: id
      }
    });

    if (!rekening) {
      responseError.message = `Couldn't find rekening data with id ${id}`;
      return responseError;
    }

    const data = await rekening.update({
      userId: userId,
      merchantId: merchantId,
      no_rekening: no_rekening
    });

    responseSuccess.message = `Successfully updating rekening data with id ${id}`;
    responseSuccess.data = data;
    return responseSuccess;
  } catch (error) {
    responseError.code = 500;
    responseError.message = error.message;
    return responseError;
  }
};

/**
 * 
 * @param {*} id 
 * @returns 
 */
const deleteRekening = async (id) => {
  const responseSuccess = new ResponseClass.SuccessWithNoDataResponse();
  const responseError = new ResponseClass.ErrorResponse();

  try {
    const rekening = await Rekening.findOne({
      where: {
        id: id
      }
    });

    if (!rekening) {
      responseError.message = `Couldn't find rekening data with id ${id}`;
      return responseError;
    }

    await rekening.destroy();

    responseSuccess.message = `Successfully deleting rekening data with id ${id}`;
    return responseSuccess;
  } catch (error) {
    responseError.code = 500;
    responseError.message = error.message;
    return responseError;
  }
};

export default {
  getAllRekenings,
  getRekeningById,
  createRekening,
  updateRekening,
  deleteRekening
};