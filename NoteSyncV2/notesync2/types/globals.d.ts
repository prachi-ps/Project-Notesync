import { User } from "./types";

export {}

declare global {
    interface CustomJwtSessionClaim extends User{}
}