import RekeningService from '../services/rekening.service.js';

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const get = async (req, res) => {
  try {
    const data = await RekeningService.getAllRekenings(req.params.userId);
    res.json(data);
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
    const data = await RekeningService.getRekeningById(req.params.id);
    res.json(data);
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
    const data = await RekeningService.createRekening(req.body);
    res.json(data);
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
    const data = await RekeningService.updateRekening(req);
    res.json(data);
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
    const data = await RekeningService.deleteRekening(req.params.id);
    res.json(data);
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