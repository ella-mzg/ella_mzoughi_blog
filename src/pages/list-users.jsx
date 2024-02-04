import UserItem from "@/web/components/UserItem"
import {
  useDeleteUser,
  useToggleAuthor,
  useToggleUser
} from "@/web/hooks/useMutation"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useEffect, useState } from "react"

const UserListPage = () => {
  const {
    data: { data: { result: initialUsers = [] } = {} },
    isLoading
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => axios(`/api/users`),
    initialData: { data: { result: [] } }
  })
  const [users, setUsers] = useState([])

  useEffect(() => {
    setUsers(initialUsers)
  }, [initialUsers])

  const toggleUser = useToggleUser(users, setUsers)
  const toggleAuthor = useToggleAuthor(users, setUsers)
  const deleteUser = useDeleteUser(users, setUsers)

  if (isLoading) {
    return "Loading..."
  }

  return (
    <div className="p-4 bg-gray-50 rounded shadow-md flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-2">Users:</h1>
      {users.map((user, index) => (
        <UserItem
          key={index}
          user={user}
          toggleAuthor={toggleAuthor}
          toggleUser={toggleUser}
          deleteUser={deleteUser}
        />
      ))}
    </div>
  )
}

export default UserListPage
