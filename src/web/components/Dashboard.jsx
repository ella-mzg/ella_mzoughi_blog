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
  const [{ count: postCount } = { count: 0 }] = postData?.result || []
  const [{ count: commentCount } = { count: 0 }] = commentData?.result || []
  const [{ count: viewCount } = { count: 0 }] = viewData?.result || []

  if (isLoading) {
    return <Loader isLoading={isLoading} />
  }

  if (hasError) {
    return (
      <div className="text-center text-red-500">Error loading user stats.</div>
    )
  }

  return (
    <div className="mt-3 p-6 divide-y divide-gray-200">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard</h1>
      <div className="pt-4 space-y-4 font-medium text-gray-600">
        <div className="flex justify-between">
          <span>Posts:</span>
          <span className="font-semibold text-gray-800">{postCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Comments:</span>
          <span className="font-semibold text-gray-800">{commentCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Post Views:</span>
          <span className="font-semibold text-gray-800">{viewCount}</span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
