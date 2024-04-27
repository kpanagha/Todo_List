const router = require("express").Router();
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashpassword = bcrypt.hashSync(password);
    const user = new User({ username, email, password: hashpassword });
    await user
      .save()
      // .then(() => res.status(200).json({ message: "User added" }));
      .then((savedUser) =>
        res.status(200).json({ message: "User added", _id: savedUser._id })
      );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "User already exists" });
  }
});
router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "Incorrect password. Please try again." });
    }

    const { password, ...others } = user._doc;
    return res.status(200).json({message:"user found",others});

  } catch (error) {

    return res.status(500).json({
      message:
        "An error occurred during the sign-in process. Please try again later.",
    });
  }
});
module.exports = router;
