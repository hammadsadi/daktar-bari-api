import { Request, Response } from "express";
import { UserServices } from "./user.services";

/**
 * @Method POST
 * @Dsc Admin Create
 * @Return Data
 */
const createAdmin = async (req: Request, res: Response) => {
  // console.log(req.body);
  const result = await UserServices.adminSaveToDB(req.body);
  res.send(result);
};

export const UserCOntrollers = {
  createAdmin,
};
