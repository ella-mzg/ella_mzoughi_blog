import {
  createResource,
  deleteResource,
  updateResource
} from "@/web/services/apiClient"
import { useMutation, useQueryClient } from "@tanstack/react-query"

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

export const useUpdateComment = (postId) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, content }) =>
      updateResource(["comments", commentId], { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(["post", postId])
    }
  })
}

export const useDeleteComment = (postId) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId) => deleteResource(["comments", commentId]),
    onSuccess: () => {
      queryClient.invalidateQueries(["post", postId])
    }
  })
}
