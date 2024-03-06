import { emailValidator, passwordValidator } from "@/utils/validators"
import { useSession } from "@/web/components/SessionContext"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import ResponseError from "@/web/components/ui/ResponseError"
import SubmitButton from "@/web/components/ui/SubmitButton"
import { createResource } from "@/web/services/apiClient"
import { useMutation } from "@tanstack/react-query"
import { Formik } from "formik"
import { useRouter } from "next/router"
import { object } from "yup"

const initialValues = {
  email: "",
  password: ""
}
const validationSchema = object({
  email: emailValidator.required().label("E-mail"),
  password: passwordValidator.required().label("Password")
})
const SignInPage = () => {
  const router = useRouter()
  const { signIn } = useSession()
  const { mutateAsync, error } = useMutation({
    mutationFn: (data) => createResource("sessions", data)
  })
  const handleSubmit = async ({ email, password }) => {
    const {
      data: {
        result: [jwt]
      }
    } = await mutateAsync({ email, password })

    signIn(jwt)

    router.push("/")
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
          <div className="flex justify-center">
            <SubmitButton className="w-24">Sign In</SubmitButton>
          </div>
        </Form>
      </Formik>
    </>
  )
}

export default SignInPage

// eslint-disable-next-line no-warning-comments
// TODO: add useCallBacks
