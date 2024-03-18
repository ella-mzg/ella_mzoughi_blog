import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import {
  commentContentValidator,
  idValidator,
  pageValidator
} from "@/utils/validators"

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
  ],
  GET: [
    validate({
      query: {
        page: pageValidator.required()
      }
    }),
    async ({
      send,
      input: {
        query: { postId }
      },
      models: { CommentModel }
    }) => {
      const comments = await CommentModel.query().where("postId", postId)
      send(comments)
    }
  ]
})

export default handle
