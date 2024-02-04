import BaseModel from "./BaseModel.js"
import CommentModel from "./CommentModel.js"
import UserModel from "./UserModel.js"

class PostModel extends BaseModel {
  static tableName = "posts"

  static get relationMappings() {
    return {
      author: {
        modelClass: UserModel,
        relation: BaseModel.BelongsToOneRelation,
        join: {
          from: "posts.userId",
          to: "users.id"
        }
      },
      comments: {
        modelClass: CommentModel,
        relation: BaseModel.HasManyRelation,
        join: {
          from: "posts.id",
          to: "comments.postId"
        }
      }
    }
  }
}

export default PostModel
