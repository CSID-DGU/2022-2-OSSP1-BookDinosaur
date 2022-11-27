require("dotenv").config({ path: "../.env" });

const express = require("express");
const path = require("path");
const session = require("express-session");
const MemoryStore = require("memorystore")(session); // WARNING: MemoryStore is not designed for a production environment.

const authRouter = require("./routes/auth");
const booksRouter = require("./routes/books");
const bookReportsRouter = require("./routes/bookReports");
const kakaoRouter = require("./routes/kakao");
const usersRouter = require("./routes/user");

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// session setup
const options = {
  cookie: { maxAge: 1000 * 60 * 60 },
  resave: false,
  rolling: true,
  secret: process.env.SESSION_SECRET,
  store: new MemoryStore({ checkPeriod: 1000 * 60 * 60 }),
};
app.use(session(options));

app.use("/auth", authRouter);
app.use("/books", booksRouter);
app.use("/bookReports", bookReportsRouter);
app.use("/kakao", kakaoRouter);
app.use("/user", usersRouter);

const port = process.env.PORT || "5000";
app.listen(port, () => console.log(`server is running ${port}`));

// serve static files
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(pathFjoin(__dirname, "../client/build/index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
