import { BlogEntry } from "src/blog/models/blog-entry.interface";
import { User } from "src/user/models/user.interface";

export interface BlogLikes {
    id?: number,
    userId?: User,
    blogId?: BlogEntry,
    created?: Date
}