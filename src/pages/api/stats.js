import { HttpArgumentsError } from "@/api/errors"
import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import { idValidator } from "@/utils/validators"
import { string } from "yup"

const handle = mw({
  GET: [
    validate({
      query: {
        userId: idValidator.required(),
        type: string()
          .oneOf(["postCount", "commentCount", "viewCount"])
          .default("postCount")
      }
    }),
    async ({
      send,
      input: {
        query: { userId, type }
      },
      models: { PostModel, CommentModel }
    }) => {
      let count = 0

      if (type === "postCount") {
        count = await PostModel.query().where("userId", userId).resultSize()
      } else if (type === "commentCount") {
        count = await CommentModel.query().where("userId", userId).resultSize()
      } else if (type === "viewCount") {
        const posts = await PostModel.query().where("userId", userId)
        const totalViewCount = posts.reduce((acc, post) => acc + post.views, 0)
        count = totalViewCount
      } else {
        throw new HttpArgumentsError()
      }

      send({ count })
    }
  ]
})

export default handle
