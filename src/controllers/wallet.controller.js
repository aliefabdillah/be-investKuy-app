import walletService from "../services/wallet.service";

const getWallet = async (req, res) => {
  try {
    const response = await walletService.getWallet(req.params.username);
    return res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const getAllDebitTransactions = async (req, res) => {
  try {
    const response = await walletService.getAllDebitTransaction(req.params.walletId);
    return res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const getAllCreditTransactions = async (req, res) => {
  try {
    const response = await walletService.getAllCreditTransaction(req.params.walletId);
    return res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const createDebitTransaction = async (req, res) => {
  try {
    const response = await walletService.createDebitTransaction(req);
    return res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const createCreditTransaction = async (req, res) => {
  try {
    const response = await walletService.createCreditTransaction(req);
    return res.json(response);
  } catch (error) {
    console.log(error);
  }
};

export default {
  getWallet,
  getAllCreditTransactions,
  getAllDebitTransactions,
  createCreditTransaction,
  createDebitTransaction
};