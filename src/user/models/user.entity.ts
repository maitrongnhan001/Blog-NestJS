import { BlogLikesEntity } from "src/blog-likes/models/blogLikes.entity";
import { BlogEntryEntity } from "src/blog/models/blog-entry.entity";
import { CommentsEntity } from "src/comments/models/comments.entity";
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./user.interface";

@Entity()
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    username: string;

    @Column()
    email: string;

    @Column({select: false})
    password: string;

    @Column({type: 'enum', enum: UserRole, default: UserRole.user})
    role: UserRole;

    @Column({nullable: true})
    profileImage: string;

    @OneToMany(type => BlogEntryEntity, blogEntryEntity => blogEntryEntity.author)
    blogEntries: BlogEntryEntity[];

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

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
}