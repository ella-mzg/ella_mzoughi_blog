import { postContentValidator, titleValidator } from "@/utils/validators"
import { useSession } from "@/web/components/SessionContext"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import SubmitButton from "@/web/components/ui/SubmitButton"
import { useReadPost, useUpdatePost } from "@/web/hooks/usePostActions"
import { canEdit } from "@/web/utils/checkRoles"
import { Formik } from "formik"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { object } from "yup"

const validationSchema = object({
  title: titleValidator.required().label("Title"),
  content: postContentValidator.required().label("Content")
})
const EditPost = () => {
  const router = useRouter()
  const { postId } = router.query
  const { session } = useSession()
  const { post, isLoading } = useReadPost(postId)
  const updatePostMutation = useUpdatePost()
  const [initialValues, setInitialValues] = useState({
    title: "",
    content: ""
  })

  useEffect(() => {
    if (!isLoading && post) {
      setInitialValues({
        title: post.title || "",
        content: post.content || ""
      })
    }
  }, [isLoading, post])

  const handleUpdate = useCallback(
    async (values) => {
      if (!postId) {
        return
      }

      await updatePostMutation.mutateAsync(
        { postId, newData: values },
        {
          onSuccess: () => {
            if (postId) {
              router.push(`/posts/${postId}`)
            }
          }
        }
      )
    },
    [updatePostMutation, postId, router]
  )

  if (isLoading || !post) {
    return <div className="text-center p-32 animate-bounce">Loading...</div>
  }

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={handleUpdate}>
      <Form>
        <FormField
          name="title"
          type="text"
          label="Title"
          placeholder="Update your post title"
        />
        <FormField
          name="content"
          as="textarea"
          label="Content"
          placeholder="Update your post content"
        />
        <div className="flex justify-center space-x-2">
          {canEdit(session, post) && (
            <SubmitButton type="submit">Update Post</SubmitButton>
          )}
        </div>
      </Form>
    </Formik>
  )
}

export default EditPost
