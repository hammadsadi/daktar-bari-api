import { Request, Response } from "express";
import { UserServices } from "./user.services";

/**
 * @Method POST
 * @Dsc Admin Create
 * @Return Data
 */
const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.adminSaveToDB(req);
    res.status(200).json({
      success: true,
      message: "Admin Created Successful",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error?.name || "Something Went Wrong",
      Error: error,
    });
  }
};

export const UserControllers = {
  createAdmin,
};
