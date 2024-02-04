import Button from "@/web/components/ui/Button"
import { useFormikContext } from "formik"

const SubmitButton = ({ disabled, ...otherProps }) => {
  const { isSubmitting, isValid } = useFormikContext()

  return (
    <Button
      type="submit"
      disabled={disabled || isSubmitting || !isValid}
      {...otherProps}
    />
  )
}

export default SubmitButton
