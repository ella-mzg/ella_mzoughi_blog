import { readResource } from "@/web/services/apiClient"
import { useQuery } from "@tanstack/react-query"

export const useUserPostCount = (userId) =>
  useQuery({
    queryKey: ["userPostCount", userId],
    queryFn: async () => {
      const response = await readResource(
        `stats?userId=${userId}&type=postCount`
      )

      return response.data
    },
    enabled: Boolean(userId)
  })

export const useUserCommentCount = (userId) =>
  useQuery({
    queryKey: ["userCommentCount", userId],
    queryFn: async () => {
      const response = await readResource(
        `stats?userId=${userId}&type=commentCount`
      )

      return response.data
    },
    enabled: Boolean(userId)
  })

export const useUserViewCount = (userId) =>
  useQuery({
    queryKey: ["userViewCount", userId],
    queryFn: async () => {
      const response = await readResource(
        `stats?userId=${userId}&type=viewCount`
      )

      return response.data
    },
    enabled: Boolean(userId)
  })
