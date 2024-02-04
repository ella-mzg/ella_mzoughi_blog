import { emailValidator, usernameValidator } from "@/utils/validators"
import Alert from "@/web/components/ui/Alert"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import SubmitButton from "@/web/components/ui/SubmitButton"
import { readResource, updateResource } from "@/web/services/apiClient"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Formik } from "formik"
import { useRouter } from "next/router"
import { object } from "yup"

const validationSchema = object({
  username: usernameValidator.required().label("Username"),
  email: emailValidator.required().label("E-mail")
})
const EditUser = () => {
  const {
    query: { userId }
  } = useRouter()
  const {
    isLoading,
    data: { data: { result: [user] = [{}] } = {} }
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => readResource(["users", userId]),
    enabled: Boolean(userId),
    initialData: { data: { result: [{}] } }
  })
  const mutation = useMutation({
    mutationFn: (newData) => updateResource(["users", userId], newData)
  })
  const handleSubmit = async ({ username, email }) => {
    await mutation.mutateAsync({ username, email })
  }

  if (isLoading) {
    return "Loading..."
  }

  if (mutation.isSuccess) {
    return <Alert>Successfully updated your profile!</Alert>
  }

  return (
    <Formik
      initialValues={{ username: user.username, email: user.email }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}>
      <Form>
        <FormField
          name="username"
          type="username"
          placeholder="Update your username"
          label="Username"
        />
        <FormField
          name="email"
          type="email"
          placeholder="Update your e-mail"
          label="E-mail"
        />
        <div className="flex justify-center">
          <SubmitButton>Update Profile</SubmitButton>
        </div>
      </Form>
    </Formik>
  )
}

export default EditUser
