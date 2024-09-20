const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel, TodoModel } = require("./db");
const { JWT_SECRET } = require("./secret");
const { z, string } = require("zod");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const requiredBody = z.object({
    name: z.string().min(3).max(30),
    email: z.string().email().min(5).max(30),
    password: z.string().min(9).max(20),
  });

  const { success, error } = requiredBody.safeParse(req.body);

  if (!success) {
    res.json({
      message: "Incorrect format",
      error: error,
    });
    return;
  }

  const { name, email, password } = req.body;

  let hasError = false;
  try {
    const hashedPassword = await bcrypt.hash(password, 5);

    await UserModel.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
  } catch (error) {
    res.status(403).json({
      message: "User with email exists",
    });
    hasError = true;
  }

  if (!hasError)
    res.status(200).json({
      message: "You are signed up successfully",
    });
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const getUser = await UserModel.findOne({
    email: email,
  });

  if (!getUser)
    res.status(403).json({
      message: "No user with this email found",
    });

  const correctPassword = await bcrypt.compare(password, getUser.password); //convert password to hashed pass and compare to passowrd in db

  if (correctPassword) {
    const token = jwt.sign(
      {
        id: getUser._id.toString(),
      },
      JWT_SECRET
    );
    res.status(200).json({
      token: token,
    });
  } else {
    res.status(403).json({
      mesage: "Incorrect credentials",
    });
  }
});

app.post("/todo", (req, res) => {});

app.get("/todos", (req, res) => {});

app.delete("/todo", (req, res) => {});

app.listen(3000, () => {
  console.log("Server is running");
});
