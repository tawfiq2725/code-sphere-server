import { Model } from "mongoose";

export interface PaginationOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}
export const paginate = async <T>(
  model: Model<T>,
  options: PaginationOptions,
  additionalQuery: Record<string, any> = {}
): Promise<{
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> => {
  const page = options.page && options.page > 0 ? options.page : 1;
  const limit = options.limit && options.limit > 0 ? options.limit : 10;
  const skip = (page - 1) * limit;

  const query: Record<string, any> = { ...additionalQuery };

  if (options.search) {
    query.$or = [
      { name: { $regex: options.search, $options: "i" } },
      { email: { $regex: options.search, $options: "i" } },
    ];
  }

  if (options.category) {
    query.category = options.category;
  }

  const dataPromise = model.find(query).skip(skip).limit(limit);
  const countPromise = model.countDocuments(query);

  const [data, total] = await Promise.all([dataPromise, countPromise]);
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};
