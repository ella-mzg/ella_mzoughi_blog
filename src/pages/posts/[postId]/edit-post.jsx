import { useSession } from "@/web/components/SessionContext"
import Alert from "@/web/components/ui/Alert"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import SubmitButton from "@/web/components/ui/SubmitButton"
import { useDeletePost, useUpdatePost } from "@/web/hooks/useMutation"
import { readResource } from "@/web/services/apiClient"
import { canEdit } from "@/web/utils/checkRoles"
import { useQuery } from "@tanstack/react-query"
import { Formik } from "formik"
import { useRouter } from "next/router"
import { object, string } from "yup"

const validationSchema = object({
  title: string().required().label("Title"),
  content: string().required().label("Content")
})
const EditPost = () => {
  const {
    query: { postId }
  } = useRouter()
  const { session } = useSession()
  const {
    isLoading,
    data: { data: { result: [post] = [{}] } = {} },
    refetch
  } = useQuery({
    queryKey: ["post"],
    queryFn: () => readResource(["posts", postId]),
    enabled: Boolean(postId),
    initialData: { data: { result: [{}] } }
  })
  const updateMutation = useUpdatePost(postId, refetch)
  const deleteMutation = useDeletePost(postId)
  const handleUpdate = async ({ title, content }) => {
    await updateMutation.mutateAsync({ title, content })
  }
  const handleDelete = async () => {
    await deleteMutation.mutateAsync()
  }

  if (isLoading) {
    return "Loading..."
  }

  if (updateMutation.isSuccess) {
    return <Alert>Successfully updated your post!</Alert>
  }

  if (deleteMutation.isSuccess) {
    return <Alert>Successfully deleted your post!</Alert>
  }

  return (
    <Formik
      initialValues={{ title: post.title, content: post.content }}
      validationSchema={validationSchema}
      onSubmit={handleUpdate}>
      <Form>
        <FormField
          name="title"
          type="text"
          placeholder="Update your post title"
          label="Title"
        />
        <FormField
          name="content"
          type="text"
          placeholder="Update your post content"
          label="Content"
        />
        <div className="flex justify-center space-x-2">
          {canEdit(session, post) && <SubmitButton>Update Post</SubmitButton>}
          {canEdit(session, post) && (
            <SubmitButton onClick={handleDelete}>Delete Post</SubmitButton>
          )}
        </div>
      </Form>
    </Formik>
  )
}

export default EditPost
