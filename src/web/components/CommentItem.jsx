import CommentForm from "@/web/components/CommentForm"
import Button from "@/web/components/ui/Button"
import useAuthorization from "@/web/hooks/useAuthorization"
import clsx from "clsx"
import Link from "next/link"

const CommentItem = ({ comment, isEditing, onEdit, onDelete, onSubmit }) => {
  const { isAuthorized } = useAuthorization({
    userId: comment.userId.toString(),
    allowedRoles: ["administrator"]
  })

  return (
    <article
      className={clsx("bg-white shadow rounded-lg p-4 mb-4", {
        "bg-gray-100": isEditing
      })}>
      {isEditing ? (
        <div className="space-y-4">
          <CommentForm
            initialValues={{ title: comment.title, content: comment.content }}
            onSubmit={onSubmit}
            placeholder="Edit your comment..."
          />
        </div>
      ) : (
        <div>
          <div className="text-sm text-gray-700">
            <Link
              href={`/users/${comment.author.id}`}
              className="text-gray-500">
              {comment.author.username}
            </Link>
          </div>
          <p className="text-gray-800 mt-2 text-sm">{comment.content}</p>
          {isAuthorized && (
            <div className="flex justify-end space-x-2 mt-4">
              <Button size="sm" onClick={() => onEdit(comment.id)}>
                Edit
              </Button>
              <Button size="sm" onClick={() => onDelete(comment.id)}>
                Delete
              </Button>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

export default CommentItem
