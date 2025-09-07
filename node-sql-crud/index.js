const express = require("express");
const bodyParser = require("body-parser");
const User = require("./models/User");
const sequelize = require("./db");
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true })); // for form data
app.use(bodyParser.json()); // for JSON data/ Sync DB
sequelize.sync().then(() => console.log("Database synced"));
app.get("/form", (req, res) => {
    // res.render("form");
    res.render("form", { user: null }); // user null for create

  });
// Handle form submission (CREATE)
app.post("/create-user", async (req, res) => {
    try {
      const { name, email, age } = req.body;
      console.log(req.body);
      const user = await User.create({ name, email, age });
      res.redirect("/users"); // Redirect to users list

    //   res.send(`<h2>User Created!</h2><p>${user.name} (${user.email})</p><a href="/form">Create Another</a>`);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });  
// CREATE user
// app.post("/users", async (req, res) => {
//   try {
//     const user = await User.create(req.body);
//     res.status(201).json(user);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// READ all users
// app.get("/users", async (req, res) => {
//   try {
//     const users = await User.findAll();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// app.get("/users", async (req, res) => {
//     try {
//       const users = await User.findAll();
//       res.render("users", { users }); // Render EJS template
//     } catch (err) {
//       res.status(500).send(err.message);
//     }
//   });
app.get("/users", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;  // Current page
    const limit = 3;                             // Users per page
    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      limit,
      offset,
      order: [["id", "ASC"]],
    });

    const totalPages = Math.ceil(count / limit);

    res.render("users", {
      users,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// // READ single user
// app.get("/users/:id", async (req, res) => {
//   try {
//     const user = await User.findByPk(req.params.id);
//     if (!user) return res.status(404).json({ error: "User not found" });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // UPDATE user
// app.put("/users/:id", async (req, res) => {
//   try {
//     const user = await User.findByPk(req.params.id);
//     if (!user) return res.status(404).json({ error: "User not found" });
//     await user.update(req.body);
//     res.json(user);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });
// Show edit form for specific user
app.get("/edit-user/:id", async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).send("User not found");
      res.render("form", { user });
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  app.post("/update-user/:id", async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).send("User not found");
  
      const { name, email, age } = req.body;
      await user.update({ name, email, age });
  
      res.redirect("/users"); // Go back to users table
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
  
// DELETE user
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    await user.destroy();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/", (req, res) => {
    res.redirect("/users");
});

// Start server
app.listen(3000, () => console.log("Server1 running on port 3000"));
