import path from "path";
import express from "express";
import fileUpload from "express-fileupload";
import fs from "fs";
import fsPromise from "fs/promises";

const app = express();
const __dirname = path.resolve();
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tempFiles/",
  })
);

const registre = new Map();

function filesList() {
  fs.readdir("/files", (err, files) => {
    // lister les fichiers d'un dossier
    if (files) {
      files.forEach((file) => {
        console.log(file);
      });
    }
  });
}

app.get("/", (req, res) => {
  filesList();
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/upload", async (req, res) => {
  if (!req.files) {
    res.send("No file");
    return;
  }
  const file = req.files.file;
  const newId = (
    // Date.now() + Math.floor(Math.random() * 0xffffffffff)
    Math.floor(Math.random() * 0xffffff)
  ).toString(16);
  await file.mv(`${__dirname}/files/${newId + file.name}`);
  registre.set(newId, newId + file.name);
  // for (const [key, value] of registre) {
  //   console.log(key, value);
  // }
  res.send(newId);
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  const file = registre.get(id);
  if (!file) {
    res.send("Lien invalide ou fichier introuvable");
    return;
  }
  try {
    const stats = await fsPromise.stat("./files/" + file);
    if (!stats) {
      res.send("Lien expiré");
      return;
    }
    res.sendFile(__dirname + "/files/" + file);
  } catch (error) {
    console.log(error);
    res.send("Lien expiré");
  }
});

const PORT = 8080;
app.listen(PORT, () =>
  console.log(`Server running at http://127.0.0.1:${PORT}/`)
);
