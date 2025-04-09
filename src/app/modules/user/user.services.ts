// Admin Save to DB
const adminSaveToDB = async (data: any) => {
  console.log(data);
  return {
    data,
  };
};

export const UserServices = {
  adminSaveToDB,
};
