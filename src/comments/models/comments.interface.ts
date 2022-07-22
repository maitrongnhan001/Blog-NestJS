import { BlogEntry } from "src/blog/models/blog-entry.interface";
import { CommentLikes } from "src/comment-likes/models/commentLikes.interface";
import { User } from "src/user/models/user.interface";

export interface Comments {
    id?: number;
    body?: string;
    like?: number;
    disLikes?: number;
    blog?: BlogEntry;
    author?: User;
    replied?: number;
    created?: Date;
    commentLikes?: CommentLikes[];
}