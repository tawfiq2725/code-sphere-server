import express from "express";

const sendResponseJson = (
  res: express.Response,
  status: number,
  message: string,
  success: boolean,
  _data?: any
) => {
  res.status(status).json({
    message,
    success,
    data: _data,
  });
};

export default sendResponseJson;
