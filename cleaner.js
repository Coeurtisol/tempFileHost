import fs from "fs";
import __dirname from "./index.js";
import pool from "./database.js";

/**
 * Supprimer les fichiers sauvegardés sans lien valide ainsi que les fichiers temporaires d'upload échoués.
 */
export async function clean() {
  // FICHIERS SAUVEGARDES LIEN DATE EXPIREE
  let conn;
  try {
    conn = await pool.getConnection();
    const dbRes = await conn.query("SELECT * FROM files WHERE expire_at < ?", [
      new Date(Date.now()),
    ]);
    dbRes.forEach((file) => {
      const fileName = file.file_name;
      console.log(fileName);
      fs.rm(__dirname + "/files/" + fileName, async () => {
        //TODO à revoir (passer en synchrone?)
        console.info(`Fichier " ${fileName} " supprimé`);
        await conn.query("DELETE FROM files WHERE file_name = ?", [fileName]);
        console.info(`Chemin " ${fileName} " supprimé`);
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  } finally {
    if (conn) conn.release();
  }
  // FICHIERS TEMPORAIRES D'UPLOAD ECHOUES
  fs.readdir(__dirname + "/tempFiles", (err, files) => {
    console.log("fichiers temporaires", files);
    if (files) {
      files.forEach((file) => {
        fs.rmSync(__dirname + "/tempFiles/" + file);
        console.info(`Fichier " ${file} " supprimé`);
      });
    }
  });
}

// fs.readdir(__dirname + "/files", (err, files) => {
//   console.log("fichiers sauvegardés", files);
//   if (files) {
//     files.forEach((file) => {
//       if (!registre.has(file)) {
//         fs.rmSync(__dirname + "/files/" + file);
//         console.info(`Fichier " ${file} " supprimé`);
//       }
//     });
//   }
// });
