import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let blogs = [];

app.get("/", (req, res) => {
    res.render("index.ejs", {
        blogs: blogs
    })
});

app.get("/blog/:id", (req, res) => {
    const blogId = parseInt(req.params.id);
    const blog = blogs.find(b => b.id === blogId);
    
    if (blog) {
        res.render("blog.ejs", {
            blog: blog
        });
    } else {
        res.status(404).send("Blog not found");
        res.send('<a href="/">Go Back</a>');
    }
});

app.post("/create-new-blog", (req, res) => {
    const blog = {
        id: blogs.length + 1,
        title: req.body.title,
        content: req.body.content,
        date: new Date().toLocaleDateString()
    };
    blogs.push(blog);
    res.redirect("/");
});

app.get("/edit-blog/:id", (req, res) => {
    const blogId = parseInt(req.params.id);
    const blog = blogs.find(b => b.id === blogId);
    
    if (blog) {
        res.render("edit-blog.ejs", {
            blog: blog
        });
    } else {
        res.status(404).send("Blog not found");
    }
});

app.post("/blog/:id/update", (req, res) => {
  
    const blogId = parseInt(req.params.id);
    const blogIndex = blogs.findIndex(b => b.id === blogId);
    
    if (blogIndex === -1) {
      console.log('Blog not found with ID:', blogId);
      return res.status(404).send("Blog not found");
    }

    blogs[blogIndex] = {
      id: blogId,
      title: req.body.title,
      content: req.body.content,
      date: blogs[blogIndex].date
    };
    res.redirect(`/blog/${blogId}`);

});

app.post("/blog/:id/delete", (req, res) => {
    const blogId = parseInt(req.params.id);
    const blogIndex = blogs.findIndex(b => b.id ===blogId);
    if(blogIndex === -1){
        return res.status(404).send("Blog not found");
    }
    blogs.splice(blogIndex, 1);
    res.render("index.ejs", {
        blogs: blogs
    })
});

app.listen(port, () =>{
    console.log(`Server listening on port http://localhost:${port}`)
})