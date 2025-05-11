const Router = require("express");
const router = Router();
const multer  = require('multer')
const path=require("path")

const Blog=require("../models/blog");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    const filename=`${Date.now()}-${file.originalname}`;
    cb(null,filename);
  }
})
const upload=multer({storage:storage});

router.get("/add-new",(req,res)=>{
    res.render("blog",{
        user:req.user,
    });
})




router.post("/",upload.single("coverImage"),async (req,res)=>{
    const {title,body}=req.body;
  const blog= await Blog.create({
        body,
        title,
        createdBy:req.user._id,
        coverImage:`uploads/${req.file.filename}`,
    });
    return res.redirect('/');
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.render("blogpage", {
      user: req.user,
      blog,
    });
  } catch (err) {
    res.status(500).send("Blog not found");
  }
});

module.exports = router;