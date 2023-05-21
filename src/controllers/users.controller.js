import AuthService from '../services/auth.service.js';
import ResponseClass from '../models/response.model.js';
import { Op } from 'sequelize';
import Users from '../models/users.model.js';

const register = async (req, res) => {
  try {
    const response = await AuthService.registerUser(req.body);
    res.json(response);
  } catch (error) {
    let responseError = new ResponseClass.ErrorResponse();
    responseError.code = 500;
    responseError.message = error;
    res.json(responseError);
  }
};

const login = async (req, res) => {
  try {
    const response = await AuthService.loginUser(req.body);
    res.json(response);
  } catch (error) {
    let responseError = new ResponseClass.ErrorResponse();
    responseError.code = 500;
    responseError.message = error;
    res.json(responseError);
  }
};

const getAllUsers = async (req, res) => {
  let responseError = new ResponseClass.ErrorResponse();
  let responseSuccess = new ResponseClass.SuccessResponse();

  try {
    const whereUsers = {};
    const sortColumn = req.query.sort ? req.query.sort : 'createdAt';
    const sortOrder = req.query.order ? req.query.order : 'DESC';
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    if (req.query.name) {
      whereUsers.name = {
        [Op.like]: `%${req.query.name}%`
      };
    }

    if (req.query.role) {
      whereUsers.role = {
        [Op.like]: `%${req.query.role}%`
      };
    }

    const users = await Users.findAll({
      where: whereUsers,
      limit: limit,
      order: [
        [sortColumn, sortOrder]
      ],
      attributes: [
        'id', 'name', 'username', 'email', 'no_telepon', 'alamat', 'role', 'isVerified',
      ]
    });

    responseSuccess.message = "Successfully getting all users data.";
    responseSuccess.data = users;
    res.json(responseSuccess);
  } catch (error) {
    responseError.code = 500;
    responseError.message = error;
    res.json(responseError);
  }
};

export default {
  register,
  login,
  getAllUsers
};