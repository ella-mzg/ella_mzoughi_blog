import { pageValidator } from "@/utils/validators"
import UserItem from "@/web/components/UserItem"
import Loader from "@/web/components/ui/Loader"
import Pagination from "@/web/components/ui/Pagination"
import config from "@/web/config"
import useAuthorization from "@/web/hooks/useAuthorization"
import { readResource } from "@/web/services/apiClient"
import { useQuery } from "@tanstack/react-query"

export const getServerSideProps = ({ query: { page } }) => ({
  props: {
    page: pageValidator.validateSync(page) || 1
  }
})
const UsersPage = ({ page }) => {
  const {
    isLoading,
    data: { data: { result: users, meta: { count } = {} } = {} } = {}
  } = useQuery({
    queryKey: ["users", page],
    queryFn: () => readResource("users", { params: { page } })
  })
  const countPages = Math.ceil(count / config.pagination.limit)
  const { AuthorizationAlert } = useAuthorization({
    allowedRoles: ["administrator"]
  })
  const sortedUsers = users?.sort((a, b) => a.id - b.id) || []

  return (
    <AuthorizationAlert>
      <div className="py-4 flex flex-col gap-16">
        <Loader isLoading={isLoading || !users} />
        {!isLoading && (
          <>
            <ul className="flex flex-col gap-8">
              {sortedUsers.map((user) => (
                <li key={user.id}>
                  <UserItem user={user} />
                </li>
              ))}
            </ul>
            <Pagination pathname="/users" page={page} countPages={countPages} />
          </>
        )}
      </div>
    </AuthorizationAlert>
  )
}

export default UsersPage
