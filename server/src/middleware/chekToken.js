
import { verifyAccessToken } from "../utils/jwt.js";
export const checkToken = async(req, res, next) => {
    
    const token = req.cookies?.token
  
    if (!token) {
        return next({ message: "No token provided", status: 401 });
    }
    try {
        const user =  verifyAccessToken(token);
        req.user = user; // Attach user info to request
        next();
    } catch (err) {
        if (err?.name === "TokenExpiredError") {
            return next({ message: "Token expired", status: 401 });
        }
        return next({ message: "Invalid token", status: 403 });
    }
}

