import { HttpNotFoundError } from "@/api/errors"
import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import { idValidator } from "@/utils/validators"

const handle = mw({
  POST: [
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
      const post = await PostModel.query().findById(postId)

      if (!post) {
        throw new HttpNotFoundError()
      }

      const viewCount = await PostModel.query()
        .findById(postId)
        .increment("views", 1)

      send(viewCount)
    }
  ]
})

export default handle
