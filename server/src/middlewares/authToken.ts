import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import User from "../models/User";
import { IUser } from "../types/modelTypes/UserType";

// Extend the Request interface to include the user property
interface AuthRequested extends Request {
  user?: IUser;
}

// Middleware to check if user is authenticated
const authenticateToken = async (
  req: AuthRequested,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  // Check for token in Authorization header
  const authHeader = req.body.token;
  console.log(authHeader)
  if (authHeader && authHeader) {
    token = authHeader;
  }

  // If not in header, check in cookies
  // if (!token) {
  //   token = req.cookies.token;
  // }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, config.jwt.secret) as { id: string };
    
    // Find the user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the user to the request
    req.user = user;
    next();
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    console.error("Authentication error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { authenticateToken, AuthRequested };