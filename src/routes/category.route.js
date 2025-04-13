const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller.js");

// Get all categories
router.get("/", getCategories);

// Get a single category by ID
router.get("/:id", getCategoryById);

// Create a new category
router.post("/", createCategory);

// Update a category
router.put("/:id", updateCategory);

// Delete a category
router.delete("/:id", deleteCategory);

module.exports = router;
