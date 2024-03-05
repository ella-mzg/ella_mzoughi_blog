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
  ],
  GET: [
    validate({
      query: {
        postId: idValidator.required()
      }
    }),
    async ({
      send,
      input: {
        query: { postId }
      },
      models: { CommentModel }
    }) => {
      const comments = await CommentModel.query()
        .where("postId", postId)
        .withGraphFetched("[author]")
        // eslint-disable-next-line line-comment-position, no-inline-comments
        .orderBy("createdAt", "desc") // Doesn't work?

      send(comments)
    }
  ]
})

export default handle
