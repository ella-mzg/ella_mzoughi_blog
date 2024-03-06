import Button from "@/web/components/ui/Button"
import Link from "next/link"

const UserItem = ({ user, toggleUser, deleteUser }) => (
  <div className="mb-4 p-3 rounded shadow bg-white flex flex-col items-center max-w-sm">
    <p className="text-md mb-4">
      <Link href={`/users/${user.id}`}>{user.username}</Link>
    </p>
    <div className="flex space-x-2">
      <Button size="sm" onClick={() => toggleUser.mutate(user)}>
        {user.isDisabled ? "Enable" : "Disable"}
      </Button>
      <Button size="sm" onClick={() => deleteUser.mutate(user.id)}>
        Delete
      </Button>
    </div>
  </div>
)

export default UserItem
