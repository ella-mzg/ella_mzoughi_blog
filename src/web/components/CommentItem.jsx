import CommentForm from "@/web/components/CommentForm"
import Button from "@/web/components/ui/Button"
import clsx from "clsx"

const CommentItem = ({ comment, isEditing, onEdit, onDelete, onSubmit }) => (
  <div
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
        <div className="text-sm font-medium text-gray-700">
          {comment.author.username}:
        </div>
        <p className="text-gray-800">
          <span className="font-semibold">{comment.title}</span> -{" "}
          {comment.content}
        </p>
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={() => onEdit(comment.id)}>Edit</Button>
          <Button onClick={() => onDelete(comment.id)}>Delete</Button>
        </div>
      </div>
    )}
  </div>
)

export default CommentItem
