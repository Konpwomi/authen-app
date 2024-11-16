import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'; 
dotenv.config();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, fullName } = req.body;
  
      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required." });
        return;
      }
  
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await prisma.user.create({
        data: { email,  password: hashedPassword, fullName }
      });
  
      res.status(201).json({ message: "User registered successfully.", user: newUser });
      return;
    } catch (error) {
      res.status(500).json({ message: "Internal server error."});
      return;
    }
  };


export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required."})
            return;
        }

        const user = await prisma.user.findUnique({ where: { email }})
        if (!user) {
            res.status(400).json({ message: "Invalid email or password"})
            return 
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid email or password"})
            return;
        }

        const token = jwt.sign({ userId: user.id, email: user.email},
            process.env.JWT_SECRET!,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        )

        res.status(200).json({ message: 'Login successful.',token, user: { id: user.id, email: user.email, fullName: user.fullName }})

        return
    } catch (error) { 
        res.status(500).json({ message: "Internal server error."});
        return
    }
}


export const dashboardUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userInfo = req.user; // Access the decoded payload from the middleware
        console.log("Authenticated User:", userInfo);

        const user = await prisma.user.findMany();
        res.status(200).json({ message: "Access granted", user });
        return;
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token." });
        return;
    }
};
