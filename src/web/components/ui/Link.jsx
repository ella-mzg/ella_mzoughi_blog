import NextLink from "next/link"

const Link = (props) => {
  const { styless, ...otherProps } = props

  return <NextLink className={styless ? "" : "underline"} {...otherProps} />
}

export default Link
