import { BlogLikes } from "src/blog-likes/models/blogLikes.interface";
import { BlogEntry } from "src/blog/models/blog-entry.interface";

export enum UserRole {
    ADMIN = "admin",
    CHIEFEDITOR = "chiefeditor",
    EDITOR = "editor",
    user = "user"
}

export interface User {
    id?: number;
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    profileImage?: string;
    blogEntries?: BlogEntry[];
    blogLikes?: BlogLikes[]
}