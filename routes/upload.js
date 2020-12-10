const router = require("express").Router();
const cloudinary = require("cloudinary");
const { refreshToken } = require("../controllers/userController");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const fs = require("fs");

//congif for cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

router.post("/upload", auth, authAdmin, (req, res) => {
  try {
    console.log(req.files);
    //if the files are note selected
    if (!req.files || Object.keys(req.files).length <= 0)
      return res.status(400).json({ msg: "No Files Uploaded." });
    //res.json("test upload");

    const file = req.files.file;
    //if file size is more than 1mb
    if (file.size > 1024 * 1024) {
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: "Size too large" });
    }

    //if file type is other than jpeg and png
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: "File format is not valid." });
    }

    //upload to cloduinary
    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: "test" },
      (err, result) => {
        if (err) throw err;
        removeTmp(file.tempFilePath);
        res.json({ public_id: result.public_id, url: result.secure_url });
      }
    );
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

router.post("/deleteItem", auth, authAdmin, (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ msg: "No image selected." });

    //for deleting the photo
    cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
      if (err) throw err;
      res.json({ msg: "Deleted Image." });
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

//function to remove tmp files from the project
const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = router;
