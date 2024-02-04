import clsx from "clsx"

const base = "rounded text-white font-semibold transition-colors duration-200"
const variants = {
  primary:
    "bg-gray-900 hover:bg-gray-800 active:bg-black hover:ring-2 hover:ring-pink-500",
  secondary:
    "bg-gray-700 hover:bg-gray-600 active:bg-gray-900 hover:ring-2 hover:ring-pink-500",
  disabled: "bg-gray-400 cursor-not-allowed"
}
const sizes = {
  sm: "px-2 py-1 text-sm",
  md: "px-2 py-2 text-lg"
}
const Button = (props) => {
  const {
    as: Component = "button",
    variant = "primary",
    size = "md",
    className,
    ...otherProps
  } = props

  return (
    <Component
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={variant === "disabled"}
      {...otherProps}
    />
  )
}

export default Button
