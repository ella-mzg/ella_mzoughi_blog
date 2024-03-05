import { readResource } from "@/web/services/apiClient"
import { useQuery } from "@tanstack/react-query"

export const usePostData = (postId) => {
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
