const userModel = require("../models/user.model");
const { validationResult } = require("express-validator");

module.exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    if(!firstName || !email || !password) {
        throw new Error("All fields are required");
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    };

    // Check if user already exists
    const existingUser = await userModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }   
    else {  
      // Hash the password
      const hashedPassword = await userModel.hashPassword(password);
      
      // Create a new user
      const user = await userModel.create({
        fullName: {
          firstName,
          lastName,
        },
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      // Generate auth token
      const token = user.generateAuthToken();

      return res.status(200).json({
        message: "User registered successfully",
        user: {
          id: user._id,
          fullname: user.fullName,
          email: user.email,
        },
        token,
      });
    }
}
    catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};