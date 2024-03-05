import { useSession } from "@/web/components/SessionContext"
import Button from "@/web/components/ui/Button"
import { useCallback, useState } from "react"

// eslint-disable-next-line max-lines-per-function
const CommentSection = ({
  comments = [],
  createComment,
  updateComment,
  deleteComment
}) => {
  const { session } = useSession()
  const authorId = session?.user?.id
  const [newCommentContent, setNewCommentContent] = useState("")
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editContent, setEditContent] = useState("")
  const handleCreateComment = useCallback(async () => {
    await createComment.mutateAsync({
      content: newCommentContent,
      userId: authorId
    })
    setNewCommentContent("")
  }, [createComment, newCommentContent, authorId])
  const handleUpdate = useCallback(
    async (commentId) => {
      await updateComment.mutateAsync({ commentId, content: editContent })
      setEditingCommentId(null)
      setEditContent("")
    },
    [updateComment, editContent]
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
      <div>
        <textarea
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          placeholder="Write a new comment..."
        />
        <Button onClick={handleCreateComment}>Post Comment</Button>
      </div>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>
              {comment.author.username}: {comment.content}
            </p>
            <div>
              <Button
                onClick={() => {
                  setEditingCommentId(comment.id)
                  setEditContent(comment.content)
                }}>
                Edit
              </Button>
              <Button onClick={() => handleDelete(comment.id)}>Delete</Button>
            </div>
            {editingCommentId === comment.id && (
              <div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <Button onClick={() => handleUpdate(comment.id)}>Save</Button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  )
}

export default CommentSection
