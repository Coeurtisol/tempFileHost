import express from "express";
import __dirname from "./index.js";
import { upload, getFile } from "./fileController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
router.post("/upload",upload);
router.get("/:id",getFile);

export default router;
