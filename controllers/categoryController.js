const Category = require("../models/categoryModel");
const Products=require('../models/productModel')

const categoryController = {
  getCategories: async (req, res) => {
    try {
      //finding all the categories by find method which gives an array
      const categories = await Category.find();
      res.json(categories);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createCategory: async (req, res) => {
    try {
      //extracting the name from the body
      const { name } = req.body;

      //checking if the category name already exists
      const category = await Category.findOne({ name });

      //if the category name exists then
      if (category)
        return res.status(400).json({ msg: "This category already exists." });

      //if the category name doesnt exists then creating a new instnacee of the model  
      const newCategory = new Category({ name });

      await newCategory.save();

      res.json({ msg: "Category is created." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      //deleting a category
      const products=await Products.findOne({category:req.params.id})
      if(products) return res.status(400).json({msg:"Please delete all the related products."})
      await Category.findByIdAndDelete(req.params.id);
      res.json({ msg: "Category is deleted." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      //extracting the name from the body
      const { name } = req.body;

      //updating the category name
      await Category.findOneAndUpdate({ _id: req.params.id }, { name });

      res.json({ msg: "Category is updated." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = categoryController;
