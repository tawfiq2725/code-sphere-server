interface statusCode {
  OK: number;
  CREATED: number;
  MOVED_PERMANENTLY: number;
  FOUND: number;
  BAD_REQUEST: number;
  UNAUTHORIZED: number;
  PAYMENT_REQUIRED: number;
  NOT_FOUND: number;
  INTERNAL_SERVER_ERROR: number;
}

const HttpStatus: statusCode = {
  OK: 200,
  CREATED: 201,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export default HttpStatus;
