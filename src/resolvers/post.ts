import { Post } from "../entities/Post"
import { MyContex } from "../MyContex"
import {Resolver,Query, Ctx, Arg, Int, Mutation} from "type-graphql"

@Resolver()
export class PostResolver {
    @Query(()=> [Post])
    posts( @Ctx() {em}:MyContex ): Promise<Post[]>
    {
    return em.find(Post,{})
    }

    @Query(()=>Post,{ nullable : true})
    post(
        @Arg("id",()=> Int) id: number,
        @Ctx() {em}:MyContex
    ):Promise<Post | null>
    {
        return em.findOne(Post,{id})
    }

    @Mutation(()=> Post)
    async createPost(
        @Arg("title") title: string,
        @Ctx() { em }: MyContex
    ) : Promise<Post> {
        const post = em.create(Post,{title})
        await em.persistAndFlush(post)
        return post
    }

    @Mutation(()=> Post, { nullable:true})
    async updatePost(
        @Arg("id") id: number,
        @Arg("title" , ()=> String , { nullable: true}) title: string,
        @Ctx() { em }: MyContex
    ) : Promise<Post | null> {
        const post = await em.findOne(Post , {id})
        if(!post)
        {
            return null
        }
        if(typeof title !== "undefined")
        {
            post.title = title
            await em.persistAndFlush(post)   
        }
        return post
    }

    @Mutation(()=> Boolean)
    async deletePost(
        @Arg("id") id: number,
        @Ctx() { em }: MyContex
    ) : Promise<Boolean> {
        const post = await em.findOne(Post , {id})
        if(post)
        {
            await em.nativeDelete(Post , {id})
            return true
        }
        return false
    }
}