const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const multer = require("multer");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const File = require("./models/File");

mongoose.connect(process.env.DATABASE_URL);

const upload = multer({ dest: "uploads" });

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
  };

  const file = await File.create(fileData);
  res.render("index", { fileLink: `${req.headers.origin}/file/${file.id}` });
});

app.get("/file/:id", async (req, res) => {
  const file = await File.findById(req.params.id);
  file.downloadCount++;
  await file.save();
  res.download(file.path, file.originalName);
});

app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
