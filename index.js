import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// Middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// In-memory storage for blog posts
let posts = [];
let idCounter = 1;

// Home page
app.get("/", (req, res) => {
  res.render("index", { posts });
});

// Show create post form
app.get("/create", (req, res) => {
  res.render("create");
});

// Handle new post submission
app.post("/create", (req, res) => {
  const { name, title, body } = req.body;
  const createdAt = new Date();
  posts.push({ id: idCounter++, name, title, body, createdAt });
  res.redirect("/");
});

// Handle post deletion
app.post("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  posts = posts.filter(post => post.id !== id);
  res.redirect("/");
});

// Show edit form
app.get("/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find(p => p.id === id);
  if (!post) return res.status(404).send("Post not found");
  res.render("edit", {post});
});

// Handle edit submission
app.post("/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const post  = posts.find(p => p.id === id);
  if (post) {
    post.name = req.body.name;
    post.title = req.body.title;
    post.body = req.body.body;
  }
  res.redirect("/");
});

// Server Listening Port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
