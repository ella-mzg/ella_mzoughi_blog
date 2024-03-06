import { deleteResource, updateResource } from "@/web/services/apiClient"
import { useMutation, useQueryClient } from "@tanstack/react-query"

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
