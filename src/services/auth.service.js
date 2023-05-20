import bcrypt from 'bcrypt';
import ResponseClass from '../models/response.model.js';
import validatePassword from '../models/password.model.js';
import Users from '../models/users.model.js';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/admin.model.js';

const registerUser = async (requestBody) => {
  const { username, email, password, confirmPassword, pin, name, role } = requestBody;

  let responseError = new ResponseClass.ErrorResponse();
  let responseSuccess = new ResponseClass.SuccessResponse();

  // checking if email, username, password, or pin is empty
  if (
    !email ||
    !username ||
    !password ||
    !pin
  ) {
    responseError.message = "Email, username, password, or pin is missing!";
    return responseError;
  }

  // regex for email format
  const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegexp.test(email)) {
    responseError.message = "Email is invalid.";
    return responseError;
  }

  const emailRegistered = await Users.findOne({
    where: {
      email: email
    }
  });
  if (emailRegistered) {
    responseError.message = "This email has been registered.";
    return responseError;
  }

  const usernameRegistered = await Users.findOne({
    where: {
      username: username
    }
  });
  if (usernameRegistered) {
    responseError.message = "This username has been registered.";
    return responseError;
  }

  // @params: email and isShowDetail
  const isPasswordPassed = validatePassword(password, false);
  if (!isPasswordPassed) {
    responseError.message = validatePassword(password, true);
    return responseError;
  }

  if (password !== confirmPassword) {
    responseError.message = "Password and confirm password do not match.";
    return responseError;
  }

  const salt = bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const token = jwt.sign({
      name,
      email,
      username,
      role
    }, process.env.USER_TOKEN_SECRET, {
      expiresIn: 0
    });

    const data = await Users.create({
      name: name,
      email: email,
      username: username,
      password: hashedPassword,
      pin: pin,
      role: role,
      token: token
    });


    responseSuccess.message = "Successfully registered.";
    responseSuccess.data = {
      name: name,
      username: username,
      email: email,
      role: role,
      token: token
    };
    return responseSuccess;
  } catch (error) {
    responseError.code = 500;
    responseError.message = error;
    return responseError;
  }
};

const loginUser = async (requestBody) => {
  const { username, password } = requestBody;
  let responseError = new ResponseClass.ErrorResponse();
  let responseSuccess = new ResponseClass.SuccessResponse();

  if (!username || !password) {
    responseError.message = "Email or password is missing!";
    return responseError;
  }

  const registeredUser = await Users.findOne({
    where: {
      username: username
    }
  });

  if (!registeredUser) {
    responseError.message = "User not found.";
    return responseError;
  }

  // @params: input password, hashed password
  const match = await bcrypt.compare(password, registeredUser.password);
  if (!match) {
    responseError.message = "Wrong password!";
    return responseError;
  }

  responseSuccess.message = "Login success.";
  responseSuccess.data = {
    name: registeredUser.name,
    username: registeredUser.name,
    email: registeredUser.email,
    no_telepon: registeredUser.no_telepon,
    alamat: registeredUser.alamat,
    role: registeredUser.role,
    is_verified: registeredUser.is_verified,
    token: registeredUser.token
  };

  return responseSuccess;
};

const registerAdmin = async (requestBody) => {
  const { name, username, email, password, confirmPassword, role } = requestBody;

  let responseError = new ResponseClass.ErrorResponse();
  let responseSuccess = new ResponseClass.SuccessResponse();

  // checking if email, username, or password is empty
  if (
    !name ||
    !email ||
    !username ||
    !password
  ) {
    responseError.message = "Name, email, username, or password is missing!";
    return responseError;
  }

  // regex for email format
  const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegexp.test(email)) {
    responseError.message = "Email is invalid.";
    return responseError;
  }

  const emailRegistered = await Admin.findOne({
    where: {
      email: email
    }
  });
  if (emailRegistered) {
    responseError.message = "This email has been registered.";
    return responseError;
  }

  const usernameRegistered = await Admin.findOne({
    where: {
      username: username
    }
  });
  if (usernameRegistered) {
    responseError.message = "This username has been registered.";
    return responseError;
  }

  // @params: email and isShowDetail
  const isPasswordPassed = validatePassword(password, false);
  if (!isPasswordPassed) {
    responseError.message = validatePassword(password, true);
    return responseError;
  }

  if (password !== confirmPassword) {
    responseError.message = "Password and confirm password do not match.";
    return responseError;
  }

  const salt = bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  // TODO CHANGE TOKEN TO ACCESS TOKEN AND REFRESH TOKEN
  try {
    let token;
    if (role === 'admin') {
      token = jwt.sign({
        name,
        email,
        username,
        role
      }, process.env.ADMIN_TOKEN_SECRET, {
        expiresIn: 0
      });
    } else {
      token = jwt.sign({
        name,
        email,
        username,
        role
      }, process.env.CS_TOKEN_SECRET, {
        expiresIn: 0
      });
    }

    await Admin.create({
      name: name,
      email: email,
      username: username,
      password: hashedPassword,
      role: role,
      token: token
    });

    responseSuccess.message = "Successfully registered.";
    responseSuccess.data = {
      name: name,
      username: username,
      email: email,
      role: role,
      token: token
    };
    return responseSuccess;
  } catch (error) {
    responseError.code = 500;
    responseError.message = error;
    return responseError;
  }
};

const loginAdmin = async (requestBody) => {
  const { username, password } = requestBody;
  let responseError = new ResponseClass.ErrorResponse();
  let responseSuccess = new ResponseClass.SuccessResponse();

  if (!username || !password) {
    responseError.message = "Email or password is missing!";
    return responseError;
  }

  const registeredAdmin = await Admin.findOne({
    where: {
      username: username
    }
  });

  if (!registeredAdmin) {
    responseError.message = "Admin not found.";
    return responseError;
  }

  // @params: input password, hashed password
  const match = await bcrypt.compare(password, registeredAdmin.password);
  if (!match) {
    responseError.message = "Wrong password!";
    return responseError;
  }

  responseSuccess.message = "Login success.";
  responseSuccess.data = {
    name: registerAdmin.name,
    username: registeredAdmin.username,
    email: registeredAdmin.email,
    role: registeredAdmin.role,
    token: registeredAdmin.token
  };

  return responseSuccess;
};

export default {
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin
};