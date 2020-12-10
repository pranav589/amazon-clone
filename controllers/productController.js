const Products = require("../models/productModel");

//class for filtering ,sorting and pagination
class APIfeatures {
  //creating a constructor with the params
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering(){
    const queryObj = {...this.queryString} //queryString = req.query

    const excludedFields = ['page', 'sort', 'limit']
    excludedFields.forEach(el => delete(queryObj[el]))
    
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

 //    gte = greater than or equal
 //    lte = lesser than or equal
 //    lt = lesser than
 //    gt = greater than
    this.query.find(JSON.parse(queryStr))
      
    return this;
 }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join("");
      //console.log(sortBy)
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  paginating(){
    const page = this.queryString.page * 1 || 1
    const limit = this.queryString.limit * 1 || 9
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit)
    return this;
}
}

const productController = {
  getProducts: async (req, res) => {
    try {
      //console.log(req.query)
      const features = new APIfeatures(Products.find(), req.query)
        .filtering()
        .sorting()
        .paginating();
      const products = await features.query;
      res.json({
        status: "success",
        result: products.length,
        products: products,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      //extracting from req
      const {
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
      } = req.body;

      //if images doesnt exists
      if (!images) return res.status(400).json({ msg: "No image uploaded." });

      //checking if the product already exists
      const product = await Products.findOne({ product_id });

      //if product exists
      if (product)
        return res.status(400).json({ msg: "Product already exists." });

      //if products doesnt exists then creating one
      const newproduct = new Products({
        product_id,
        title: title.toLowerCase(),
        price,
        description,
        content,
        images,
        category,
      });

      await newproduct.save();

      res.json({ msg: "Product is created" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      //deleting
      await Products.findByIdAndDelete(req.params.id);
      res.json({ msg: "Product is deleted!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { title, price, description, content, images, category } = req.body;

      if (!images) return res.status(400).json({ msg: "No image to upload." });

      await Products.findByIdAndUpdate(
        {_id: req.params.id},
        {
          title: title.toLowerCase(),
          price,
          description,
          content,
          images,
          category,
        }
      );
      res.json({ msg: "Product is updated!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = productController;
