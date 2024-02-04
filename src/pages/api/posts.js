import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import {
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
    async ({ send, input: { body }, models: { PostModel } }) => {
      const newPost = await PostModel.query().insertAndFetch(body)

      send(newPost)
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
        query: { page }
      },
      models: { PostModel }
    }) => {
      const query = PostModel.query()
      const posts = await query.clone().page(page)
      const [{ count }] = await query.clone().count()

      send(posts, { count })
    }
  ]
})

export default handle
