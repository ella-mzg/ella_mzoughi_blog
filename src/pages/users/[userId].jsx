import Dashboard from "@/web/components/Dashboard"
import Button from "@/web/components/ui/Button"
import Link from "@/web/components/ui/Link"
import Loader from "@/web/components/ui/Loader"
import useAuthorization from "@/web/hooks/useAuthorization"
import { useReadPostsByUserId } from "@/web/hooks/usePostActions"
import { useReadUser } from "@/web/hooks/useUserActions"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const UserProfile = () => {
  const router = useRouter()
  const { userId } = router.query
  const { data, isLoading: isLoadingUser } = useReadUser(userId)
  const [user] = data?.data?.result || []
  const { data: postsData, isLoading: isLoadingPosts } =
    useReadPostsByUserId(userId)
  const [sortedPosts, setSortedPosts] = useState([])

  useEffect(() => {
    if (postsData) {
      const sorted = [...postsData].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      setSortedPosts(sorted)
    }
  }, [postsData])

  const { isAuthorized } = useAuthorization({
    userId,
    allowedRoles: ["administrator"]
  })

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Loader isLoading={isLoadingUser || isLoadingPosts} />
      {!isLoadingUser && user && (
        <div className="bg-white rounded shadow">
          <div className="p-6">
            <h1 className="text-2xl font-semibold">{user.username}</h1>
            <p className="text-gray-500 mb-5">{user.email}</p>
            {isAuthorized && (
              <Button
                size="sm"
                onClick={() => router.push(`/users/${user.id}/edit-profile`)}>
                Edit Profile
              </Button>
            )}
          </div>
          <Dashboard userId={user.id} />
          <div className="p-6 divide-y divide-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Posts</h2>
            <div className="space-y-4">
              {sortedPosts.map((post, index) => (
                <div key={index} className="p-3 rounded shadow bg-gray-50">
                  <Link href={`/posts/${post.id}`}>{post.title}</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfile
