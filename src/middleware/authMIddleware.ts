import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({ message: "Authorization header is missing" });
            return;
        }
        const token = authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "Access denied. No token provided." });
            console.log(token)
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!)  as { userId: string; email: string };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};
