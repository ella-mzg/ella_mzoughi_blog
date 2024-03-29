import { postContentValidator, titleValidator } from "@/utils/validators"
import { useSession } from "@/web/components/SessionContext"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import Loader from "@/web/components/ui/Loader"
import SubmitButton from "@/web/components/ui/SubmitButton"
import useAuthorization from "@/web/hooks/useAuthorization"
import { createResource } from "@/web/services/apiClient"
import { useMutation } from "@tanstack/react-query"
import { Formik } from "formik"
import { useRouter } from "next/router"
import { useCallback } from "react"
import { object } from "yup"

const validationSchema = object({
  title: titleValidator.required().label("Title"),
  content: postContentValidator.required().label("Content")
})
const initialValues = {
  title: "",
  content: ""
}
const CreatePost = () => {
  const router = useRouter()
  const { session } = useSession()
  const authorId = session?.user?.id
  const { mutateAsync: savePost } = useMutation({
    mutationFn: (post) => createResource("posts", post)
  })
  const handleSubmit = useCallback(
    async ({ title, content }) => {
      const response = await savePost({
        title,
        content,
        userId: authorId
      })
      const [post] = response.data.result
      router.push(`/posts/${post.id}`)
    },
    [savePost, router, authorId]
  )
  const { AuthorizationAlert } = useAuthorization({
    allowedRoles: ["author", "administrator"]
  })

  return (
    <AuthorizationAlert>
      <Loader isLoading={false} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        <Form>
          <FormField
            name="title"
            type="text"
            label="Title"
            placeholder="Enter a title"
          />
          <FormField
            name="content"
            as="textarea"
            label="Content"
            placeholder="Write your post..."
            className="mt-2"
          />
          <div className="flex justify-center mt-5">
            <SubmitButton>Create Post</SubmitButton>
          </div>
        </Form>
      </Formik>
    </AuthorizationAlert>
  )
}

export default CreatePost
