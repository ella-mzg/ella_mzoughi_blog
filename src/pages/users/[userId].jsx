import Button from "@/web/components/ui/Button"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/router"

const UserProfile = () => {
  const router = useRouter()
  const {
    query: { userId }
  } = useRouter()
  const {
    isLoading,
    data: { data: { result: [user] = [{}] } = {} }
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => axios(`/api/users/${userId}`),
    enabled: Boolean(userId),
    initialData: { data: { result: [{}] } }
  })

  if (isLoading) {
    return "Loading..."
  }

  return (
    <article className="p-4 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-2">
        {user.username} #{user.id}
      </h1>
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
  )
}

export default UserProfile
