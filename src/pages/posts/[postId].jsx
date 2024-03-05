import CommentSection from "@/web/components/CommentSection"
import { useSession } from "@/web/components/SessionContext"
import Button from "@/web/components/ui/Button"
import Link from "@/web/components/ui/Link"
import {
  useCreateComment,
  useDeleteComment,
  useUpdateComment
} from "@/web/hooks/useMutation"
import { readResource } from "@/web/services/apiClient"
import { canEdit } from "@/web/utils/checkRoles"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { useState } from "react"

// eslint-disable-next-line max-lines-per-function
const PostPage = () => {
  const router = useRouter()
  const { session } = useSession()
  const {
    query: { postId }
  } = useRouter()
  const {
    isLoading,
    data: { data: { result: [post] = [{}] } = {} },
    refetch
  } = useQuery({
    queryKey: ["post"],
    queryFn: () => readResource(["posts", postId]),
    enabled: Boolean(postId),
    initialData: { data: { result: [{}] } }
  })
  const [comments, setComments] = useState([])
  const [editingComment, setEditingComment] = useState(null)
  const [newContent, setNewContent] = useState("")
  const [commentContent, setCommentContent] = useState("")
  const createCommentMutation = useCreateComment(postId, refetch, setComments)
  const handleCreateComment = async () => {
    if (!commentContent.trim()) {
      return
    }

    const userId = session.user?.id

    if (!userId) {
      // eslint-disable-next-line no-console
      console.error(
        "User ID is not available. User must be logged in to post comments."
      )

      return
    }

    await createCommentMutation.mutateAsync({
      postId,
      content: commentContent,
      userId
    })
    setCommentContent("")
  }
  const deleteMutation = useDeleteComment(refetch, comments, setComments)
  const updateMutation = useUpdateComment(refetch)
  const handleDelete = async (commentId) => {
    await deleteMutation.mutateAsync(commentId)
  }
  const handleUpdate = async (commentId, content) => {
    await updateMutation.mutateAsync({ commentId, content })
    setEditingComment(null)
  }

  if (isLoading) {
    return "Loading..."
  }

  return (
    <article className="p-4 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-2">
        {post.title} #{post.id}
      </h1>
      <p className="text-lg mt-4 mb-4">{post.content}</p>
      <p className="text-sm text-gray-500 mb-6">
        Author:
        <Link
          href={`/users/${post.author?.id}`}
          className="hover:text-pink-500">
          {post.author?.username}
        </Link>
      </p>
      {canEdit(session, post) && (
        <Button
          size="sm"
          onClick={() => router.push(`/posts/${post.id}/edit-post`)}>
          Edit Post
        </Button>
      )}
      <div className="my-4">
        <input
          className="w-full p-2 border border-gray-300 rounded mb-2"
          placeholder="Write a comment..."
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
        />
        <Button
          onClick={handleCreateComment}
          disabled={createCommentMutation.isLoading}>
          Post Comment
        </Button>
      </div>
      <CommentSection
        comments={post?.comments}
        editingComment={editingComment}
        setEditingComment={setEditingComment}
        newContent={newContent}
        setNewContent={setNewContent}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
      />
    </article>
  )
}

export default PostPage
