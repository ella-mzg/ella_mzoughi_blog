import Button from "@/web/components/ui/Button"
import { useDeleteUser, useToggleUser } from "@/web/hooks/useUserActions"
import Link from "next/link"
import { useRouter } from "next/router"

const UserItem = ({ user }) => {
  const { mutateAsync: toggleUser } = useToggleUser()
  const { mutateAsync: deleteUser } = useDeleteUser()
  const router = useRouter()
  const handleToggle = async () => {
    try {
      await toggleUser({ userId: user.id, isDisabled: user.isDisabled })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error toggling user status:", error)
    }
  }
  const handleDelete = async () => {
    try {
      await deleteUser(user.id)
      router.push("/users")
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to delete user:", error)
    }
  }

  return (
    <div className="mb-4 p-3 rounded shadow bg-white flex flex-col items-center max-w-sm">
      <p className="text-md mb-4">
        <Link href={`/users/${user.id}`}>{user.username}</Link>
      </p>
      <div className="flex space-x-2">
        <Button size="sm" onClick={handleToggle}>
          {user.isDisabled ? "Enable" : "Disable"}
        </Button>
        <Button size="sm" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  )
}

export default UserItem
