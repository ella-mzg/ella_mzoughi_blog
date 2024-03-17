import Loader from "@/web/components/ui/Loader"
import {
  useUserCommentCount,
  useUserPostCount,
  useUserViewCount
} from "@/web/hooks/useUserStats"

const Dashboard = ({ userId }) => {
  const {
    data: postData,
    isLoading: postLoading,
    error: postError
  } = useUserPostCount(userId)
  const {
    data: commentData,
    isLoading: commentLoading,
    error: commentError
  } = useUserCommentCount(userId)
  const {
    data: viewData,
    isLoading: viewLoading,
    error: viewError
  } = useUserViewCount(userId)
  const isLoading = postLoading || commentLoading || viewLoading
  const hasError = postError || commentError || viewError
  const postCount = postData?.result[0]?.count || 0
  const commentCount = commentData?.result[0]?.count || 0
  const viewCount = viewData?.result[0]?.count || 0

  if (isLoading) {
    return <Loader isLoading={isLoading} />
  }

  if (hasError) {
    return (
      <div className="text-center text-red-500">Error loading user stats</div>
    )
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard</h1>
      <div className="space-y-3 font-medium">
        <p>
          <span className="font-semibold">Posts:</span> {postCount}
        </p>
        <p>
          <span className="font-semibold">Comments:</span> {commentCount}
        </p>
        <p>
          <span className="font-semibold">Total Post Views:</span> {viewCount}
        </p>
      </div>
    </div>
  )
}

export default Dashboard
