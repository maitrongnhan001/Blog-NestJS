import { Comments } from "src/comments/models/comments.interface";
import { User } from "src/user/models/user.interface";

export interface CommentLikes {
    id?: number;
    user?: User;
    comment?: Comments;
    created?: Date;
}