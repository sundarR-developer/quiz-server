import User from '../models/userSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Middleware for verifying the user
export async function verifyUser(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ error: "Authentication Failed!" });
    }
}

// Middleware to set up local variables for OTP
export function localVariables(req, res, next) {
    req.app.locals = {
        OTP: null,
        resetSession: false
    };
    next();
}

// Register a new user
export async function register(req, res) {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Login a user
export async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: "Username not found" });
        }
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(400).send({ error: "Password does not Match" });
        }
        const token = jwt.sign({
            userId: user._id,
            username: user.username,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: "24h" });
        return res.status(200).send({
            msg: "Login Successful...!",
            username: user.username,
            role: user.role,
            token
        });
    } catch (error) {
        return res.status(500).send({ error });
    }
}

// Get user by username
export async function getUser(req, res) {
    const { username } = req.params;
    try {
        if (!username) return res.status(501).send({ error: "Invalid Username" });
        const user = await User.findOne({ username }).select('-password');
        if (!user) return res.status(404).send({ error: "Couldn't Find the User" });
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({ error: "Cannot Find User Data" });
    }
}

// Generate and send OTP
export async function generateOTP(req, res) {
    req.app.locals.OTP = Math.floor(100000 + Math.random() * 900000).toString();
    res.status(201).send({ code: req.app.locals.OTP });
}

// Verify generated OTP
export async function verifyOTP(req, res) {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null;
        req.app.locals.resetSession = true;
        return res.status(201).send({ msg: 'Verify Successsfully!' });
    }
    return res.status(400).send({ error: "Invalid OTP" });
}

// Create session for password reset
export async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        return res.status(201).send({ flag: req.app.locals.resetSession });
    }
    return res.status(440).send({ error: "Session expired!" });
}

// Update user profile
export async function updateUser(req, res) {
    try {
        const { userId } = req.user;
        if (userId) {
            const body = req.body;
            await User.updateOne({ _id: userId }, body);
            return res.status(201).send({ msg: "Record Updated...!" });
        } else {
            return res.status(401).send({ error: "User Not Found...!" });
        }
    } catch (error) {
        return res.status(500).send({ error });
    }
}

// Reset password
export async function resetPassword(req, res) {
    try {
        if (!req.app.locals.resetSession) return res.status(440).send({ error: "Session expired!" });
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send({ error: "Username not Found" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.updateOne({ username: user.username }, { password: hashedPassword });
        req.app.locals.resetSession = false;
        return res.status(201).send({ msg: "Record Updated...!" });
    } catch (error) {
        return res.status(500).send({ error });
    }
}
