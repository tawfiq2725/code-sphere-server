import express from "express";

const showFlashMessages = ({
  res,
  message,
  status,
  success = false,
}: {
  res: express.Response;
  message: string;
  success: boolean;
  status: number;
}) => {
  res.status(status).json({
    message,
    success,
  });
};

export default showFlashMessages;
