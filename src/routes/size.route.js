const express = require("express");
const router = express.Router();
const {
  getSizes,
  getSizeById,
  createSize,
  updateSize,
  deleteSize,
} = require("../controllers/size.controller");

router.get("/", getSizes);
router.get("/:id", getSizeById);
router.post("/", createSize);
router.put("/:id", updateSize);
router.delete("/:id", deleteSize);

module.exports = router;
