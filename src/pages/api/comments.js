import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import { commentContentValidator, idValidator } from "@/utils/validators"

const handle = mw({
  POST: [
    validate({
      body: {
        postId: idValidator.required(),
        content: commentContentValidator.required(),
        userId: idValidator.required()
      }
    }),
    async ({ send, input: { body }, models: { CommentModel } }) => {
      const newComment = await CommentModel.query().insertAndFetch(body)

      send(newComment)
    }
  ]
})

export default handle
