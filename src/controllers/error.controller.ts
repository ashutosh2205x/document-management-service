import AppError from "../utils/errors/app.error";

const handleZodError = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = async (err, req, res) => {
  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: `${err.message}`,
  });
};

const sendErrorProd = async (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: `${err.message}`,
      });
    }

    return res.status(500).json({
      status: "error",
      message: `Something went wrong!`,
    });
  }

  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: `Please try again later.`,
  });
};

export default function globalErrorHandler(err: { name: any; statusCode: number; status: string; message: any }, req: any, res: any, next: any) {
  console.log(err.name);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (error.name === "ZodError") error = handleZodError(error);
    sendErrorProd(error, req, res);
  }
}
