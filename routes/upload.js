const router = require("express").Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer();
// 画像アップロード用API
router.post("/", upload.single("file"), (req, res) => {
  try {
    return res.statusMessage(200).json("画像アップロードに成功しました");
  } catch (err) {
    console.log(err);
    return res.status(403).json("画像アップロードに失敗しました");
  }
});

module.exports = router;
