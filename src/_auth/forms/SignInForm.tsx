

import { z } from "zod"
import { Button } from '@/components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signInSchema } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useSignInUserAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
// import { account } from "@/lib/appwrite/config"


const SignInForm = () => {

    const { toast } = useToast()
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext()
    const navigate = useNavigate()

    const { mutateAsync: signInUser, isPending } = useSignInUserAccount()

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // const { register, handleSubmit, formState: { errors } } = form

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {

        // try {

            // try {
            //     await account.get();
            //     await account.deleteSession("current")
            // } catch (error) {
            //     // No active session or failed to check session - ignore
            // }

            const session = await signInUser({ email: data.email, password: data.password})

            if (!session) {
                console.log("Sign In failed:", session)
                return toast({
                    title: "Sign In failed. Please try again."
                })
            }

            const isLoggedIn = await checkAuthUser()

            if (isLoggedIn) {
                form.reset()
                navigate("/")
            } else {
                return toast({
                    title: "Login failed. Please try again."
                })
            }

        // } catch (error: any) {
        //     console.error("Error during sign-in:", error)
        //     toast({
        //         title: "An error occurred during sign-in.",
        //         description: error?.message || "Please try again."
        //     })
        // }

    }
    
    return (
        <div>
            <Form {...form}>
                <div className="sm:w-420 flex-center flex-col">
                    <img src="/assets/images/logo.svg" alt="logo" />
                    <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Login to your account</h2>
                    <p className="text-light-3 small-medium md:base-regular">Welcome back! Kindly enter in your details below</p>
                
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
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
                                isUserLoading ? (
                                    <div className="flex-center gap-2">
                                        <Loader />
                                        Signing In...
                                        {/* This below can be gotten from lucide-react */}
                                        {/* <Loader className="animate-spin" size={20} /> */}
                                    </div>
                                ) : (
                                    "Sign In"
                                )
                            }
                        </Button>

                        <p className="text-small-regular text-light-2 text-center mt-2">
                            Don't have an account? <Link to={"/sign-up"} className="text-primary-500 text-small-semibold ml-1">Sign Up</Link>
                        </p>
                    </form>
                </div>
            </Form>
        </div>
    )
}

export default SignInForm