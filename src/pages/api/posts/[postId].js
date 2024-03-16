import authorize from "@/api/middlewares/authorize"
import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import {
  idValidator,
  postContentValidator,
  titleValidator
} from "@/utils/validators"

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
      models: { PostModel }
    }) => {
      const post = await PostModel.query()
        .findById(postId)
        .withGraphFetched("[author, comments.author]")
        .throwIfNotFound()
      send(post)
    }
  ],
  PATCH: [
    validate({
      query: {
        postId: idValidator.required()
      },
      body: {
        title: titleValidator,
        content: postContentValidator
      }
    }),
    authorize({
      requiredRoles: ["administrator"],
      checkUserId: true,
      actionContext: "post"
    }),
    async ({
      send,
      input: {
        query: { postId },
        body
      },
      models: { PostModel }
    }) => {
      const updatedPost = await PostModel.query()
        .updateAndFetchById(postId, body)
        .throwIfNotFound()

      send(updatedPost)
    }
  ],
  DELETE: [
    validate({
      query: {
        postId: idValidator.required()
      }
    }),
    authorize({
      requiredRoles: ["administrator"],
      checkUserId: true,
      actionContext: "post"
    }),
    async ({
      send,
      input: {
        query: { postId }
      },
      models: { PostModel }
    }) => {
      const post = await PostModel.query().findById(postId).throwIfNotFound()

      await post.$query().delete()

      send(post)
    }
  ]
})

export default handle
