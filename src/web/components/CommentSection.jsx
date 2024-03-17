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
    const sorted = [...comments].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
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
    <div className="bg-slate-100 p-4 rounded mt-10">
      <CommentForm
        initialValues={newCommentInitialValues}
        onSubmit={handleCreateComment}
      />
      <h2 className="text-xl font-semibold text-gray-800 mb-5">Comments:</h2>
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
      {sortedComments.length === 0 && (
        <p className="text-gray-600 italic">No comments yet.</p>
      )}
    </div>
  )
}

export default CommentSection
