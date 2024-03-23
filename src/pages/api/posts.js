import authorize from "@/api/middlewares/authorize"
import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import {
  idValidator,
  pageValidator,
  postContentValidator,
  titleValidator
} from "@/utils/validators"

const handle = mw({
  POST: [
    validate({
      body: {
        title: titleValidator.required(),
        content: postContentValidator.required()
      }
    }),
    authorize({ requiredRoles: ["administrator", "author"] }),
    async ({ send, input: { body }, models: { PostModel } }) => {
      const newPost = await PostModel.query().insertAndFetch(body)

      send(newPost)
    }
  ],
  GET: [
    validate({
      query: {
        page: pageValidator,
        userId: idValidator
      }
    }),
    async ({
      send,
      input: {
        query: { page, userId }
      },
      models: { PostModel }
    }) => {
      let query = PostModel.query()

      if (userId) {
        query = query.where("userId", userId)
      }

      const posts = await query.clone().page(page)
      const [{ count }] = await query.clone().count()

      send(posts, { count })
    }
  ]
})

export default handle
