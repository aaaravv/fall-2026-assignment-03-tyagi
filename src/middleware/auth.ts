import { Request, Response, NextFunction } from 'express';


export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // TODO: Student implementation - Part 1: Authentication Middleware
  
  if(req.method !== "POST" && req.method !== "PATCH"){
    return next();
  }
  
  let userId = req.header("X-User-Id");

  if(!userId || isNaN(Number(userId))){
     res.status(401).json({error: "401 Unauthorized"});
     return;
  }
  
  // Store the authenticated userId on res.locals.userId

  res.locals.userId = userId;
  next();
}

export default authMiddleware;
