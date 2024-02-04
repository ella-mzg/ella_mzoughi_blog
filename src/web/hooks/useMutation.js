import { deleteResource, updateResource } from "@/web/services/apiClient"
import { useMutation } from "@tanstack/react-query"

export const useUpdatePost = (postId, refetch) =>
  useMutation({
    mutationFn: (newData) => updateResource(["posts", postId], newData),
    onSuccess: () => {
      refetch()
    }
  })

export const useDeletePost = (postId) =>
  useMutation({
    mutationFn: () => deleteResource(["posts", postId])
  })
export const useToggleUser = (users, setUsers) =>
  useMutation({
    mutationFn: async (user) => {
      const updatedUser = { ...user, isDisabled: !user.isDisabled }
      const response = await updateResource(["users", user.id], updatedUser)

      return response
    },
    onError: (user, context) => {
      setUsers(
        users.map((item) =>
          item.id === user.id
            ? { ...item, isDisabled: context.oldIsDisabled }
            : item
        )
      )
    },
    onMutate: (user) => {
      const oldUser = users.find((item) => item.id === user.id)
      setUsers(
        users.map((item) =>
          item.id === user.id ? { ...item, isDisabled: !item.isDisabled } : item
        )
      )

      return { oldIsDisabled: oldUser?.isDisabled }
    }
  })

export const useToggleAuthor = (users, setUsers) =>
  useMutation({
    mutationFn: async (user) => {
      const updatedUser = { ...user, isAuthor: !user.isAuthor }
      const response = await updateResource(["users", user.id], updatedUser)

      return response
    },
    onError: (user, context) => {
      setUsers(
        users.map((item) =>
          item.id === user.id
            ? { ...item, isAuthor: context.oldIsAuthor }
            : item
        )
      )
    },
    onMutate: (user) => {
      const oldUser = users.find((item) => item.id === user.id)
      setUsers(
        users.map((item) =>
          item.id === user.id ? { ...item, isAuthor: !item.isAuthor } : item
        )
      )

      return { oldIsAuthor: oldUser?.isAuthor }
    }
  })

export const useDeleteUser = (users, setUsers) =>
  useMutation({
    mutationFn: async (userId) => {
      const response = await deleteResource(["users", userId])

      return response
    },
    onError: (userId, context) => {
      setUsers([...users, context.oldUser])
    },
    onMutate: (userId) => {
      const oldUser = users.find((user) => user.id === userId)
      setUsers(users.filter((user) => user.id !== userId))

      return { oldUser }
    }
  })

export const useDeleteComment = (comments, setComments) =>
  useMutation({
    mutationFn: (commentId) => deleteResource(["comments", commentId]),
    onError: (commentId, context) => {
      context.setComments(context.oldComments)
    },
    onMutate: (commentId) => {
      const oldComments = [...comments]
      setComments(comments.filter((comment) => comment.id !== commentId))

      return { oldComments }
    }
  })

export const useUpdateComment = (refetch) =>
  useMutation({
    mutationFn: ({ commentId, content }) =>
      updateResource(["comments", commentId], { content }),
    onSuccess: () => {
      refetch()
    }
  })
