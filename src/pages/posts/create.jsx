import { postContentValidator, titleValidator } from "@/utils/validators"
import { useSession } from "@/web/components/SessionContext"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import SubmitButton from "@/web/components/ui/SubmitButton"
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

  return (
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
        />
        <div className="flex justify-center">
          <SubmitButton className="w-30">Create Post</SubmitButton>
        </div>
      </Form>
    </Formik>
  )
}

export default CreatePost
