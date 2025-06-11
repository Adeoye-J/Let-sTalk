import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { createPost, createUser, signInUser, signOutUser } from "../appwrite/api"
import type { NewPost, NewUser } from "@/types"
import { QUERY_KEYS } from "./queryKeys"


export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: NewUser) => createUser(user)
    })
}

export const useSignInUserAccount = () => {
    return useMutation({
        mutationFn: (user: {email: string; password: string}) => signInUser(user)
    })
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutUser
    })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (post: NewPost) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}