import {
  deleteResource,
  readResource,
  updateResource
} from "@/web/services/apiClient"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useReadUser = (userId) =>
  useQuery({
    queryKey: ["user", userId],
    queryFn: () => readResource(["users", userId]),
    enabled: Boolean(userId)
  })

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, newData }) =>
      updateResource(["users", userId], newData),

    onMutate: async ({ userId, newData }) => {
      await queryClient.cancelQueries(["user", userId])
      const previousUserData = queryClient.getQueryData(["user", userId])

      queryClient.setQueryData(["user", userId], (oldData) => ({
        ...oldData,
        data: {
          ...oldData.data,
          ...newData
        }
      }))

      return { previousUserData, userId }
    },

    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries(["user", userId])
    }
  })
}

export const useToggleUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    // MutationFn: (user) =>
    //   updateResource(["users", user.id], {
    //     ...user,
    //     isDisabled: !user.isDisabled
    //   }),
    mutationFn: (user) => {
      const payload = {
        ...user,
        isDisabled: !user.isDisabled
      }
      // eslint-disable-next-line no-console
      console.log("Payload:", payload)

      return updateResource(["users", user.id], payload)
    },

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
    onSuccess: () => {
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
    onSuccess: () => {
      queryClient.invalidateQueries(["users"])
    }
  })
}
