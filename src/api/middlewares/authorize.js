/* eslint-disable complexity */
/* eslint-disable no-console */
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
      console.error("No authorization token provided")
      throw new HttpForbiddenError("No authorization token provided")
    }

    try {
      const decodedToken = jsonwebtoken.verify(
        authorization,
        config.security.jwt.secret
      )
      const requesterId = decodedToken.payload.user.id.toString()
      const requesterRole = decodedToken.payload.user.role

      console.log(
        `Decoded requester ID: ${requesterId}, requester Role: ${requesterRole}`
      )

      const isRoleAuthorized =
        requiredRoles.length === 0 || requiredRoles.includes(requesterRole)

      let isAuthorized = isRoleAuthorized

      let resourceId = null

      if (actionContext === "post" && req.query.postId) {
        const post = await PostModel.query().findById(req.query.postId)
        resourceId = post.userId.toString()
        console.log(`Post userId: ${post.userId}`)
      }

      if (actionContext === "comment" && req.query.commentId) {
        const comment = await CommentModel.query().findById(req.query.commentId)
        resourceId = comment.userId.toString()
        console.log(`Comment userId: ${comment.userId}`)
      }

      if (checkUserId) {
        const userIdFromSource =
          actionContext === "user" ? req.query.userId?.toString() : resourceId
        const isUserIdMatch = userIdFromSource === requesterId
        console.log("req.query", req.query)
        console.log("userIdFromSource", userIdFromSource)
        console.log("isRoleAuthorized", isRoleAuthorized)
        console.log("isUserIdMatch", isUserIdMatch)

        isAuthorized ||= isUserIdMatch
      } else {
        console.log("isRoleAuthorized", isRoleAuthorized)
      }

      if (isAuthorized) {
        await next()
      } else {
        console.error("Not authorized due to role or user ID mismatch")
        throw new HttpForbiddenError("Not authorized")
      }
    } catch (error) {
      console.error("Authorization failed with error: ", error)
      throw new HttpForbiddenError("Invalid token or insufficient permissions")
    }
  }

export default authorize
