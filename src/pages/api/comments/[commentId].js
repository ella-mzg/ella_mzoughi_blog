import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import { commentContentValidator, idValidator } from "@/utils/validators"

const handle = mw({
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
        .throwIfNotFound()
      send(comments)
    }
  ],
  DELETE: [
    validate({
      query: {
        commentId: idValidator.required()
      }
    }),
    async ({
      send,
      input: {
        query: { commentId }
      },
      models: { CommentModel }
    }) => {
      const comment = await CommentModel.query()
        .findById(commentId)
        .throwIfNotFound()

      await comment.$query().delete()

      send(comment)
    }
  ],
  PATCH: [
    validate({
      query: {
        commentId: idValidator.required()
      },
      body: {
        content: commentContentValidator.required()
      }
    }),
    async ({
      send,
      input: {
        query: { commentId },
        body: { content }
      },
      models: { CommentModel }
    }) => {
      const updatedComment = await CommentModel.query()
        .patchAndFetchById(commentId, { content })
        .throwIfNotFound()

      send(updatedComment)
    }
  ]
})

export default handle
