import { UserPayload } from "./src/auth/types"

declare global {
  namespace Express {
    interface Request {
        currentUser?: UserPayload 
 }
}
} 