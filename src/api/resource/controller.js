import _ from 'lodash'
import request from 'request-promise'
import { success, notFound } from '../../services/response/'
import { Resource } from '.'
import { readHtml } from '../../utils/html-parser'

export const create = ({ body }, res, next) =>
  Resource.create(body)
    .then((resource) => resource.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Resource.find(query, select, cursor)
    .then((resources) => resources.map((resource) => resource.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Resource.findById(params.id)
    .then(notFound(res))
    .then((resource) => resource ? resource.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ body, params }, res, next) =>
  Resource.findById(params.id)
    .then(notFound(res))
    .then((resource) => resource ? _.merge(resource, body).save() : null)
    .then((resource) => resource ? resource.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Resource.findById(params.id)
    .then(notFound(res))
    .then((resource) => resource ? resource.remove() : null)
    .then(success(res, 204))
    .catch(next)

export const interpret = ({ body }, res, next) => {
  console.log(body)
  return request(body.url)
    .then(readHtml.bind(this))
    .then(success(res))
    .catch(next)
}
