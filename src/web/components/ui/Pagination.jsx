import Button from "@/web/components/ui/Button"
import Link from "@/web/components/ui/Link"

const PaginationItem = ({ query, pathname, ...otherProps }) => (
  <li>
    <Button
      as={Link}
      href={{
        pathname,
        query,
      }}
      {...otherProps}
    />
  </li>
)
const Pagination = (props) => {
  const { page, pathname, countPages } = props

  return (
    <nav>
      <ul className="flex gap-2">
        {page > 1 && (
          <>
            <PaginationItem pathname={pathname} query={{ page: page - 1 }}>
              Previous
            </PaginationItem>
            <PaginationItem pathname={pathname} query={{ page: page - 1 }}>
              {page - 1}
            </PaginationItem>
          </>
        )}
        <PaginationItem
          pathname={pathname}
          query={{ page }}
          variant="secondary"
        >
          {page}
        </PaginationItem>
        {page < countPages && (
          <>
            <PaginationItem pathname={pathname} query={{ page: page + 1 }}>
              {page + 1}
            </PaginationItem>
            <PaginationItem pathname={pathname} query={{ page: page + 1 }}>
              Next
            </PaginationItem>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Pagination
