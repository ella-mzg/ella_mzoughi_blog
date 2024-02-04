import config from "@/web/config"
import { merge } from "@corex/deepmerge"
import axios from "axios"

const apiClient = (url, data, options) => {
  const jwt = localStorage.getItem(config.security.session.cookie.key)
  const headers = jwt ? { authorization: jwt } : {}

  if (!options) {
    return axios(url, merge([data, { headers }, { withCredentials: true }]))
  }

  return axios(url, merge([options, { headers, data, withCredentials: true }]))
}
const getUrl = (resource) => {
  if (!Array.isArray(resource)) {
    return `/api/${resource}`
  }

  const [resourceName, resourceId] = resource

  return `/api/${resourceName}/${resourceId}`
}
const makeResourceAction = (method, hasData = true) =>
  hasData
    ? (resource, data, options) =>
        apiClient(getUrl(resource), data, { method, ...options })
    : (resource, options) => apiClient(getUrl(resource), { method, ...options })

export const readResource = makeResourceAction("GET", false)
export const createResource = makeResourceAction("POST")
export const updateResource = makeResourceAction("PATCH")
export const deleteResource = makeResourceAction("DELETE", false)
