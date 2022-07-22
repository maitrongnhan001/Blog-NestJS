import { BlogLikesEntity } from "src/blog-likes/models/blogLikes.entity";
import { CommentsEntity } from "src/comments/models/comments.entity";
import { UserEntity } from "src/user/models/user.entity";
import { BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BlogEntryEntity {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    title: string;

    @Column()
    slug: string;

    @Column({default: ''})
    description: string;

    @Column({default: ''})
    body: string;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    created: Date;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    updated: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updated = new Date();
    }
    
    @Column({default: 0})
    likes: number;

    @Column({default: 0})
    comments: number;

    @ManyToOne(type => UserEntity, user => user.blogEntries)
    author: UserEntity;

    @Column({nullable: true})
    headerImage: string;

    @Column({nullable: true})
    publishedDate: Date;

    @Column({nullable: true})
    isPublished: boolean;

    @OneToMany(
        type => BlogLikesEntity,
        blogLikeEntity => blogLikeEntity.id
    )
    blogLikes: BlogLikesEntity[];

    @OneToMany(
        type => CommentsEntity,
        commentsEntity => commentsEntity.id
    )
    blogComments: CommentsEntity[];
}