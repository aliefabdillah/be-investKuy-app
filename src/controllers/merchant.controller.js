import MerchantService from "../services/merchant.service.js";

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const get = async (req, res) => {
  try {
    const data = await MerchantService.getAllMerchants();
    res.status(data.code).send(data);
  } catch (error) {
    console.log(error);
  }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getById = async (req, res) => {
  try {
    const data = await MerchantService.getMerchantById(req.params.id);
    res.status(data.code).send(data);
  } catch (error) {
    console.log(error);
  }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const create = async (req, res) => {
  try {
    const data = await MerchantService.createMerchant(req.body);
    res.status(data.code).send(data);
  } catch (error) {
    console.log(error);
  }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const update = async (req, res) => {
  try {
    const data = await MerchantService.updateMerchant(req);
    res.status(data.code).send(data);
  } catch (error) {
    console.log(error);
  }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const deleteById = async (req, res) => {
  try {
    const data = await MerchantService.deleteMerchant(req.params.id);
    res.status(data.code).send(data);
  } catch (error) {
    console.log(error);
  }
};

export default {
  get,
  getById,
  create,
  update,
  deleteById
};