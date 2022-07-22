import { BlogEntry } from "src/blog/models/blog-entry.interface";
import { User } from "src/user/models/user.interface";

export interface Comments {
    id?: number;
    body?: string;
    likes?: number;
    disLikes?: number;
    blog?: BlogEntry;
    author?: User;
    replied?: number;
    created?: Date;
}