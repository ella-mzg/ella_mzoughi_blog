import { commentContentValidator } from "@/utils/validators"
import Button from "@/web/components/ui/Button"
import FormField from "@/web/components/ui/FormField"
import { Form, Formik } from "formik"
import { object } from "yup"

const commentValidationSchema = object({
  content: commentContentValidator.required().label("Content")
})
const CommentForm = ({ initialValues, onSubmit }) => (
  <Formik
    initialValues={initialValues}
    validationSchema={commentValidationSchema}
    onSubmit={onSubmit}>
    {({ isSubmitting }) => (
      <Form>
        <FormField
          name="content"
          as="textarea"
          placeholder="Write your comment..."
        />
        <Button type="submit" disabled={isSubmitting}>
          {initialValues.id ? "Save Changes" : "Post Comment"}
        </Button>
      </Form>
    )}
  </Formik>
)

export default CommentForm
