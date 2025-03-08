import { Model } from "mongoose";

export interface PaginationOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  populate?: string | string[]; // Added populate property
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

  let dataQuery = model.find(query).skip(skip).limit(limit);

  // If populate is provided in options, use it
  if (options.populate) {
    dataQuery = dataQuery.populate(options.populate);
  }

  const dataPromise = dataQuery;
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
