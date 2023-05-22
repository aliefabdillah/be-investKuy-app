import ResponseClass from '../models/response.model.js';
import Merchants from '../models/merchant.model.js';

/**
 * 
 * @returns 
 */
const getAllMerchants = async () => {
  const responseSuccess = new ResponseClass.SuccessResponse();
  const responseError = new ResponseClass.ErrorResponse();

  try {
    const data = await Merchants.findAll();

    if (!data) {
      responseError.message = "No merchant data was found.";
      return responseError;
    }

    responseSuccess.message = "Successfully retrieving merchants data.";
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
const getMerchantById = async (id) => {
  const responseSuccess = new ResponseClass.SuccessResponse();
  const responseError = new ResponseClass.ErrorResponse();

  try {
    const data = await Merchants.findOne({
      where: {
        id: id
      }
    });

    if (!data) {
      responseError.message = `Couldn't find merchant with id ${id}`;
      return responseError;
    }

    responseSuccess.message = `Successfully retrieving merchant data with id ${id}`;
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
const createMerchant = async (requestBody) => {
  const responseSuccess = new ResponseClass.SuccessResponse();
  const responseError = new ResponseClass.ErrorResponse();
  const { name, type } = requestBody;

  if (!name || !type) {
    responseError.message = "Name or type property is missing!";
    return responseError;
  }

  try {
    const data = await Merchants.create({
      name: name,
      type: type
    });

    responseSuccess.message = "Successfully creating new merchant data.";
    responseSuccess.data = data;
    return responseSuccess;
  } catch (error) {
    responseError.code = 500;
    responseError.message = error.messager;
    return responseError;
  }
};

/**
 * 
 * @param {*} request 
 * @returns 
 */
const updateMerchant = async (request) => {
  const responseSuccess = new ResponseClass.SuccessResponse();
  const responseError = new ResponseClass.ErrorResponse();

  const { name, type } = request.body;
  const id = request.params.id;
  if (!id || !name || !type) {
    responseError.message = "Id, name, or type property is missing!";
    return responseError;
  }

  try {
    const merchant = await Merchants.findOne({
      where: {
        id: id
      }
    });

    if (!merchant) {
      responseError.message = `Couldn't find merchant with id ${id}`;
      return responseError;
    }

    const data = await merchant.update({
      name: name,
      type: type
    });

    responseSuccess.message = `Successfully updating merchant data with id ${id}`;
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
const deleteMerchant = async (id) => {
  const responseSuccess = new ResponseClass.SuccessWithNoDataResponse();
  const responseError = new ResponseClass.ErrorResponse();

  try {
    const merchant = await Merchants.findOne({
      where: {
        id: id
      }
    });

    if (!merchant) {
      responseError.message = `Couldn't find merchant with id ${id}`;
      return responseError;
    }

    await merchant.destroy();

    responseSuccess.message = `Successfully deleting merchant data with id ${id}`;
    return responseSuccess;
  } catch (error) {
    responseError.code = 500;
    responseError.message = error.message;
    return responseError;
  }
};

export default {
  getAllMerchants,
  getMerchantById,
  createMerchant,
  updateMerchant,
  deleteMerchant
};