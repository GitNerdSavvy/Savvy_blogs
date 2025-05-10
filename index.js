const express = require("express");
const mongoose=require("mongoose");
const path=require("path")
const {checkauth}=require("./middleware/auth")
const app = express();
const PORT = 3000;
mongoose.connect('mongodb://localhost:27017/savvy-blogs').then((e)=>console.log("Mongodb connected."))
const userRoutes=require("./routes/user");
const blogRoutes=require("./routes/blog");
const cookieParser = require("cookie-parser");
const Blog= require("./models/blog")
// const User=require("./models/user");
// middleware
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkauth("token"));
app.use(express.static(path.resolve("./public")));

// routes
app.get('/', async (req, res) => {
  try {
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
    res.render("home", {
      user: req.user,
      blogs: allBlogs,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.use("/user",userRoutes);
app.use("/blog",blogRoutes);

// server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
