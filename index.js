import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let blogs = [];

// Helper function to find blog by ID
const findBlog = (id) => blogs.find(b => b.id === parseInt(id));
const findBlogIndex = (id) => blogs.findIndex(b => b.id === parseInt(id));

app.get("/", (req, res) => res.render("index.ejs", { blogs }));

app.get("/blog/:id", (req, res) => {
    const blog = findBlog(req.params.id);
    blog ? res.render("blog.ejs", { blog }) : res.status(404).render("404.ejs", { message: "Blog not found" });
});

app.post("/create-new-blog", (req, res) => {
    blogs.push({
        id: blogs.length + 1,
        title: req.body.title,
        content: req.body.content,
        date: new Date().toLocaleDateString()
    });
    res.redirect("/");
});

app.get("/edit-blog/:id", (req, res) => {
    const blog = findBlog(req.params.id);
    blog ? res.render("edit-blog.ejs", { blog }) : res.status(404).send("Blog not found");
});

app.post("/blog/:id/update", (req, res) => {
    const blogIndex = findBlogIndex(req.params.id);
    if (blogIndex === -1) return res.status(404).send("Blog not found");
    
    blogs[blogIndex] = {
        ...blogs[blogIndex],
        title: req.body.title,
        content: req.body.content
    };
    res.redirect(`/blog/${req.params.id}`);
});

app.post("/blog/:id/delete", (req, res) => {
    const blogIndex = findBlogIndex(req.params.id);
    if (blogIndex === -1) return res.status(404).send("Blog not found");
    
    blogs.splice(blogIndex, 1);
    res.render("index.ejs", { blogs });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));