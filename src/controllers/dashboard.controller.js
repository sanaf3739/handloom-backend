const Category = require("../models/category.model");
const Product = require("../models/product.model");

const handleAnalytics = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const categoryWiseProductCountsArr = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
        },
      },
      {
        $project: {
          category: "$category.name",
          count: 1,
        },
      },
    ]);

    const categoryWiseProductCounts = {};

    categoryWiseProductCountsArr.forEach((item) => {
      if (item.category) {
        categoryWiseProductCounts[item.category?.replace(" ", "")] = item.count;
      }
    });

    return res.status(200).json({
      succuss: true,
      totalProducts: totalProducts,
      categoryWiseProductCounts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  handleAnalytics,
};
