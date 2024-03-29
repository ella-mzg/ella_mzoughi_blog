import { pageValidator } from "@/utils/validators"
import PostPreview from "@/web/components/PostPreview"
import Loader from "@/web/components/ui/Loader"
import Pagination from "@/web/components/ui/Pagination"
import config from "@/web/config"
import { readResource } from "@/web/services/apiClient"
import { useQuery } from "@tanstack/react-query"

export const getServerSideProps = ({ query: { page } }) => ({
  props: {
    page: pageValidator.validateSync(page) || 1
  }
})
const IndexPage = (props) => {
  const { page } = props
  const {
    isLoading,
    data: { data: { result: posts, meta: { count } = {} } = {} } = {}
  } = useQuery({
    queryKey: ["posts", page],
    queryFn: () => readResource("posts", { params: { page } })
  })
  const countPages = Math.ceil(count / config.pagination.limit)

  return (
    <div className="py-4 flex flex-col gap-16">
      <Loader isLoading={isLoading || !posts} />
      {!isLoading && posts && (
        <>
          <ul className="flex flex-col gap-8">
            {posts.map(({ id, title, content, userId }) => (
              <li key={id}>
                <PostPreview
                  id={id}
                  title={title}
                  content={content}
                  userId={userId}
                />
              </li>
            ))}
          </ul>
          <Pagination pathname="/" page={page} countPages={countPages} />
        </>
      )}
    </div>
  )
}

export default IndexPage
