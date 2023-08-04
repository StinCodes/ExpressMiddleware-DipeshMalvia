const express = require("express");
const app = express();
const port = 5001;
const router = express.Router();

// *Application-lvl Middleware
// logs req that server is receiving
const loggerMiddleware = (req, res, next) => {
  console.log(`${new Date()} ---Request [${req.method}] ,[${req.url}]`);
  next();
};

app.use(loggerMiddleware);

// *Third-party Middleware

// *Router-level Middleware
app.use("/api/users", router);

const fakeAuth = (req, res, next) => {
  const authStatus = false;
  if (authStatus) {
    console.log("User authStatus:", authStatus);
    next();
  } else {
    res.status(401);
    throw new Error("User is not authorized");
  }
};

const getUsers = (req, res) => {
  res.json({ message: "Get all users" });
};
const createUser = (req, res) => {
  res.json({ message: "Create new user" });
};

router.use(fakeAuth);
router.route("/").get(getUsers).post(createUser);

// *Built-in Middleware

// *Error-handling Middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  switch (statusCode) {
    case 401:
      res.json({
        title: "Unauthorized",
        message: err.message,
      });
      break;
    case 404:
      res.json({
        title: "Not Found",
        message: err.message,
      });
      break;
    case 500:
      res.json({
        title: "Server Error",
        message: err.message,
      });
      break;
    default:
      break;
  }
};

//error handler middleware used at app lvl
app.use(errorHandler)

//*Port listener
app.listen(port, () => {
  console.log(`Sever starting on ${port}`);
});
