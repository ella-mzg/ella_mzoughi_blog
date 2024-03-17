import authorize from "@/api/middlewares/authorize"
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
  PATCH: [
    validate({
      query: {
        commentId: idValidator.required()
      },
      body: {
        content: commentContentValidator.required()
      }
    }),
    authorize({
      requiredRoles: ["administrator"],
      checkUserId: true,
      actionContext: "comment"
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
  ],
  DELETE: [
    validate({
      query: {
        commentId: idValidator.required()
      }
    }),
    authorize({
      requiredRoles: ["administrator"],
      checkUserId: true,
      actionContext: "comment"
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
  ]
})

export default handle
