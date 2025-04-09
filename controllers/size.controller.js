const Size = require("../models/size.model");
const slugify = require("slugify");

// @desc    Get all sizes
// @route   GET /api/sizes
// @access  Public
exports.getSizes = async (req, res) => {
  try {
    const sizes = await Size.find();
    res.json(sizes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sizes" });
  }
};

// @desc    Get a single size by ID
// @route   GET /api/sizes/:id
// @access  Public
exports.getSizeById = async (req, res) => {
  try {
    const size = await Size.findById(req.params.id);
    if (!size) return res.status(404).json({ message: "Size not found" });
    res.json(size);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch size" });
  }
};

// @desc    Create a new size
// @route   POST /api/sizes
// @access  Private
exports.createSize = async (req, res) => {
  try {
    const { name, widthFeet, heightFeet, isRound } = req.body;
    if (!name || widthFeet === undefined) return res.status(400).json({ message: "Name and width are required" });

    const slug = slugify(name, { lower: true, strict: true });

    const widthCm = (widthFeet * 30.48).toFixed(2);  // Convert Feet to CM
    let heightCm = null;

    if (!isRound) {
      if (!heightFeet) return res.status(400).json({ message: "Height is required for non-round sizes" });
      heightCm = (heightFeet * 30.48).toFixed(2); // Convert Feet to CM
    }

    const newSize = new Size({ name, slug, widthFeet, widthCm, heightFeet, heightCm, isRound });
    await newSize.save();

    res.status(201).json(newSize);
  } catch (error) {
    res.status(500).json({ message: "Failed to create size" });
  }
};

// @desc    Update a size
// @route   PUT /api/sizes/:id
// @access  Private
exports.updateSize = async (req, res) => {
  try {
    const { name, widthFeet, heightFeet, isRound } = req.body;
    const size = await Size.findById(req.params.id);

    if (!size) return res.status(404).json({ message: "Size not found" });

    size.name = name || size.name;
    size.slug = slugify(size.name, { lower: true, strict: true });
    size.widthFeet = widthFeet !== undefined ? widthFeet : size.widthFeet;
    size.widthCm = (size.widthFeet * 30.48).toFixed(2);

    if (!isRound) {
      if (heightFeet !== undefined) {
        size.heightFeet = heightFeet;
        size.heightCm = (heightFeet * 30.48).toFixed(2);
      }
    } else {
      size.heightFeet = null;
      size.heightCm = null;
    }

    size.isRound = isRound !== undefined ? isRound : size.isRound;

    await size.save();
    res.json(size);
  } catch (error) {
    res.status(500).json({ message: "Failed to update size" });
  }
};

// @desc    Delete a size
// @route   DELETE /api/sizes/:id
// @access  Private
exports.deleteSize = async (req, res) => {
  try {
    const size = await Size.findById(req.params.id);
    if (!size) return res.status(404).json({ message: "Size not found" });

    await size.deleteOne();
    res.json({ message: "Size deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete size" });
  }
};
