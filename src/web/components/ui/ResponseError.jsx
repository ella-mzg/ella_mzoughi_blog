import Alert from "@/web/components/ui/Alert"
import getErrorFromResponse from "@/web/utils/getErrorFromResponse"

const ResponseError = ({ error }) =>
  error && <Alert variant="danger">{getErrorFromResponse(error)}</Alert>

export default ResponseError
