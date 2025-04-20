import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
// Create Token Generate Reuseable Function
const generateToken = (payload: any, secret: string, expiresIn: string) => {
  // Generate Access Token
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  } as SignOptions);
  return token;
};

const tokenVerify = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};
export const JWTHelper = {
  generateToken,
  tokenVerify,
};
