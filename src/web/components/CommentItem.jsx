import CommentForm from "@/web/components/CommentForm"
import Button from "@/web/components/ui/Button"
import Link from "@/web/components/ui/Link"
import Loader from "@/web/components/ui/Loader"
import useAuthorization from "@/web/hooks/useAuthorization"
import {
  useDeleteComment,
  useReadComment,
  useUpdateComment
} from "@/web/hooks/useCommentActions"
import clsx from "clsx"
import { useState } from "react"

const CommentItem = ({ commentId }) => {
  const [isEditing, setIsEditing] = useState(false)
  const { data, isLoading } = useReadComment(commentId)
  const [comment] = data?.data?.result || []
  const [error, setError] = useState("")
  const { isAuthorized } = useAuthorization({
    userId: comment?.userId?.toString(),
    allowedRoles: ["administrator"]
  })
  const { mutateAsync: updateComment } = useUpdateComment()
  const { mutateAsync: deleteComment } = useDeleteComment()
  const handleEdit = () => setIsEditing(true)
  const handleSubmit = async (values) => {
    try {
      await updateComment({ commentId, newData: values })
      setIsEditing(false)
    } catch (updateError) {
      setError("Failed to update comment.")
    }
  }
  const handleDelete = async () => {
    try {
      await deleteComment(commentId)
    } catch (updateError) {
      setError("Failed to update post.")
    }
  }

  return (
    <>
      <Loader isLoading={isLoading || !comment} />
      {!isLoading && comment && (
        <article
          className={clsx("bg-white shadow rounded p-4 mb-4", {
            "bg-gray-100": isEditing
          })}>
          {error && <p className="text-red-500">{error}</p>}
          {isEditing ? (
            <CommentForm
              initialValues={{ content: comment.content }}
              onSubmit={handleSubmit}
            />
          ) : (
            <div>
              <div className="text-sm text-gray-700">
                {comment?.author && (
                  <Link
                    href={`/users/${comment.author.id}`}
                    className="text-gray-500">
                    {comment.author.username}
                  </Link>
                )}
              </div>
              <p className="text-gray-800 mt-2 text-sm">{comment.content}</p>
              {isAuthorized && (
                <div className="flex justify-end space-x-2 mt-4">
                  <Button size="sm" onClick={handleEdit}>
                    Edit
                  </Button>
                  <Button size="sm" onClick={handleDelete}>
                    Delete
                  </Button>
                </div>
              )}
            </div>
          )}
        </article>
      )}
    </>
  )
}

export default CommentItem
