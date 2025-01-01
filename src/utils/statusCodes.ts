interface statusCode {
  OK: number;
  CREATED: number;
  UNAUTHORIZED: number;
  BAD_REQUEST: number;
  NOT_FOUND: number;
  INTERNAL_SERVER_ERROR: number;
}

const HttpStatus: statusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export default HttpStatus;
