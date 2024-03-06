import {
  deleteResource,
  readResource,
  updateResource
} from "@/web/services/apiClient"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/router"

export const useReadUser = (userId) =>
  useQuery({
    queryKey: ["user", userId],
    queryFn: () => readResource(["users", userId]),
    enabled: Boolean(userId),
    initialData: { data: { result: [{}] } }
  })

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: ({ userId, newData }) =>
      updateResource(["users", userId], newData),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"])
      router.back()
    }
  })
}

export const useToggleUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (user) =>
      updateResource(["users", user.id], {
        ...user,
        isDisabled: !user.isDisabled
      }),

    onMutate: async (toggledUser) => {
      await queryClient.cancelQueries(["users"])
      const previousUsers = queryClient.getQueryData(["users"])

      queryClient.setQueryData(["users"], (oldQueryData) =>
        oldQueryData?.map((user) =>
          user.id === toggledUser.id
            ? { ...user, isDisabled: !user.isDisabled }
            : user
        )
      )

      return { previousUsers }
    },

    onError: (err, context) => {
      queryClient.setQueryData(["users"], context.previousUsers)
    },

    onSettled: () => {
      queryClient.invalidateQueries(["users"])
    }
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId) => deleteResource(["users", userId]),

    onMutate: async () => {
      await queryClient.cancelQueries(["users"])
      const previousUsers = queryClient.getQueryData(["users"])

      return { previousUsers }
    },

    onError: (err, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries(["users"])
    }
  })
}
