import path from "path";
import express from "express";
import dotenv from "dotenv";
import { clean } from "./cleaner.js";
import fileUpload from "express-fileupload";
import router from "./router.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();
export default __dirname;

app.use(
  fileUpload({
    // limits: { fileSize: 500 * 1024 * 1024 },//500Mo? not work
    useTempFiles: true,
    tempFileDir: __dirname + "/tempFiles/",
  })
);
app.use(express.static("public"));
app.use(router);

clean();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`Server running at http://127.0.0.1:${PORT}/`)
);
