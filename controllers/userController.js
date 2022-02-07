const Users = require("../models/userModel");
const Payments = require("../models/paymentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {
  register: async (req, res) => {
    try {
      //extracting data from the request
      const { name, email, password } = req.body;

      //checking if the email already exists
      const user = await Users.findOne({ email });

      //if email exists
      if (user)
        return res.status(400).json({ msg: "The email already exists." });

      //if password is less than 6 charac
      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password is at least 6 characters long." });

      //encrypting the password
      const passwordHash = await bcrypt.hash(password, 10);

      //creating a new user
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });

      //saving to the databse
      await newUser.save();

      //creating access token and refresh token
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 1000,
      });

      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      //extracting the data from rrequest
      const { email, password } = req.body;

      //check if email exists
      const user = await Users.findOne({ email });

      //if email doesnt exist
      if (!user)
        return res
          .status(400)
          .json({ msg: "User does not exist. Please register!" });

      //if email exists then do the password comparsion
      const isMatch = await bcrypt.compare(password, user.password);

      //if passowrd doesnt match
      if (!isMatch) return res.status(400).json({ msg: "Incorrect Password" });

      //if password match create tokens for the authentication
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 1000,
      });

      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      //clearing the refresh token cookie
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Logged Out" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      //extracting the refreshtoken cookie from the request
      const rf_token = req.cookies.refreshtoken;

      //if the cookie doesnt exists
      if (!rf_token)
        return res.status(400).json({ msg: "Please Login or Register" });

      //if cookie exists
      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please Login or Register" });

        const accesstoken = createAccessToken({ id: user.id });

        res.json({ accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      if (!user) return res.status(400).json({ msg: "User does not exist." });
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addCart: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      await Users.findByIdAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );

      return res.json({ msg: "Added to the cart." });
    } catch (err) {
      return res.status(500).json({ msg: err.mesaage });
    }
  },
  history: async (req, res) => {
    try {
      const history = await Payments.find({ user_id: req.user.id });
      console.log(history);
      res.json(history);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

//function for creating access token
const createAccessToken = (user) => {
  return jwt.sign(user, `${process.env.ACCESS_TOKEN_SECRET}`, {
    expiresIn: "11m",
  });
};

//function for creating refresh token
const createRefreshToken = (user) => {
  return jwt.sign(user, `${process.env.REFRESH_TOKEN_SECRET}`, {
    expiresIn: "7d",
  });
};

module.exports = userController;
