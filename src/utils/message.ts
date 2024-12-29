import express from "express";

const sendResponseJson = ({
  res,
  message,
  status,
  success = false,
}: {
  res: express.Response;
  message: string;
  status: number;
  success: boolean;
}) => {
  res.status(status).json({
    message,
    success,
  });
};

export default sendResponseJson;
