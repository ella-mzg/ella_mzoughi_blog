import clsx from "clsx"

const Input = ({
  as: Component = "input",
  textarea,
  className,
  ...otherProps
}) => {
  const SimpleOrTextArea = textarea ? "textarea" : Component

  return (
    <SimpleOrTextArea
      {...otherProps}
      className={clsx("border-2 p-2", className)}
    />
  )
}

export default Input
