import CommentSection from "@/web/components/CommentSection"
import Button from "@/web/components/ui/Button"
import Link from "@/web/components/ui/Link"
import Loader from "@/web/components/ui/Loader"
import useAuthorization from "@/web/hooks/useAuthorization"
import {
  useCreateComment,
  useDeleteComment,
  useUpdateComment
} from "@/web/hooks/useCommentActions"
import { useDeletePost, useReadPost } from "@/web/hooks/usePostActions"
import { useRouter } from "next/router"

const PostPage = () => {
  const router = useRouter()
  const { postId } = router.query
  const { data, isLoading } = useReadPost(postId)
  const post = data?.data?.result[0]
  const { isAuthorized } = useAuthorization({
    userId: post?.userId.toString(),
    allowedRoles: ["administrator"]
  })
  const deletePostMutation = useDeletePost()
  const createCommentMutation = useCreateComment(postId)
  const updateCommentMutation = useUpdateComment(postId)
  const deleteCommentMutation = useDeleteComment(postId)
  const handleDelete = async () => {
    await deletePostMutation.mutateAsync(postId, {
      onSuccess: () => {
        router.push("/")
      }
    })
  }

  return (
    <>
      <Loader isLoading={isLoading || !post} />
      {!isLoading && (
        <article className="p-4 bg-white rounded shadow-md">
          <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
          <p className="text-lg mt-4 mb-4">{post.content}</p>
          <p className="text-sm text-gray-500 mb-6">
            Author:
            <Link
              href={`/users/${post?.author?.id}`}
              className="hover:text-pink-500">
              {post.author?.username}
            </Link>
          </p>
          {isAuthorized && (
            <>
              <Button
                size="sm"
                onClick={() => router.push(`/posts/${post.id}/edit-post`)}>
                Edit Post
              </Button>
              <Button size="sm" onClick={handleDelete}>
                Delete Post
              </Button>
            </>
          )}
          <CommentSection
            comments={post.comments}
            createComment={createCommentMutation}
            updateComment={updateCommentMutation}
            deleteComment={deleteCommentMutation}
          />
        </article>
      )}
    </>
  )
}

export default PostPage
