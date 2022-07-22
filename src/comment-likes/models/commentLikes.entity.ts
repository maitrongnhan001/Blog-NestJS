import { CommentsEntity } from "src/comments/models/comments.entity";
import { UserEntity } from "src/user/models/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CommentLikesEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        type => UserEntity,
        userEntity => userEntity.id    
    )
    user: UserEntity;

    @ManyToOne(
        type => CommentsEntity,
        commentEntity => commentEntity.id
    )
    comment: CommentsEntity;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    created: Date;

}