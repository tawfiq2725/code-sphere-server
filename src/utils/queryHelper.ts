interface QueryOptions {
  page?: number | string;
  limit?: number | string;
  category?: string;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

interface QueryResult {
  filter: Record<string, any>;
  options: {
    skip: number;
    limit: number;
    sort: Record<string, number>;
  };
}

const queryHelper = (query: any, options: QueryOptions): QueryResult => {
  let {
    page = 1,
    limit = 10,
    category,
    search,
    sortBy = "createdAt",
    order = "desc",
  } = options;

  page = parseInt(page as string);
  limit = parseInt(limit as string);
  let skip = (page - 1) * limit;

  let filter: Record<string, any> = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  return {
    filter,
    options: {
      skip,
      limit,
      sort: { [sortBy]: order === "desc" ? -1 : 1 },
    },
  };
};

module.exports = queryHelper;
