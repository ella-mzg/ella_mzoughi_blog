/* eslint-disable max-lines-per-function */
import Button from "@/web/components/ui/Button"
import Link from "@/web/components/ui/Link"

const CommentSection = ({
  comments,
  editingComment,
  setEditingComment,
  newContent,
  setNewContent,
  handleUpdate,
  handleDelete
}) => {
  if (!comments) {
    return null
  }

  return (
    <>
      {comments.map((comment, index) => (
        <div key={index} className="mb-4 p-3 rounded shadow bg-gray-50">
          <p className="text-sm text-gray-500 mb-2">
            <Link
              href={`/users/${comment.author.id}`}
              className="hover:text-pink-500 hover:font-semibold">
              {comment.author?.username}
            </Link>
          </p>
          {editingComment === comment.id ? (
            <>
              <input
                className="w-full mb-3 p-4 border border-gray-300 rounded"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />

              <div className="flex justify-center space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleUpdate(comment.id, newContent)}>
                  Save
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingComment(null)}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-base mb-3">{comment.content}</p>
              <div className="flex justify-center space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setEditingComment(comment.id)
                    setNewContent(comment.content)
                  }}>
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDelete(comment.id)}>
                  Delete
                </Button>
              </div>
            </>
          )}
        </div>
      ))}
    </>
  )
}

export default CommentSection
