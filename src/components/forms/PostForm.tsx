// import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {z} from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import FileUploader from "../shared/FileUploader"

// npm i shad@latest textarea


const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    })
})


const PostForm = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
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
                            <FileUploader />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                    </FormItem>
                )} />
                <FormField control={form.control} name="location" render={({field}) => (
                    <FormItem>
                        <FormLabel className="shad-form_label">Add Location</FormLabel>
                        <FormControl>
                            <Input type="text" className="shad-input" />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                    </FormItem>
                )} />
                <FormField control={form.control} name="tags" render={({field}) => (
                    <FormItem>
                        <FormLabel className="shad-form_label">Add Tags (separated by comma " , ")</FormLabel>
                        <FormControl>
                            <Input type="text" className="shad-input" placeholder="Art, Expression, Learn" />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                    </FormItem>
                )} />

                <div className="flex items-center gap-4 justify-end">
                    <Button type="button" className="shad-button_dark_4">Cancel</Button>
                    <Button type="submit" className="shad-button_primary whitespace-nowrap">Submit</Button>
                </div>
            </form>
        </Form>
    )
}

export default PostForm