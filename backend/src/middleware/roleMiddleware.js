import { model } from "mongoose";

// middleware/checkRole.js
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        // checking user is authenticated
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
  
      // Check if the user's role is in the allowedRoles array
      const userRole = req.user.role;
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          error: 'Access denied. Insufficient permissions.',
        });
      }
  
      //If authorized, proceed to the next middleware or route handler
      next();
    };
  };
  
export default {checkRole}