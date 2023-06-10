import AuthService from '../services/auth.service.js';
import ResponseClass from '../models/response.model.js';

const register = async (req, res) => {
  try {
    const response = await AuthService.registerAdmin(req.body);
    res.status(response.code).send(response);
  } catch (error) {
    let responseError = new ResponseClass.ErrorResponse();
    responseError.code = 500;
    responseError.message = error;
    res.json(responseError);
  }
};

const login = async (req, res) => {
  try {
    const response = await AuthService.loginAdmin(req.body);
    res.status(response.code).send(response);
  } catch (error) {
    let responseError = new ResponseClass.ErrorResponse();
    responseError.code = 500;
    responseError.message = error;
    res.json(responseError);
  }
};

export default {
  register,
  login
};