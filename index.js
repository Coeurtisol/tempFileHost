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

(async function () {
  fs.readdir(__dirname + "/files", (err, files) => {
    console.log("fichiers", files);
    if (files) {
      files.forEach((file) => {
        if (!registre.has(file)) {
          fs.rmSync(__dirname + "/files/" + file);
          console.info(`Fichier " ${file} " supprimé`);
        }
      });
    }
  });
})();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/upload", async (req, res) => {
  if (!req.files) {
    res.send("No file");
    return;
  }
  const file = req.files.file;
  const newId = Math.floor(
    Math.random() * 0xffffff
  ).toString(16);
  await file.mv(`${__dirname}/files/${newId + file.name}`);
  registre.set(newId, newId + file.name);
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
