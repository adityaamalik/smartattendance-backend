const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(express.urlencoded({ extended: true }));
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");
mongoose
    .connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "smartAttendanceDB",
    })
    .then(() => console.log("Database connected!"))
    .catch((err) => console.log(err));

const teachersRouter = require("./routers/teachers");
const studentsRouter = require("./routers/students");

//routes
// app.use(authJwt());
// app.use(errorHandler);
app.use("/teacher", teachersRouter);
app.use("/student", studentsRouter);

app.get("/", (req, res) => {
    res.send("API working fine !");
});

app.listen(process.env.PORT, () =>
    console.log(`Server is running on ${process.env.PORT}`)
);
