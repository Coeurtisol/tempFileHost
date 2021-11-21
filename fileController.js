import fsPromise from "fs/promises";
import pool from "./database.js";
import __dirname from "./index.js";

export async function upload(req, res) {
  if (!req.files) {
    res.end("No file");
    return;
  }
  const file = req.files.file;
  const { timeLife, useLife } = req.body;
  const expire_at = new Date(Date.now() + Number(timeLife));
  const life = useLife == "" ? null : Number(useLife);
  const newId = "f" + Math.floor(Math.random() * 0xffffff).toString(16);
  const newFileName = newId + file.name;
  let conn;
  try {
    await file.mv(`${__dirname}/files/${newFileName}`);
    conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO files(id,file_name,expire_at,life) value (?,?,?,?)",
      [newId, newFileName, expire_at, life]
    );
    res.end(newId);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  } finally {
    if (conn) conn.release();
  }
}

export async function getFile(req, res) {
  const id = req.params.id;
  if (id == "favicon.ico") {
    //TODO voir pour une autre solution?
    res.end();
    return;
  }
  let conn;
  try {
    conn = await pool.getConnection();
    const dbRes = await conn.query("SELECT * FROM files WHERE id = ?", [id]);
    if (dbRes.length == 0) {
      res.end("Lien invalide ou fichier introuvable");
      return;
    }
    const file = dbRes[0].file_name;
    const stats = await fsPromise.stat("./files/" + file);
    if (!stats) {
      res.end("Lien expiré");
      return;
    }
    res.sendFile(__dirname + "/files/" + file);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  } finally {
    if (conn) conn.release();
  }
}
