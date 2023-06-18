import Wallets from "../models/wallet.model.js";
import WalletCredits from "../models/walletCredit.model.js";
import WalletDebits from "../models/walletDebit.model.js";
import ResponseClass from '../models/response.model.js';
import Users from "../models/users.model.js";
import utilsService from "./utils.service.js";
import Merchants from "../models/merchant.model.js";

/**
 * 
 * @param {String} username 
 * @returns
 */
const getWallet = async (username) => {
  const responseSuccess = new ResponseClass.SuccessResponse();
  const responseError = new ResponseClass.ErrorResponse();

  try {
    const user = await Users.findOne({
      where: {
        username: username
      }
    });

    if (!user) {
      responseError.message = `Couldn't wallet for user with username ${username}`;
      return responseError;
    }

    const data = await Wallets.findOne({
      where: {
        userId: user.id
      },
      attributes: [
        'id', 'balance'
      ]
    });

    const credits = await WalletCredits.findAll({
      where: {
        walletId: data.id
      },
      include: [
        {
          model: Merchants,
          as: 'merchantsDetails'
        }
      ]
    });

    const debits = await WalletDebits.findAll({
      where: {
        walletId: data.id
      },
      include: [
        {
          model: Merchants,
          as: 'merchantsDetails'
        }
      ]
    });

    if (!data) {
      responseError.message = `Couldn't find wallet for user with username ${username}`;
      return responseError;
    }

    responseSuccess.message = `Successfully retrieving wallet data for user with username ${username}`;
    responseSuccess.data = {
      ...data['dataValues'],
      credits: credits,
      debits: debits
    };
    return responseSuccess;
  } catch (error) {
    responseError.code = 500;
    responseError.message = error.message;
    return responseError;
  }
};

/**
 * 
 * @param {Number} userId 
 * @returns
 */
const createWallet = async (userId) => {
  const responseSuccess = new ResponseClass.SuccessWithNoDataResponse();
  const responseError = new ResponseClass.ErrorResponse();

  try {
    await Wallets.create({
      userId: userId,
      balance: 0
    });

    responseSuccess.message = `Successfully creating wallet for user with userId ${userId}`;
    return responseSuccess;
  } catch (error) {
    responseError.code = 500;
    responseError.message = error;
    return responseError;
  }
};

/**
 * 
 * @param {Object} requestBody 
 * @returns
 */
const createCreditTransaction = async (requestBody) => {
  const { walletId, merchantId, amount, type } = requestBody;
  const responseSuccess = new ResponseClass.SuccessResponse();
  const responseError = new ResponseClass.ErrorResponse();

  if (!walletId || !merchantId) {
    responseError.message = "walletId or merchantId is missing!";
    return responseError;
  }

  try {
    const wallet = await Wallets.findOne({
      where: {
        id: walletId
      }
    });

    if (!wallet) {
      responseError.message = `Couldn't find wallet for walletId ${walletId}`;
      return responseError;
    }

    const data = await WalletCredits.create({
      walletId: Number(walletId),
      merchantId: Number(merchantId),
      amount: Number(amount),
      type: type
    });

    const transactionCode = "CC" + merchantId + utilsService.generateId() + walletId + data.id;

    await data.update({
      transactionCode: transactionCode
    });

    const newBalance = Number(wallet.balance) - Number(amount);

    await wallet.update({
      balance: newBalance
    });

    responseSuccess.message = "Successfully creating credit transaction.";
    responseSuccess.data = data;
    return responseSuccess;
  } catch (error) {
    responseError.code = 500;
    responseError.message = error;
    return responseError;
  }
};

/**
 * 
 * @param {Object} requestBody 
 * @returns
 */
const createDebitTransaction = async (requestBody) => {
  const { walletId, merchantId, amount, type } = requestBody;
  const responseSuccess = new ResponseClass.SuccessResponse();
  const responseError = new ResponseClass.ErrorResponse();

  if (!walletId || !merchantId) {
    responseError.message = "walletId or merchantId is missing!";
    return responseError;
  }

  try {
    const wallet = await Wallets.findOne({
      where: {
        id: walletId
      }
    });

    if (!wallet) {
      responseError.message = `Couldn't find wallet for walletId ${walletId}`;
      return responseError;
    }

    const data = await WalletDebits.create({
      walletId: Number(walletId),
      merchantId: Number(merchantId),
      amount: Number(amount),
      type: type,
    });

    const transactionCode = "CC" + merchantId + utilsService.generateId() + walletId + data.id;
    const paymentCode = merchantId + utilsService.generateCode() + walletId + data.id;

    await data.update({
      transactionCode: transactionCode,
      paymentCode: paymentCode
    });

    const newBalance = Number(wallet.balance) + Number(amount);

    await wallet.update({
      balance: newBalance
    });

    responseSuccess.message = "Successfully creating debit transaction.";
    responseSuccess.data = data;
    return responseSuccess;
  } catch (error) {
    responseError.code = 500;
    responseError.message = error;
    return responseError;
  }
};

/**
 * 
 * @param {String} walletId 
 * @returns 
 */
const getAllCreditTransaction = async (walletId) => {
  const responseSuccess = new ResponseClass.SuccessResponse();
  const responseError = new ResponseClass.ErrorResponse();

  if (!walletId) {
    responseError.message = "walletId is missing!";
    return responseError;
  }

  try {
    const data = await WalletCredits.findAll({
      where: {
        walletId: walletId
      },
      attributes: [
        'amount', 'transactionCode', 'type', 'createdAt'
      ],
      include: [{ model: Merchants, as: 'merchantsDetails' }]
    });

    responseSuccess.message = `Successfully retrieving credit transactions for walletId ${walletId}`;
    responseSuccess.data = data;
    return responseSuccess;
  } catch (error) {
    responseError.code = 500;
    responseError.message = error;
    return responseError;
  }
};

/**
 * 
 * @param {String} walletId 
 * @returns 
 */
const getAllDebitTransaction = async (walletId) => {
  const responseSuccess = new ResponseClass.SuccessResponse();
  const responseError = new ResponseClass.ErrorResponse();

  if (!walletId) {
    responseError.message = "walletId is missing!";
    return responseError;
  }

  try {
    const data = await WalletDebits.findAll({
      where: {
        walletId: walletId
      },
      attributes: [
        'amount', 'transactionCode', 'paymentCode', 'type', 'createdAt'
      ],
      include: [{ model: Merchants, as: 'merchantsDetails' }]
    });

    responseSuccess.message = `Successfully retrieving debit transactions for walletId ${walletId}`;
    responseSuccess.data = data;
    return responseSuccess;
  } catch (error) {
    responseError.code = 500;
    responseError.message = error.message;
    return responseError;
  }
};

export default {
  getWallet,
  createWallet,
  createCreditTransaction,
  createDebitTransaction,
  getAllCreditTransaction,
  getAllDebitTransaction
};