import CommentForm from "@/web/components/CommentForm"
import CommentItem from "@/web/components/CommentItem"
import { useSession } from "@/web/components/SessionContext"
import { useCallback, useState } from "react"

const newCommentInitialValues = { title: "", content: "" }
const CommentSection = ({
  comments = [],
  createComment,
  updateComment,
  deleteComment
}) => {
  const { session } = useSession()
  const authorId = session?.user?.id
  const [editingCommentId, setEditingCommentId] = useState(null)
  const handleCreateComment = useCallback(
    async (values, { resetForm }) => {
      await createComment.mutateAsync({ ...values, userId: authorId })
      resetForm()
    },
    [createComment, authorId]
  )
  const handleUpdateComment = useCallback(
    async (values) => {
      await updateComment.mutateAsync({
        commentId: editingCommentId,
        ...values
      })
      setEditingCommentId(null)
    },
    [updateComment, editingCommentId]
  )
  const handleDelete = useCallback(
    async (commentId) => {
      await deleteComment.mutateAsync(commentId)
    },
    [deleteComment]
  )

  return (
    <div>
      <h3>Comments</h3>
      <CommentForm
        initialValues={newCommentInitialValues}
        onSubmit={handleCreateComment}
        placeholder="Write a new comment..."
      />
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isEditing={editingCommentId === comment.id}
          onEdit={setEditingCommentId}
          onDelete={handleDelete}
          onSubmit={(values) => handleUpdateComment(values)}
        />
      ))}
      {comments.length === 0 && <p>No comments yet.</p>}
    </div>
  )
}

export default CommentSection
