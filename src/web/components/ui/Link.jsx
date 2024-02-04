import NextLink from "next/link"

const Link = (props) => {
  const { styless, ...otherProps } = props

  return (
    <NextLink
      className={styless ? "" : "hover:text-pink-500 hover:underline"}
      {...otherProps}
    />
  )
}

export default Link
