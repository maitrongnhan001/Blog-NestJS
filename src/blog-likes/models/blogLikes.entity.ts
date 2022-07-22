import { BlogEntryEntity } from "src/blog/models/blog-entry.entity";
import { UserEntity } from "src/user/models/user.entity";
import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class BlogLikesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne( 
        type => UserEntity,
        userEntity => userEntity.id
    )
    userId: UserEntity;

    @ManyToOne(
        type => BlogEntryEntity,
        blogEntryEntity => blogEntryEntity.id
    )
    blogId: BlogEntryEntity;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created: Date;
}