import express from "express";
import mongoose from "mongoose";
import fileRouter from "./routes/file.js"

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/public",express.static("public"));
app.use("/file", fileRouter);

mongoose.connect("mongodb://localhost:27017/File_DB_Dev");

const connection = mongoose.connection;

connection.once("connected", () => console.log("Database is connected..."));
connection.on("error", (error) => console.log("Database connectivity error..."));

app.listen(2024, () =>{
    console.log("Server is running at port 2024.");
})