import { emailValidator, usernameValidator } from "@/utils/validators"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import SubmitButton from "@/web/components/ui/SubmitButton"
import { useReadUser, useUpdateUser } from "@/web/hooks/useUserActions"
import { Formik } from "formik"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { object } from "yup"

const validationSchema = object({
  username: usernameValidator.required().label("Username"),
  email: emailValidator.required().label("E-mail")
})
const EditUser = () => {
  const router = useRouter()
  const { userId } = router.query
  const { isLoading, data } = useReadUser(userId)
  const updateUserMutation = useUpdateUser()
  const [initialValues, setInitialValues] = useState({
    username: "",
    email: ""
  })

  useEffect(() => {
    if (!isLoading && data?.data?.result.length > 0) {
      const [user] = data.data.result
      setInitialValues({
        username: user.username || "",
        email: user.email || ""
      })
    }
  }, [isLoading, data])

  const handleSubmit = async (values, { setSubmitting }) => {
    await updateUserMutation.mutateAsync({ userId, newData: values })
    setSubmitting(false)
  }

  if (isLoading) {
    return <div className="text-center p-32 animate-bounce">Loading...</div>
  }

  return (
    <div>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <FormField
              name="username"
              type="text"
              label="Username"
              placeholder="Update your username"
            />
            <FormField
              name="email"
              type="email"
              label="E-mail"
              placeholder="Update your e-mail"
            />
            <div className="flex justify-center">
              <SubmitButton disabled={isSubmitting}>
                Update Profile
              </SubmitButton>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default EditUser
