import fs from "fs";
import registre from "./tempDB.js";
import __dirname from "./index.js";

/**
 * Supprimer les fichiers sauvegardés sans lien valide ainsi que les fichiers temporaires d'upload échoués.
 */
export async function clean() {
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
