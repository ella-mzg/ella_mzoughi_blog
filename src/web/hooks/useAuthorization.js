import { useSession } from "@/web/components/SessionContext"
import Alert from "@/web/components/ui/Alert"
import { useEffect, useState } from "react"

const useAuthorization = ({ userId, allowedRoles = [] }) => {
  const { session } = useSession()
  const currentUser = session?.user
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuthorization = () => {
      if (!currentUser) {
        return false
      }

      const hasRequiredRole =
        allowedRoles.length === 0 || allowedRoles.includes(currentUser.role)
      const isCurrentUser = userId
        ? currentUser.id.toString() === userId
        : false

      return hasRequiredRole || isCurrentUser
    }

    setIsAuthorized(checkAuthorization())
  }, [currentUser, userId, allowedRoles])

  const AuthorizationAlert = ({ showAlert = true, children }) => {
    if (!isAuthorized && showAlert) {
      return (
        <Alert variant="danger">
          You do not have permission to access this page.
        </Alert>
      )
    }

    return <>{children}</>
  }

  return { isAuthorized, AuthorizationAlert }
}

export default useAuthorization
