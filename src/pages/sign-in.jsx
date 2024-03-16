import { useSession } from "@/web/components/SessionContext"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import Loader from "@/web/components/ui/Loader"
import ResponseError from "@/web/components/ui/ResponseError"
import SubmitButton from "@/web/components/ui/SubmitButton"
import { createResource } from "@/web/services/apiClient"
import { useMutation } from "@tanstack/react-query"
import { Formik } from "formik"
import { useRouter } from "next/router"
import { useState } from "react"
import { object, string } from "yup"

const initialValues = {
  email: "",
  password: ""
}
const validationSchema = object({
  email: string().required().label("E-mail"),
  password: string().required().label("Password")
})
const SignInPage = () => {
  const router = useRouter()
  const { signIn } = useSession()
  const { mutateAsync, error } = useMutation({
    mutationFn: (data) => createResource("sessions", data)
  })
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = async ({ email, password }) => {
    setIsLoading(true)

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
      <Loader isLoading={isLoading} />
    </>
  )
}

export default SignInPage
