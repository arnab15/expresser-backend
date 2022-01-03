const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/db");
const apiRouter = require("./routes/index");

const app = express();

connectDB();

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.use("/api/v1", apiRouter);

app.use((req, res, next) => {
	res.status(404).send({
		error: {
			status: 404,
			message: "Invalid route",
		},
	});
});

app.use((err, req, res, next) => {
	res.status(err.status || 500).send({
		error: {
			status: err.status || 500,
			message: err.message,
		},
	});
});

app.listen(PORT, console.log(`Server Running in ${process.env.NODE_ENV} mode on Port ${PORT}`));
