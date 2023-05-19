import bcrypt from 'bcrypt';
import ResponseClass from '../models/response.model.js';
import validatePassword from '../models/password.model.js';
import Users from '../models/users.model.js';
import jwt from 'jsonwebtoken';

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
    const data = await Users.create({
      name: name,
      email: email,
      username: username,
      password: hashedPassword,
      pin: pin,
      role: role
    });

    const token = jwt.sign({
      name,
      email,
      username,
      role
    }, process.env.USER_TOKEN_SECRET, {
      expiresIn: 0
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

  const userRegistered = await Users.findOne({
    where: {
      username: username
    }
  });

  if (!userRegistered) {
    responseError.message = "User not found.";
    return responseError;
  }

  // @params: input password, hashed password
  const match = await bcrypt.compare(password, userRegistered.password);
  if (!match) {
    responseError.message = "Wrong password!";
    return responseError;
  }

  responseSuccess.message = "Login success.";
  responseSuccess.data = {
    name: userRegistered.name,
    username: userRegistered.name,
    email: userRegistered.email,
    no_telepon: userRegistered.no_telepon,
    alamat: userRegistered.alamat,
    role: userRegistered.role,
    is_verified: userRegistered.is_verified,
    token: userRegistered.token
  };

  return responseSuccess;
};

export default {
  registerUser,
  loginUser,
};