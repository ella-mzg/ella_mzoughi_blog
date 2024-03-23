import {
  emailValidator,
  passwordValidator,
  usernameValidator
} from "@/utils/validators"
import Alert from "@/web/components/ui/Alert"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import Loader from "@/web/components/ui/Loader"
import ResponseError from "@/web/components/ui/ResponseError"
import SubmitButton from "@/web/components/ui/SubmitButton"
import { createResource } from "@/web/services/apiClient"
import { useMutation } from "@tanstack/react-query"
import { Formik } from "formik"
import { useState } from "react"
import { object } from "yup"

const initialValues = {
  username: "",
  email: "",
  password: ""
}
const validationSchema = object({
  username: usernameValidator.required().label("Username"),
  email: emailValidator.required().label("E-mail"),
  password: passwordValidator.required().label("Password")
})
const SignUpPage = () => {
  const { mutateAsync, error, isSuccess } = useMutation({
    mutationFn: (data) => createResource("users", data)
  })
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = async ({ username, email, password }) => {
    setIsLoading(true)

    await mutateAsync({ username, email, password })
  }

  if (isSuccess) {
    return <Alert>Successfully created your account!</Alert>
  }

  return (
    <>
      <ResponseError error={error} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        <Form>
          <FormField
            name="username"
            type="username"
            placeholder="Choose your username"
            label="Username"
          />
          <FormField
            name="email"
            type="email"
            placeholder="Enter your e-mail"
            label="E-mail"
          />
          <FormField
            name="password"
            type="password"
            placeholder="Enter your password"
            label="Password"
          />
          <div className="flex justify-center mt-5">
            <SubmitButton className="w-24">Sign Up</SubmitButton>
          </div>
        </Form>
      </Formik>
      <Loader isLoading={isLoading && !error} />
    </>
  )
}

export default SignUpPage
