import Link from "@/web/components/ui/Link"
import { readResource } from "@/web/services/apiClient"
import { useEffect, useState } from "react"

const PostPreview = ({ id, title, content, userId }) => {
  const [author, setAuthor] = useState(null)

  useEffect(() => {
    readResource(["users", userId])
      .then((response) => {
        setAuthor(response.data.result[0])
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.error(error))
  }, [userId])

  return (
    <article className="flex flex-col gap-4 p-4 border border-gray-300 rounded-md hover:shadow-md transition-all">
      <h1 className="text-2xl font-semibold">
        <Link href={`/posts/${id}`} className="hover:text-pink-500">
          {title}
        </Link>
      </h1>
      <p className="text-gray-600">
        {content.split(/\s+/u).slice(0, 7).join(" ")}...
      </p>
      <p className="text-sm">
        by{" "}
        <Link href={`/users/${author?.id}`} className="hover:text-pink-500">
          {author?.username}
        </Link>
      </p>
    </article>
  )
}

export default PostPreview

// <Link
//   href={`/users/${comment.author.id}`}
//   className="hover:text-pink-500 hover:font-semibold">
//   {comment.author?.username}
// </Link>
