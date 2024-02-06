const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");

const SECRET_KEY = "NOTESAPI";

const generateToken = (user) => {
  return jwt.sign({ email: user.email, id: user._id }, SECRET_KEY);
};

const sendLogoutMessage = (newLoginDetected) => {
  if (newLoginDetected) {
    return {
      message: "New login detected. You are logged out from other sessions.",
    };
  }
  return null;
};

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userModel.create({
      email: email,
      password: hashedPassword,
      username: username,
      session: Math.random().toString(36).substring(7),
    });

    const token = generateToken(result);

    // Set the token as a cookie
    res.cookie("token", token);

    res
      .status(201)
      .json({ user: result, token: token, newLoginDetected: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const matchedPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!matchedPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Check if it's a new login
    const newLoginDetected = existingUser.session !== req.cookies.session;

    // Update the session identifier on each login
    existingUser.session = Math.random().toString(36).substring(7);
    await existingUser.save();

    const token = generateToken(existingUser);

    // Set the token and session as cookies
    res.cookie("token", token);
    res.cookie("session", existingUser.session);

    res.status(201).json({
      user: existingUser,
      token: token,
      newLoginDetected: newLoginDetected,
      logoutMessage: sendLogoutMessage(newLoginDetected),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { signin, signup };
