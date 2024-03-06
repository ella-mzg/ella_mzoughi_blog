import {
  deleteResource,
  readResource,
  updateResource
} from "@/web/services/apiClient"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/router"

export const useReadPost = (postId) => {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => readResource(["posts", postId]),
    enabled: Boolean(postId),
    initialData: () => ({ data: { result: [{}] } })
  })

  return {
    post: data?.data?.result?.[0] || {},
    isLoading,
    isError,
    error
  }
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: ({ postId, newData }) =>
      updateResource(["posts", postId], newData),
    onMutate: async ({ postId, newData }) => {
      await queryClient.cancelQueries(["post", postId])
      const previousPost = queryClient.getQueryData(["post", postId])

      queryClient.setQueryData(["post", postId], (oldQueryData) => ({
        ...oldQueryData,
        data: {
          ...oldQueryData.data,
          result: [{ ...oldQueryData.data.result[0], ...newData }]
        }
      }))

      return { previousPost }
    },
    onError: (err, { postId }, context) => {
      queryClient.setQueryData(["post", postId], context.previousPost)
    },
    onSettled: ({ postId }) => {
      queryClient.invalidateQueries(["post", postId])
      router.push(`/posts/${postId}`)
    }
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

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
    onSettled: () => {
      queryClient.invalidateQueries(["posts"])
      router.push("/")
    }
  })
}