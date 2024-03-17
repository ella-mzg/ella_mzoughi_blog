import Dashboard from "@/web/components/Dashboard"
import Button from "@/web/components/ui/Button"
import Link from "@/web/components/ui/Link"
import Loader from "@/web/components/ui/Loader"
import useAuthorization from "@/web/hooks/useAuthorization"
import { useReadUser } from "@/web/hooks/useUserActions"
import { useRouter } from "next/router"

const UserProfile = () => {
  const router = useRouter()
  const { userId } = router.query
  const { data, isLoading } = useReadUser(userId)
  const [user] = data?.data?.result || []
  const { isAuthorized } = useAuthorization({
    userId,
    allowedRoles: ["administrator"]
  })
  const sortedPosts = user?.posts?.sort((a, b) => b.id - a.id)

  return (
    <>
      <Loader isLoading={isLoading || !user} />
      {!isLoading && user && (
        <article className="p-4 bg-white rounded shadow-md">
          <h1 className="text-2xl font-bold mb-2">{user.username}</h1>
          <p className="text-gray-600 mb-4">{user.email}</p>
          {isAuthorized && (
            <Button
              size="sm"
              onClick={() => router.push(`/users/${user.id}/edit-profile`)}>
              Edit Profile
            </Button>
          )}
          <Dashboard userId={user.id} />
          {user.posts && user.posts.length > 0 && (
            <>
              <h2 className="text-lg font-bold mb-4 mt-4">Posts:</h2>
              {sortedPosts.map((post, index) => (
                <div key={index} className="mb-4 p-3 rounded shadow bg-gray-50">
                  <Link href={`/posts/${post.id}`}>{post.title}</Link>
                </div>
              ))}
            </>
          )}
        </article>
      )}
    </>
  )
}

export default UserProfile
