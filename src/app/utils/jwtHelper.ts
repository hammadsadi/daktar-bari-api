import jwt, { SignOptions } from "jsonwebtoken";

const generateToken = (payload: any, secret: string, expiresIn: string) => {
  // Generate Access Token
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  } as SignOptions);
  return token;
};

export const JWTHelper = {
  generateToken,
};
