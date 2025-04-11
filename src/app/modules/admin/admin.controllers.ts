import { Request, Response } from "express";
import { AdminServices } from "./admin.services";
import pick from "../../utils/pick";
import { validateQueryData } from "./admin.constant";

/**
 * @Method GET
 * @Dsc GET ALL ADMINS
 * @Return Data
 */

const getAllAdmin = async (req: Request, res: Response) => {
  // Select Valid Key and Value
  const filter = pick(req.query, validateQueryData);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  try {
    const result = await AdminServices.getAllAdminFromDB(filter, options);
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
