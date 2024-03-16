import authorize from "@/api/middlewares/authorize"
import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import {
  booleanValidator,
  emailValidator,
  idValidator,
  usernameValidator
} from "@/utils/validators"

const handle = mw({
  GET: [
    validate({
      query: {
        userId: idValidator.required()
      }
    }),
    async ({
      send,
      input: {
        query: { userId }
      },
      models: { UserModel }
    }) => {
      const user = await UserModel.query()
        .findById(userId)
        .withGraphFetched("posts")
        .throwIfNotFound()

      send(user)
    }
  ],
  PATCH: [
    validate({
      query: {
        userId: idValidator.required()
      },
      body: {
        username: usernameValidator,
        email: emailValidator,
        isDisabled: booleanValidator.optional()
      }
    }),
    authorize({
      requiredRoles: ["administrator"],
      checkUserId: true,
      actionContext: "user"
    }),
    async ({
      send,
      input: {
        query: { userId },
        body
      },
      models: { UserModel }
    }) => {
      const updatedUser = await UserModel.query()
        .updateAndFetchById(userId, body)
        .throwIfNotFound()

      send(updatedUser)
    }
  ],
  DELETE: [
    validate({
      query: {
        userId: idValidator.required()
      }
    }),
    authorize({ requiredRoles: ["administrator"] }),
    async ({
      send,
      input: {
        query: { userId }
      },
      models: { UserModel }
    }) => {
      const user = await UserModel.query().findById(userId).throwIfNotFound()

      await user.$query().delete()

      send(user)
    }
  ]
})

export default handle
