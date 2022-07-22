import { BlogLikes } from "src/blog-likes/models/blogLikes.interface";
import { Comments } from "src/comments/models/comments.interface";
import { User } from "src/user/models/user.interface";

export interface BlogEntry {
    id?: number;
    title?: string;
    slug?: string;
    description?: string;
    body?: string;
    createdAt?: Date;
    updatedAt?: Date;
    likes?: number;
    comments?: number
    author?: User;
    headerImage?: string;
    publishedDate?: Date;
    isPublished?: boolean;
    blogLikes?: BlogLikes[];
    blogComments?: Comments[];
}