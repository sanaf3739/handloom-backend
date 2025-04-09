const express = require("express");
const { verifyAdmin } = require("../middlewares/verifyAdmin.middleware.js");
const { addProduct, getProduct, getProducts, updateProduct, deleteProduct } = require("../controllers/product.controller.js");
const upload = require("../middlewares/multer.middleware.js");

const router = express.Router();

router.post("/", verifyAdmin, upload.array("images", 5), addProduct);

router.get("/", getProducts);

router.get("/:id",verifyAdmin, getProduct);

router.patch("/:id", verifyAdmin, upload.single("image"), updateProduct);

router.delete("/:id", verifyAdmin, deleteProduct);

module.exports = router;
