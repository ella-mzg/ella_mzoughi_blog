const getErrorFromResponse = ({
  response: {
    data: { error },
  },
}) => error

export default getErrorFromResponse
