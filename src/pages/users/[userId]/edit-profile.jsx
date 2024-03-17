import { emailValidator, usernameValidator } from "@/utils/validators"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import Loader from "@/web/components/ui/Loader"
import SubmitButton from "@/web/components/ui/SubmitButton"
import useAuthorization from "@/web/hooks/useAuthorization"
import { useReadUser, useUpdateUser } from "@/web/hooks/useUserActions"
import { Formik } from "formik"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { object } from "yup"

const validationSchema = object({
  username: usernameValidator.required().label("Username"),
  email: emailValidator.required().label("E-mail")
})
const EditProfile = () => {
  const router = useRouter()
  const { userId } = router.query
  const { data, isLoading } = useReadUser(userId)
  const [user] = data?.data?.result || []
  const [initialValues, setInitialValues] = useState({
    username: "",
    email: ""
  })
  const [error, setError] = useState("")
  const { AuthorizationAlert } = useAuthorization({
    userId,
    allowedRoles: ["administrator"]
  })

  useEffect(() => {
    if (user) {
      setInitialValues({
        username: user.username || "",
        email: user.email || ""
      })
    }
  }, [user])

  const { mutateAsync: updateUser, isSuccess } = useUpdateUser()

  useEffect(() => {
    if (isSuccess) {
      router.push(`/users/${userId}`)
    }
  }, [isSuccess, userId, router])

  const handleSubmit = async (values) => {
    try {
      await updateUser({ userId, newData: values })
    } catch (updateError) {
      setError("Failed to update user.")
    }
  }

  return (
    <AuthorizationAlert>
      <Loader isLoading={isLoading || !user} />
      {!isLoading && user && (
        <>
          {error && <p className="text-red-500">{error}</p>}
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
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
                <SubmitButton>Update Profile</SubmitButton>
              </div>
            </Form>
          </Formik>
        </>
      )}
    </AuthorizationAlert>
  )
}

export default EditProfile
