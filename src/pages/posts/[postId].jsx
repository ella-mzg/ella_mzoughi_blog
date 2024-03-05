import CommentSection from "@/web/components/CommentSection"
import { useSession } from "@/web/components/SessionContext"
import Button from "@/web/components/ui/Button"
import Link from "@/web/components/ui/Link"
import {
  useCreateComment,
  useDeleteComment,
  useUpdateComment
} from "@/web/hooks/useCommentActions"
import { usePostData } from "@/web/hooks/usePostData"
import { canEdit } from "@/web/utils/checkRoles"
import { useRouter } from "next/router"

const PostPage = () => {
  const router = useRouter()
  const { postId } = router.query
  const { session } = useSession()
  const { post, isLoading } = usePostData(postId)
  const createCommentMutation = useCreateComment(postId)
  const updateCommentMutation = useUpdateComment(postId)
  const deleteCommentMutation = useDeleteComment(postId)

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
      <CommentSection
        comments={post.comments}
        createComment={createCommentMutation}
        updateComment={updateCommentMutation}
        deleteComment={deleteCommentMutation}
      />
    </article>
  )
}

export default PostPage
