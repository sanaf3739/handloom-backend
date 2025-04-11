const Category = require("../models/category.model.js");
const Product = require("../models/product.model.js");

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("size", "name");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    let { page, limit, search, category, minPrice, maxPrice, rating, size, sort } =
      req.query;

    // Default pagination values
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 1000;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    // Handle category filtering by slug
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category }); // Find category by slug
      if (categoryDoc) {
        filter.category = categoryDoc._id; // Use its ObjectId
      } else {
        return res.status(404).json({ message: "Category not found" });
      }
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (rating) filter.rating = { $gte: parseFloat(rating) };
    if (size && mongoose.Types.ObjectId.isValid(size)) {
      filter.size = new mongoose.Types.ObjectId(size);
    }

    // Sorting Logic
    let sortOption = { createdAt: -1 }; // Default: Newest First
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "rating") sortOption = { rating: -1 };

    // Fetch products with filters, pagination, sorting
    // console.log(filter);
    const products = await Product.find(filter)
      .populate("category")
      .populate("size", "name")
      .skip(skip)
      .limit(limit)
      .sort(sortOption);

    // Get total count
    // console.log(products);
    const totalCount = await Product.countDocuments(filter);

    res.json({
      totalItems: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

const addProduct = async (req, res) => {
  console.log(req.file);
  try {
    const { name, originalPrice, price, rating, size, description, category } = req.body;
    const images = req.files
      ? req.files.map((file) => `${process.env.APP_URL}/uploads/${file.filename}`)
      : [];

    if (!images.length) {
      return res.status(422).json({
        success: false,
        message: "Please upload an image",
      });
    }
    // Auto-calculate discount
    const discount = Math.ceil(((originalPrice - price) / originalPrice) * 100);

    const newProduct = new Product({
      name,
      originalPrice,
      price,
      discount,
      rating,
      size,
      description,
      category,
      images,
    });

    const savedProduct = await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", product: savedProduct });
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  console.log(req.files);
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, originalPrice, price, rating, size, description, category } = req.body;
    const images = req.files
      ? req.files.map((file) => `${process.env.APP_URL}/uploads/${file.filename}`)
      : [];

    // Recalculate discount if originalPrice or price is changed
    const discount =
      originalPrice && price
        ? ((originalPrice - price) / originalPrice) * 100
        : product.discount;

    product.name = name || product.name;
    product.originalPrice = originalPrice || product.originalPrice;
    product.price = price || product.price;
    product.discount = discount;
    product.rating = rating || product.rating;
    product.size = size || product.size;
    product.description = description || product.description;
    product.category = category || product.category;
    if (images.length > 0) {
      product.images = images;
    }

    const updatedProduct = await product.save();
    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

module.exports = {
  getProduct,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
