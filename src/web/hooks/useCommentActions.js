import {
  createResource,
  deleteResource,
  readResource,
  updateResource
} from "@/web/services/apiClient"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useReadComment = (commentId) =>
  useQuery({
    queryKey: ["comment", commentId],
    queryFn: () => readResource(["comments", commentId]),
    enabled: Boolean(commentId)
  })

export const useCreateComment = (postId) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ content, userId }) =>
      createResource(["comments"], { postId, content, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["post", postId])
    }
  })
}

export const useUpdateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, newData }) =>
      updateResource(["comments", commentId], newData),
    onSuccess: (_, { commentId }) => {
      queryClient.invalidateQueries(["comment", commentId])
    }
  })
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId) => deleteResource(["comments", commentId]),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"])
    }
  })
}
