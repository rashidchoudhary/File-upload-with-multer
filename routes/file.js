import express from "express";
const router = express.Router();
import fs from "fs";
import path from "path";
import upload from "../middlewares/upload.js";
import fileModel from "../models/file.js";

router.get("/", async (req,res) =>{
    try {
        const data = await fileModel.find();
        res.status(200).json(data);
    } catch (error){
        res.status(500).send(error);
    }
});

router.get("/:id", async (req, res) => {
    try {
      const data = await fileModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  router.post("/", upload.single("file"), async (req,res) =>{
    try {
        if(req.file) {
            req.file.path = req.file.path.replace(`\\`,`/`);
            const file = {
                link: `${req.protocol}://${req.get("host")}/${req.file.path}`,
                name: req.file.filename,
                original_name: req.file.originalname,
                type: req.file.mimetype,
                path: req.file.path,
            }
            const data = await fileModel.create(file);
            res.status(200).json(data);
        } else {
            res.status(400).send("File not found");
        }
    } catch (error){
        res.send(error);
    }
  });
  router.patch("/:id", upload.single("file"), async (req,res) =>{
    try {
        if(req.file) {
            req.file.path = req.file.path.replace(`\\`,`/`);
            const file = {
                link: `${req.protocol}://${req.get("host")}/${req.file.path}`,
                name: req.file.filename,
                original_name: req.file.originalname,
                type: req.file.mimetype,
                path: req.file.path,
            }
            const data = await fileModel.findByIdAndUpdate(req.params.id, file);
            res.status(200).json(data);
        } else {
            res.status(400).send("File not found");
        }
    } catch (error) {
        res.status(500).send(error);
    }
  });
  router.delete("/:id", async (req, res) => {
    try {
      const file = await fileModel.findById(req.params.id);
      if (file) {
        const filePath = path.resolve(file.path);
        // Remove the file from the file system
        fs.unlink(filePath, async (err) => {
          if (err) {
            return res.status(500).send("Failed to delete file from server");
          }
  
          // Remove the file from the database
          const data = await fileModel.findByIdAndDelete(req.params.id);
          res.status(200).json({ message: "File successfully deleted", data });
        });
      } else {
        res.status(404).send("File not found in database");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  export default router;