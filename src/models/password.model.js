import PasswordValidator from "password-validator";

export const validatePassword = (email, showDetails) => {
  const schema = new PasswordValidator();
  schema
    .is().min(8)
    .has().uppercase()
    .has().lowercase()
    .has().digits(2)
    .has().not().spaces();

  if (showDetails) {
    return schema.validate(email, { details: true });
  } else {
    return schema.validate(email);
  }
};