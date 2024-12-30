import express from "express";

const sendResponseJson = (
  res: express.Response,
  status: number,
  message: string,
  success: boolean
) => {
  res.status(status).json({
    message,
    success,
  });
};

export default sendResponseJson;
