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
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries(["user", userId])
    }
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId) => deleteResource(["users", userId]),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"])
    }
  })
}

export const useToggleUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, isDisabled }) =>
      updateResource(["users", userId], { isDisabled: !isDisabled }),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries(["user", userId])
      queryClient.invalidateQueries(["users"])
    }
  })
}
