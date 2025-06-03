

import { z } from "zod"
import { Button } from '@/components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signUpSchema } from "@/lib/validation"
import Loader from "@/components/shared/loader"

const formSchema = z.object({
  username: z.string().min(2).max(50),
})

const SignUpForm = () => {

    const isLoading = true // Replace with actual loading state if needed

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            name: "",
            email: "",
            password: "",
        },
    })

    // const { register, handleSubmit, formState: { errors } } = form

    const onSubmit = (data: z.infer<typeof signUpSchema>) => {
        console.log(data)
    }


    // // 1. Define your form.
    // const form = useForm<z.infer<typeof formSchema>>({
    //     resolver: zodResolver(formSchema),
    //     defaultValues: {
    //         username: "",
    //     },
    // })
    
    // // 2. Define a submit handler.
    // function onSubmit(values: z.infer<typeof formSchema>) {
    //     // Do something with the form values.
    //     // ✅ This will be type-safe and validated.
    //     console.log(values)
    // }
    
    return (
        <div>
            <Form {...form}>
                <div className="sm:w-420 flex-center flex-col">
                    <img src="/assets/images/logo.svg" alt="logo" />
                    <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
                    <p className="text-light-3 small-medium md:base-regular">Sign up to start using Let'sTalk</p>
                
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="shad-input" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="shad-input" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" className="shad-input" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" className="shad-input" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="shad-button_primary">
                            {
                                isLoading ? (
                                    <div className="">
                                        <Loader />
                                        {/* This below can be gotten from lucide-react */}
                                        {/* <Loader className="animate-spin" size={20} /> */}
                                    </div>
                                ) : (
                                    "Sign Up"
                                )
                            }
                        </Button>
                    </form>
                </div>
            </Form>
        </div>
    )
}

export default SignUpForm