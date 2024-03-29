import BaseModel from "./BaseModel.js"
import PostModel from "./PostModel.js"
import UserModel from "./UserModel.js"

class CommentModel extends BaseModel {
  static tableName = "comments"

  static get relationMappings() {
    return {
      author: {
        modelClass: UserModel,
        relation: BaseModel.BelongsToOneRelation,
        join: {
          from: "comments.userId",
          to: "users.id"
        }
      },
      post: {
        modelClass: PostModel,
        relation: BaseModel.BelongsToOneRelation,
        join: {
          from: "comments.postId",
          to: "posts.id"
        }
      }
    }
  }
}

export default CommentModel
