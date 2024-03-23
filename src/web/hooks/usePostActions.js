import {
  createResource,
  deleteResource,
  readResource,
  updateResource
} from "@/web/services/apiClient"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

export const useReadPost = (postId) =>
  useQuery({
    queryKey: ["post", postId],
    queryFn: () => readResource(["posts", postId]),
    enabled: Boolean(postId)
  })

export const useReadPostsByUserId = (userId) =>
  useQuery({
    queryKey: ["userPosts", userId],
    queryFn: async () => {
      const params = { params: { userId } }
      const response = await readResource(["posts"], params)

      return response.data.result
    },
    enabled: Boolean(userId)
  })

export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, newData }) =>
      updateResource(["posts", postId], newData),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries(["post", postId])
    }
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId) => deleteResource(["posts", postId]),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"])
    }
  })
}

export const useIncrementViewCount = (postId, userId) => {
  useEffect(() => {
    const viewKey = `viewed-${postId}-${userId}`

    if (postId && !sessionStorage.getItem(viewKey)) {
      sessionStorage.setItem(viewKey, "true")

      setTimeout(() => {
        createResource(["posts", postId, "views"], {})
      }, 500)
    }
  }, [postId, userId])
}
