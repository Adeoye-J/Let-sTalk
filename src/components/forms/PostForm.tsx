// import React from 'react'
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {z} from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import FileUploader from "../shared/FileUploader"
import { postValidationSchema } from "@/lib/validation"
import type { Models } from "appwrite"
import { useUserContext } from "@/context/AuthContext"
import { toast } from "@/hooks/use-toast"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations"
import Loader from "../shared/Loader"
import { updatePost } from "@/lib/appwrite/api"
// npm i shad@latest textarea

type PostFormProps = {
    post?: Models.Document;
    action: "Create" | "Update"
}

const PostForm = ({ post, action }: PostFormProps) => {

    const { mutateAsync: createPost, isPending: isCreatingPost } = useCreatePost()
    const { mutateAsync: updatePost, isPending: isUpdatingPost } = useUpdatePost()
    const { user } = useUserContext()
    const navigate = useNavigate()

    const form = useForm<z.infer<typeof postValidationSchema>>({
        resolver: zodResolver(postValidationSchema),
        defaultValues: {
            caption: post ? post?.caption : "",
            file: [],
            location: post ? post?.location : "",
            tags: post ? post.tags.join(",") : ""
        }
    })

    async function onSubmit(values: z.infer<typeof postValidationSchema>) {
        
        if (post && action === "Update") {
            const updatedPost = await updatePost({
                ...values,
                postId: post.$id,
                imageId: post?.imageId,
                imageUrl: post?.imageUrl,
            })

            if (!updatedPost) {
                toast({
                    title: "Please try again!"
                })
            }

            return navigate(`/posts/${post.$id}`)
        }

        const newPost = await createPost({...values, userId: user.id})

        if(!newPost) {
            return toast({
                title: "Unable to create post. Please try again",
            })
        }

        navigate("/")
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                <FormField control={form.control} name="caption" render={({field}) => (
                    <FormItem>
                        <FormLabel className="shad-form_label">Caption</FormLabel>
                        <FormControl>
                            <Textarea className="shad-textarea custom-scrollbar" placeholder="shadcn" {...field} />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                    </FormItem>
                )} />
                <FormField control={form.control} name="file" render={({field}) => (
                    <FormItem>
                        <FormLabel className="shad-form_label">Add Photos</FormLabel>
                        <FormControl>
                            <FileUploader 
                                fieldChange={field.onChange}
                                mediaUrl={post?.imageUrl}
                            />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                    </FormItem>
                )} />
                <FormField control={form.control} name="location" render={({field}) => (
                    <FormItem>
                        <FormLabel className="shad-form_label">Add Location</FormLabel>
                        <FormControl>
                            <Input type="text" className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                    </FormItem>
                )} />
                <FormField control={form.control} name="tags" render={({field}) => (
                    <FormItem>
                        <FormLabel className="shad-form_label">Add Tags (separated by comma " , ")</FormLabel>
                        <FormControl>
                            <Input type="text" className="shad-input" placeholder="Art, Expression, Learn" {...field} />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                    </FormItem>
                )} />

                <div className="flex items-center gap-4 justify-end">
                    <Button type="button" className="shad-button_dark_4" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isCreatingPost || isUpdatingPost}>
                        {
                            (isCreatingPost || isUpdatingPost) ? (
                                <div className="flex-center gap-2">
                                    <Loader />
                                    {isUpdatingPost ? "Updating Post..." : "Creating Post..."}
                                    
                                    {/* This below can be gotten from lucide-react */}
                                    {/* <Loader className="animate-spin" size={20} /> */}
                                </div>
                            ) : (   
                                action
                            )
                        }
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default PostForm