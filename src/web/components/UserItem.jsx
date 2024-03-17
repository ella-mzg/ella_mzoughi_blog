import Button from "@/web/components/ui/Button"
import Link from "@/web/components/ui/Link"
import { useDeleteUser, useToggleUser } from "@/web/hooks/useUserActions"
import { useRouter } from "next/router"
import { useState } from "react"

const UserItem = ({ user }) => {
  const { mutateAsync: toggleUser } = useToggleUser()
  const { mutateAsync: deleteUser } = useDeleteUser()
  const router = useRouter()
  const [error, setError] = useState("")
  const handleToggle = async () => {
    try {
      await toggleUser({ userId: user.id, isDisabled: user.isDisabled })
    } catch (toggleError) {
      setError(`Error toggling user status`)
    }
  }
  const handleDelete = async () => {
    try {
      await deleteUser(user.id)
      router.push("/users")
    } catch (deleteError) {
      setError("Failed to delete user")
    }
  }

  return (
    <div className="mb-4 p-3 rounded shadow bg-white flex flex-col items-center max-w-sm">
      {error && <p className="text-red-500">{error}</p>}
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
