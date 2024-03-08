import Button from "@/web/components/ui/Button"
import Loader from "@/web/components/ui/Loader"
import { useReadUser } from "@/web/hooks/useUserActions"
import Link from "next/link"
import { useRouter } from "next/router"

const UserProfile = () => {
  const router = useRouter()
  const { userId } = router.query
  const { data, isLoading } = useReadUser(userId)
  const user = data?.data?.result[0]

  return (
    <>
      <Loader isLoading={isLoading} />
      {!isLoading && (
        <article className="p-4 bg-white rounded shadow-md">
          <h1 className="text-2xl font-bold mb-2">{user.username}</h1>
          <p className="text-gray-600 mb-4">{user.email}</p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push(`/users/${user.id}/edit-profile`)}>
            Edit Profile
          </Button>
          {user.posts && user.posts.length > 0 && (
            <>
              <h2 className="text-lg font-bold mb-4 mt-4">Posts:</h2>
              {user.posts.map((post, index) => (
                <div key={index} className="mb-4 p-3 rounded shadow bg-gray-50">
                  <p className="mb-2">
                    <Link
                      href={`/posts/${post.id}`}
                      className="hover:text-pink-500">
                      {post.title}
                    </Link>
                  </p>
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
