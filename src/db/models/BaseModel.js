import BaseQueryBuilder from "@/db/BaseQueryBuilder"
import { Model } from "objection"

class BaseModel extends Model {
  static QueryBuilder = BaseQueryBuilder
}

export default BaseModel
