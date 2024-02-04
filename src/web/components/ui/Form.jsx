import { Form as FormikForm } from "formik"

const Form = (props) => (
  <FormikForm className="flex flex-col gap-4 p-4" noValidate {...props} />
)

export default Form
