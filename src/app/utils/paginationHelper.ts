// Options Type
type TOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
};

type TCalculatePagination = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};

// Calculate Pagination
const calculatePagination = (options: TOptions): TCalculatePagination => {
  const page: number = Number(options?.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip: number = (Number(page) - 1) * limit;
  const sortBy: string = options?.sortBy || "createdAt";
  const sortOrder: string = options?.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const PaginationHelper = {
  calculatePagination,
};
