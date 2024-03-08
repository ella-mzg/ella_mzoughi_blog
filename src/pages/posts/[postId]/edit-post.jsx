import { postContentValidator, titleValidator } from "@/utils/validators"
import { useSession } from "@/web/components/SessionContext"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import Loader from "@/web/components/ui/Loader"
import SubmitButton from "@/web/components/ui/SubmitButton"
import { useReadPost, useUpdatePost } from "@/web/hooks/usePostActions"
import { canEdit } from "@/web/utils/checkRoles"
import { Formik } from "formik"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { object } from "yup"

const validationSchema = object({
  title: titleValidator.required().label("Title"),
  content: postContentValidator.required().label("Content")
})
const EditPost = () => {
  const router = useRouter()
  const { postId } = router.query
  const { session } = useSession()
  const { data, isLoading } = useReadPost(postId)
  const post = data?.data?.result[0]
  const [initialValues, setInitialValues] = useState({
    title: "",
    content: ""
  })

  useEffect(() => {
    if (post) {
      setInitialValues({
        title: post.title || "",
        content: post.content || ""
      })
    }
  }, [post])

  const { mutateAsync: updatePost, isSuccess } = useUpdatePost()

  useEffect(() => {
    if (isSuccess) {
      router.push(`/posts/${postId}`)
    }
  }, [isSuccess, router, postId])

  const handleSubmit = async (values) => {
    try {
      await updatePost({ postId, newData: values })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to update post:", error)
    }
  }

  return (
    <>
      <Loader isLoading={isLoading} />
      {!isLoading && (
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
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
                <SubmitButton>Update Post</SubmitButton>
              )}
            </div>
          </Form>
        </Formik>
      )}
    </>
  )
}

export default EditPost
