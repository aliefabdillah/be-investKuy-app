import walletService from "../services/wallet.service.js";

const getWallet = async (req, res) => {
  try {
    const response = await walletService.getWallet(req.params.username);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const getAllDebitTransactions = async (req, res) => {
  try {
    const response = await walletService.getAllDebitTransaction(req.params.walletId);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const getAllCreditTransactions = async (req, res) => {
  try {
    const response = await walletService.getAllCreditTransaction(req.params.walletId);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const createDebitTransaction = async (req, res) => {
  try {
    const response = await walletService.createDebitTransaction(req.body);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const createCreditTransaction = async (req, res) => {
  try {
    const response = await walletService.createCreditTransaction(req.body);
    res.json(response);
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