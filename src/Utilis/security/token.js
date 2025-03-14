import jwt from "jsonwebtoken";
export const generateToken = ({
  payload = {},
  signature = process.env.TOKEN_SIGNATURE,
} = {}) => {
  const token = jwt.sign(payload, signature);
  return token;
};

export const verifyToken = ({
  token,
  signature = process.env.TOKEN_SIGNATURE,
} = {}) => {
  const decode = jwt.verify(token, signature);
  return decode;
};
