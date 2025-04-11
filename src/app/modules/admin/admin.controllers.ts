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
    const resData = await AdminServices.getAllAdminFromDB(filter, options);
    res.status(200).json({
      success: true,
      message: "Admin Retrieved Successful",
      metaData: resData.meta,
      data: resData.result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error?.name || "Something Went Wrong",
      Error: error,
    });
  }
};

/**
 * @Method GET
 * @Dsc GET Single ADMIN
 * @Params adminId
 * @Return Data
 */

const getSingleAdmin = async (req: Request, res: Response) => {
  // Get Id From Params
  const { adminId } = req.params;
  try {
    const resData = await AdminServices.findSingleAdminFromDB(adminId);
    res.status(200).json({
      success: true,
      message: "Admin Retrieved Successful",
      data: resData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error?.name || "Something Went Wrong",
      Error: error,
    });
  }
};

/**
 * @Method PATCH
 * @Dsc Update Single ADMIN Data
 * @Params adminId
 * @Return Data
 */

const updateAdminData = async (req: Request, res: Response) => {
  // Get Id From Params
  const { adminId } = req.params;
  try {
    const resData = await AdminServices.adminDataUpdate(adminId, req.body);
    res.status(200).json({
      success: true,
      message: "Admin Data Updated Successful",
      data: resData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error?.name || "Something Went Wrong",
      Error: error,
    });
  }
};

/**
 * @Method DELETE
 * @Dsc DELETE Single ADMIN Data
 * @Params adminId
 * @Return Data
 */

const deleteAdminData = async (req: Request, res: Response) => {
  // Get Id From Params
  const { adminId } = req.params;
  try {
    const resData = await AdminServices.deleteSingleAdmin(adminId);
    res.status(200).json({
      success: true,
      message: "Admin Data Deleted Successful",
      data: resData,
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
  getSingleAdmin,
  updateAdminData,
  deleteAdminData,
};
