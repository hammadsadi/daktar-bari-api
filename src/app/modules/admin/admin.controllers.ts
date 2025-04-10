import { Request, Response } from "express";
import { AdminServices } from "./admin.services";

/**
 * @Method GET
 * @Dsc GET ALL ADMINS
 * @Return Data
 */
const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const result = await AdminServices.getAllAdminFromDB(req.query);
    res.status(200).json({
      success: true,
      message: "Admin Retrieved Successful",
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

export const AdminControllers = {
  getAllAdmin,
};
