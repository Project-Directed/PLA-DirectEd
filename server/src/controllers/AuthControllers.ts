import { Request, Response } from "express";
import User from "../models/User";
import { loginTypes, UserTypes } from "../types/allTypes";
import bcrypt from "bcrypt";
import genTokenSetCookie from "../utils/genTokenSetCookie";

const signUp = async (req: Request, res: Response) => {
  const { full_name, phone_number, username, email, password }: UserTypes =
    req.body;

  try {
    const user = await User.create({
      full_name,
      phone_number,
      username,
      email,
      password,
    });

    if (user) {
      //gen cookie here
      const token = genTokenSetCookie(res, user);
      res.status(201).json({ user, token });
    } else {
      res.status(400).json({ error: "couldn't create user:" });
    }
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(err);
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password }: loginTypes = req.body;
  
 
  try {
    const user = await User.findOne({ email });
    if (user) {
      const passCheck = await bcrypt.compare(password, user.password);
      if (passCheck) {
        // Ensure genTokenSetCookie does not send a response
        const token = genTokenSetCookie(res, user);
        if (!res.headersSent) {
        res.status(200).json({
          message: "login successful",
            userId: user._id,
            full_name: user.full_name,
            email: user.email,
            username: user.username,
            token: token
          });
      } 
    } else {
        if (!res.headersSent) {
          res.status(400).json({ error: "invalid credentials" });
        }
      }
    } else {
      if (!res.headersSent) {
        res.status(400).json({ error: "invalid credentials" });
      }
    }
  } catch (err: any) {
    if (res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
    console.log("error occurred during login", err);
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("token", "", {
       maxAge: 0,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ message: "logged out" });
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("error occured during logout", error);
  }
};

export { signUp, login, logout };
