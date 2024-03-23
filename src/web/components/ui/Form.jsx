import { Form as FormikForm } from "formik"

const Form = (props) => (
  <div className="max-w-lg mx-auto mt-10">
    <div className="bg-white rounded shadow">
      <FormikForm className="flex flex-col gap-4 p-6" noValidate {...props} />
    </div>
  </div>
)

export default Form
