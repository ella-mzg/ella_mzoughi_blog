import { useSession } from "@/web/components/SessionContext"
import Link from "@/web/components/ui/Link"

const MainMenu = ({ children: _, ...otherProps }) => {
  const { session, signOut } = useSession()
  const userRole = session?.user?.role
  const hasRole = (roles) => roles.includes(userRole)

  return (
    <nav {...otherProps}>
      <ul className="flex gap-4">
        {session ? (
          <>
            {hasRole(["administrator"]) && (
              <li>
                <Link href={"/users"} className="hover:text-pink-500">
                  Users
                </Link>
              </li>
            )}
            {hasRole(["author", "administrator"]) && (
              <li>
                <Link href="/posts/create" className="hover:text-pink-500">
                  Write Post
                </Link>
              </li>
            )}
            <li>
              <Link
                href={`/users/${session.user.id}`}
                className="hover:text-pink-500">
                Profile
              </Link>
            </li>
            <li>
              <button className="hover:text-pink-500" onClick={signOut}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/sign-in" className="hover:text-pink-500">
                Sign in
              </Link>
            </li>
            <li>
              <Link href="/sign-up" className="hover:text-pink-500">
                Sign up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default MainMenu
