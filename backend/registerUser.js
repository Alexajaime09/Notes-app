const bcrypt = require("bcrypt");
const { getDB } = require("./db");

const registerUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "The email and password are required",
      });
    }
    const db = getDB();

    const existingUser = await db
      .collection("users")
      .findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      return res.status(400).json({
        error:
          "It is not possible complete the registration with this information",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      name: name ? name.trim() : null,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);
    return res.status(201).json({
      message: "User registeres successfully",
      _id: result.insertedId,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser };
