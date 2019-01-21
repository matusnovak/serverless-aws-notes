const { ok, notFound, badRequest, unauthorized } = require('../utils/response')
const s3 = require('../utils/s3')

const S3_BUCKET_DATA = process.env.S3_BUCKET_DATA

function getPath (username, prefix, directory) {
  if (prefix === 'user') return username + '/' + directory
  else return 'shared/' + directory
}

exports.list = async function (event, context) {
  const username = event.requestContext.authorizer.principalId
  const { prefix } = event.pathParameters
  if (!username) return unauthorized('You are not logged in')
  if (prefix !== 'user' && prefix !== 'shared') return badRequest('Invalid path')

  const path = getPath(username, prefix, '')
  const objects = await s3.list(S3_BUCKET_DATA, path)
  return ok(objects['CommonPrefixes'].map(e => e['Prefix'].split('/')[1]))
}

exports.read = async function (event, context) {
  const username = event.requestContext.authorizer.principalId
  const { prefix, directory } = event.pathParameters
  if (!username) return unauthorized('You are not logged in')
  if (prefix !== 'user' && prefix !== 'shared') return badRequest('Invalid path')

  const path = getPath(username, prefix, decodeURIComponent(directory)) + '/'
  const objects = await s3.list(S3_BUCKET_DATA, path)
  return ok(objects['Contents'].filter(e => e['Size'] > 0).map(e => e['Key'].split('/').pop()))
}

exports.create = async function (event, context) {
  const username = event.requestContext.authorizer.principalId
  const { prefix } = event.pathParameters
  const body = JSON.parse(event.body)
  if (!username) return unauthorized('You are not logged in')
  if (prefix !== 'user' && prefix !== 'shared') return badRequest('Invalid path')
  if (!body.name) return badRequest('Name is required')
  if (!new RegExp('[a-zA-Z 0-9-_]+').test(body.name)) return badRequest('Name must contain only letters, numbers, space, underscore, or a dash')

  const path = getPath(username, prefix, body.name)
  await s3.folder(S3_BUCKET_DATA, path)
  return ok({
    name: body.name
  })
}

exports.update = async function (event, context) {
  const username = event.requestContext.authorizer.principalId
  const { prefix, directory } = event.pathParameters
  if (!username) return unauthorized('You are not logged in')

  return ok({})
}

exports.delete = async function (event, context) {
  const username = event.requestContext.authorizer.principalId
  const { prefix, directory } = event.pathParameters
  if (!username) return unauthorized('You are not logged in')

  return ok({})
}
