import bodyParser from "body-parser";
import express from "express";
import db from "./database/db.js";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM blog_posts;");
    //console.log(result);
    res.render("index.ejs", { articles: result.rows });
  } catch (error) {
    console.error("Error retrieving blog posts:", error);
    res.status(500).send("Server error");
  }
});

app.get("/new", (req, res) => {
  res.render("new-post.ejs");
});

app.get("/readMore/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await db.query(
      "SELECT * FROM blog_posts WHERE blog_id = $1;",
      [id]
    );

    if (result.rows.length < 1) {
      throw new Error("No blog found");
    }
    res.render("full-post.ejs", { article: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(404).send("Error: 404 - Post not found");
  }
});

app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await db.query(
      "SELECT * FROM blog_posts WHERE blog_id = $1;",
      [id]
    );

    if (result.rows.length < 1) {
      throw new Error("No blog found");
    }
    res.render("edit-page.ejs", { article: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(404).send("Error: 404 - Post not found");
  }
});

app.post("/newPost", async (req, res) => {
  const { title, summary, content } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO blog_posts (title, summary, main_content) VALUES ($1, $2, $3);",
      [title, summary, content]
    );
  } catch (error) {
    console.log("Failed to insert new blog post", error);
    res.status(500).send("Unable to upload blog post");
  }

  res.redirect("/");
});

app.patch("/updateBlogPost", async (req, res) => {
  const { id, title, summary, content } = req.body;

  try {
    await db.query(
      "UPDATE blog_posts SET title = $1, summary = $2, main_content = $3 WHERE blog_id = $4;",
      [title, summary, content, id]
    );
    res.json({ message: "Successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to update blog post." });
  }
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  console.log("DELETE hit for ID:", req.params.id);

  try {
    await db.query("DELETE FROM blog_posts WHERE blog_id = $1", [id]);

    res.json({ message: "Successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete" });
  }
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).send('404 Page Not Found' );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
