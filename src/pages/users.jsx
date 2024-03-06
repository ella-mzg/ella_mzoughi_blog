import { pageValidator } from "@/utils/validators"
import UserItem from "@/web/components/UserItem"
import Pagination from "@/web/components/ui/Pagination"
import config from "@/web/config"
import { useDeleteUser, useToggleUser } from "@/web/hooks/useUserActions"
import { readResource } from "@/web/services/apiClient"
import { useQuery } from "@tanstack/react-query"

export const getServerSideProps = ({ query: { page } }) => ({
  props: {
    page: pageValidator.validateSync(page) || 1
  }
})
const UsersPage = (props) => {
  const { page } = props
  const toggleUserMutation = useToggleUser()
  const deleteUserMutation = useDeleteUser()
  const {
    isLoading,
    data: { data: { result: users, meta: { count } = {} } = {} } = {}
  } = useQuery({
    queryKey: ["users", page],
    queryFn: () => readResource("users", { params: { page } })
  })
  const countPages = Math.ceil(count / config.pagination.limit)

  if (isLoading || !users) {
    return <div className="text-center p-32 animate-bounce">Loading...</div>
  }

  const sortedUsers = users.sort((a, b) => a.id - b.id)

  return (
    <div className="py-4 flex flex-col gap-16">
      <ul className="flex flex-col gap-8">
        {sortedUsers.map((user) => (
          <li key={user.id}>
            <UserItem
              user={user}
              toggleUser={toggleUserMutation}
              deleteUser={deleteUserMutation}
            />
          </li>
        ))}
      </ul>
      <Pagination pathname="/users" page={page} countPages={countPages} />
    </div>
  )
}

export default UsersPage
