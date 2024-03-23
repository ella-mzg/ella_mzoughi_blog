import CommentForm from "@/web/components/CommentForm"
import CommentItem from "@/web/components/CommentItem"
import { useSession } from "@/web/components/SessionContext"
import Loader from "@/web/components/ui/Loader"
import { readResource } from "@/web/services/apiClient"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

const newCommentInitialValues = { content: "" }
const CommentSection = ({ postId, createComment }) => {
  const { session } = useSession()
  const authorId = session?.user?.id
  const { isLoading, data, error } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => readResource(`comments?postId=${postId}`)
  })
  const [sortedComments, setSortedComments] = useState([])

  useEffect(() => {
    if (data?.data?.result) {
      const sorted = [...data.data.result].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      setSortedComments(sorted)
    }
  }, [data])

  const handleCreateComment = async (values, { resetForm }) => {
    await createComment.mutateAsync({ ...values, userId: authorId })
    resetForm()
  }

  return (
    <div className="bg-slate-100 p-4 rounded mt-10">
      <CommentForm
        initialValues={newCommentInitialValues}
        onSubmit={handleCreateComment}
      />
      <h2 className="text-xl font-semibold text-gray-800 mb-5">Comments</h2>
      <Loader isLoading={isLoading} />
      {!isLoading && sortedComments.length > 0 ? (
        sortedComments.map((comment) => (
          <CommentItem key={comment.id} commentId={comment.id} />
        ))
      ) : (
        <p className="text-gray-600 italic">No comments yet.</p>
      )}
      {error && <p>Error loading comments.</p>}
    </div>
  )
}

export default CommentSection
