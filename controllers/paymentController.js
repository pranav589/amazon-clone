const Payments = require("../models/paymentModel");
const Users = require("../models/userModel");
const Products = require("../models/productModel");
const Razorpay = require("razorpay");
const stripe = require("stripe")(
  "sk_test_51KP2h3SJSZkjo118nLb9bLEy2yl6NgBDmzX8EW8BD7vzdHn5d1hyJFm8UqN4B9pEaSHXnY1ApJNm5uvkHZObNAYY00uk8hNvFa"
);

const { v4: uuidv4 } = require("uuid");

const idmpotencyKey = uuidv4();

const paymentController = {
  getPayments: async (req, res) => {
    try {
      const payments = await Payments.find();
      res.json(payments);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createPayment: async (req, res) => {
    console.log(req.user.id);
    try {
      const user = await Users.findById(req.user.id).select("name email");
      console.log(user);
      if (!user) return res.status(400).json({ msg: "User does not exist." });
      console.log(req.body);
      const { cart, paymentID, address } = req.body;

      const { _id, name, email } = user;
      const newPayment = new Payments({
        user_id: _id,
        name,
        email,
        cart,
        paymentID,
        address,
      });

      cart.filter((item) => {
        return sold(item._id, item.quantity, item.sold);
      });

      await newPayment.save();
      res.json({ msg: "Payment Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const sold = async (id, quantity, oldSold) => {
  await Products.findOneAndUpdate(
    { _id: id },
    {
      sold: quantity + oldSold,
    }
  );
};

module.exports = paymentController;
