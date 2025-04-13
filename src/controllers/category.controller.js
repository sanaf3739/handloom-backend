const Category = require("../models/category.model.js");
const slugify = require("slugify");

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// @desc    Get a single category by ID
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category" });
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Public (or Private if authentication is needed)
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    // Generate slug from name
    const slug = slugify(name, { lower: true, strict: true });

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ message: "Category with this name already exists" });
    }

    const newCategory = new Category({ name, slug });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Failed to create category" });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) return res.status(404).json({ message: "Category not found" });

    category.name = name || category.name;

    // Update slug only if the name has changed
    if (name) {
      category.slug = slugify(name, { lower: true, strict: true });
    }

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to update category" });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    await category.deleteOne();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category" });
  }
};
