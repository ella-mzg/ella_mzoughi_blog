import {
  deleteResource,
  readResource,
  updateResource
} from "@/web/services/apiClient"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useReadPost = (postId) =>
  useQuery({
    queryKey: ["post", postId],
    queryFn: () => readResource(["posts", postId]),
    enabled: Boolean(postId)
  })

export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, newData }) =>
      updateResource(["posts", postId], newData),

    onMutate: async ({ postId, newData }) => {
      await queryClient.cancelQueries(["post", postId])
      const previousPostData = queryClient.getQueryData(["post", postId])

      queryClient.setQueryData(["post", postId], (oldData) => ({
        ...oldData,
        data: {
          ...oldData.data,
          ...newData
        }
      }))

      return { previousPostData, postId }
    },

    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries(["post", postId])
    }
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId) => deleteResource(["posts", postId]),
    onMutate: async (postId) => {
      await queryClient.cancelQueries(["post", postId])
      const previousPost = queryClient.getQueryData(["post", postId])
      queryClient.removeQueries(["post", postId])

      return { previousPost }
    },
    onError: (err, postId, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"])
    }
  })
}
