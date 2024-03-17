import { postContentValidator, titleValidator } from "@/utils/validators"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import Loader from "@/web/components/ui/Loader"
import SubmitButton from "@/web/components/ui/SubmitButton"
import useAuthorization from "@/web/hooks/useAuthorization"
import { useReadPost, useUpdatePost } from "@/web/hooks/usePostActions"
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
  const { data, isLoading } = useReadPost(postId)
  const [post] = data?.data?.result || []
  const [initialValues, setInitialValues] = useState({
    title: "",
    content: ""
  })
  const [error, setError] = useState("")
  const { AuthorizationAlert } = useAuthorization({
    userId: post?.userId.toString(),
    allowedRoles: ["administrator"]
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
    } catch (updateError) {
      setError("Failed to update post.")
    }
  }

  return (
    <AuthorizationAlert>
      <Loader isLoading={isLoading || !post} />
      {!isLoading && post && (
        <>
          {error && <p className="text-red-500">{error}</p>}
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
                <SubmitButton>Update Post</SubmitButton>
              </div>
            </Form>
          </Formik>
        </>
      )}
    </AuthorizationAlert>
  )
}

export default EditPost
