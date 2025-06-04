import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery
} from "@tanstack/react-query"
import { createUser } from "../appwrite/api"
import type { NewUser } from "@/types"


export const useCreateUserAccountMutation = () => {
    return useMutation({
        mutationFn: (user: NewUser) => createUser(user)
    })
}