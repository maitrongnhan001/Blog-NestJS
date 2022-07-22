import { BlogEntryEntity } from "src/blog/models/blog-entry.entity";
import { CommentLikesEntity } from "src/comment-likes/models/commentLikes.entity";
import { UserEntity } from "src/user/models/user.entity";
import { BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CommentsEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    body: string;

    @Column({default: 0})
    like: number;

    @Column({default: 0})
    disLikes: number;

    @ManyToOne(
        type => UserEntity, 
        user => user.id
    )
    author: UserEntity;

    @ManyToOne(
        type => BlogEntryEntity, 
        blogEntryEntity => blogEntryEntity.id
    )
    blog: BlogEntryEntity;

    @OneToMany(
        type => CommentLikesEntity,
        commentLikesEntity => commentLikesEntity.id
    )
    commentLikes: CommentLikesEntity[];

    @Column({nullable: true})
    replied: number;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updated: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updated = new Date();
    }

}