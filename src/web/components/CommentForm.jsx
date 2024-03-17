import { commentContentValidator } from "@/utils/validators"
import { useSession } from "@/web/components/SessionContext"
import Button from "@/web/components/ui/Button"
import FormField from "@/web/components/ui/FormField"
import clsx from "clsx"
import { Form, Formik } from "formik"
import { object } from "yup"

const commentValidationSchema = object({
  content: commentContentValidator
    .required("Your comment cannot be empty")
    .label("Content")
})
const CommentForm = ({ initialValues, onSubmit }) => {
  const { session } = useSession()

  return (
    <div className={clsx("bg-white shadow rounded-lg p-4 mb-4")}>
      {session ? (
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
      ) : (
        <div>
          <p>Please sign in to post a comment.</p>
        </div>
      )}
    </div>
  )
}

export default CommentForm
