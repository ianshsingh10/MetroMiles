const captainModel = require("../models/captain.model");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerCaptain = async (req, res) => {
  try {
    const { fullName, email, password, vehicle } = req.body;

    if (!fullName || !email || !password || !vehicle) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if captain already exists
    const existingCaptain = await captainModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingCaptain) {
      return res.status(400).json({ message: "Captain already exists" });
    } else {
      // Hash the password
      const hashedPassword = await captainModel.hashPassword(password);

      // Create a new captain
      const captain = await captainModel.create({
        fullName: {
          firstName: fullName.firstName,
          lastName: fullName.lastName,
        },
        email: email.toLowerCase(),
        password: hashedPassword,
        vehicle: {
          color: vehicle.color,
          plate: vehicle.plate,
          capacity: vehicle.capacity,
          type: vehicle.type,
        },
      });

      // Generate auth token
      const token = captain.generateAuthToken();

      return res.status(200).json({
        message: "Captain registered successfully",
        captain: {
          id: captain._id,
          fullname: captain.fullName,
          email: captain.email,
          vehicle: captain.vehicle,
        },
        token,
      });
    }
  } catch (error) {
    console.error("Error registering captain:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.loginCaptain = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find the captain by email
    const captain = await captainModel
      .findOne({ email: email.toLowerCase() })
      .select("+password");

    if (!captain) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check the password
    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate auth token
    const token = captain.generateAuthToken();
    res.cookie("token", token);

    return res.status(200).json({
      message: "Login successful",
      captain: {
        id: captain._id,
        fullname: captain.fullName,
        email: captain.email,
        vehicle: captain.vehicle,
      },
      token,
    });
  } catch (error) {
    console.error("Error logging in captain:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.logoutCaptain = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token is missing" });
    }

    // Add token to blacklist
    await blacklistTokenModel.create({ token });

    // Clear the cookie
    res.clearCookie("token");

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
