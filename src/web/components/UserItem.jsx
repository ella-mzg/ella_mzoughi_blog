import Button from "@/web/components/ui/Button"
import Link from "next/link"

const UserItem = ({ user, toggleAuthor, toggleUser, deleteUser }) => (
  <div className="mb-4 p-3 rounded shadow bg-white flex flex-col items-center max-w-sm">
    <p className="text-md mb-4">
      <Link href={`/users/${user.id}`} className="hover:text-pink-500">
        {user.username}
      </Link>
    </p>
    <div className="flex space-x-2">
      <Button
        variant="primary"
        size="sm"
        onClick={() => {
          toggleAuthor.mutate(user)
        }}>
        {user.isAuthor ? "Remove Author" : "Make Author"}
      </Button>
      <Button
        variant="primary"
        size="sm"
        onClick={() => {
          toggleUser.mutate(user)
        }}>
        {user.isDisabled ? "Enable" : "Disable"}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          deleteUser.mutate(user.id)
        }}>
        Delete User
      </Button>
    </div>
  </div>
)

export default UserItem
