/* eslint-disable complexity */
import config from "@/api/config"
import { HttpForbiddenError } from "@/api/errors"
import CommentModel from "@/db/models/CommentModel"
import PostModel from "@/db/models/PostModel"
import jsonwebtoken from "jsonwebtoken"

const authorize =
  ({ requiredRoles = [], checkUserId = false, actionContext = null } = {}) =>
  async ({ req, next }) => {
    const { authorization } = req.headers

    if (!authorization) {
      throw new HttpForbiddenError("No authorization token provided")
    }

    try {
      const decodedToken = jsonwebtoken.verify(
        authorization,
        config.security.jwt.secret
      )
      const requesterId = decodedToken.payload.user.id.toString()
      const requesterRole = decodedToken.payload.user.role
      const isRoleAuthorized =
        requiredRoles.length === 0 || requiredRoles.includes(requesterRole)

      let isAuthorized = isRoleAuthorized

      let resourceId = null

      if (actionContext === "post" && req.query.postId) {
        const post = await PostModel.query().findById(req.query.postId)
        resourceId = post.userId.toString()
      }

      if (actionContext === "comment" && req.query.commentId) {
        const comment = await CommentModel.query().findById(req.query.commentId)
        resourceId = comment.userId.toString()
      }

      if (checkUserId) {
        const userIdFromSource =
          actionContext === "user" ? req.query.userId?.toString() : resourceId
        const isUserIdMatch = userIdFromSource === requesterId

        isAuthorized ||= isUserIdMatch
      }

      if (isAuthorized) {
        await next()
      } else {
        throw new HttpForbiddenError("Not authorized")
      }
    } catch (error) {
      throw new HttpForbiddenError("Invalid token or insufficient permissions")
    }
  }

export default authorize
