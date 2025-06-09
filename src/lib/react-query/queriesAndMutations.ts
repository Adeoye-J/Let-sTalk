import { useQuery, useMutation, useQueryClient, useInfiniteQuery
} from "@tanstack/react-query"
import { createUser, signInUser, signOutUser } from "../appwrite/api"
import type { NewUser } from "@/types"


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