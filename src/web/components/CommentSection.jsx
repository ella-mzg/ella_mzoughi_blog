import CommentForm from "@/web/components/CommentForm"
import CommentItem from "@/web/components/CommentItem"
import { useSession } from "@/web/components/SessionContext"
import { useCallback, useEffect, useState } from "react"

const newCommentInitialValues = { content: "" }
const CommentSection = ({
  comments = [],
  createComment,
  updateComment,
  deleteComment
}) => {
  const { session } = useSession()
  const authorId = session?.user?.id
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [sortedComments, setSortedComments] = useState([])
  useEffect(() => {
    const sorted = [...comments].sort((a, b) => a.id - b.id)
    setSortedComments(sorted)
  }, [comments])

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
      <CommentForm
        initialValues={newCommentInitialValues}
        onSubmit={handleCreateComment}
        placeholder="Add a comment..."
      />
      <h3>Comments</h3>
      {sortedComments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isEditing={editingCommentId === comment.id}
          onEdit={() => setEditingCommentId(comment.id)}
          onDelete={handleDelete}
          onSubmit={(values) => handleUpdateComment(values)}
        />
      ))}
      {sortedComments.length === 0 && <p>No comments yet.</p>}
    </div>
  )
}

export default CommentSection
