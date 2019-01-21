const { ok, notFound, badRequest, unauthorized } = require('../utils/response')
const s3 = require('../utils/s3')

const S3_BUCKET_DATA = process.env.S3_BUCKET_DATA

function getPath (username, prefix, directory, file) {
  if (prefix === 'user') return username + '/' + directory + '/' + file
  else return 'shared/' + directory
}

exports.read = async function (event, context) {
  const username = event.requestContext.authorizer.principalId
  const { prefix, directory, file } = event.pathParameters
  if (!username) return unauthorized('You are not logged in')

  const path = getPath(username, prefix, decodeURIComponent(directory), decodeURIComponent(file) + '.html')
  const object = await s3.get(S3_BUCKET_DATA, path)
  console.log('file:', object)
  return ok({
    content: object['Body'].toString('utf8')
  })
}

exports.create = async function (event, context) {
  const username = event.requestContext.authorizer.principalId
  const { prefix, directory } = event.pathParameters
  const body = JSON.parse(event.body)
  if (!body.name) return badRequest('Name is required')
  if (!username) return unauthorized('You are not logged in')
  if (prefix !== 'user' && prefix !== 'shared') return badRequest('Invalid path')
  if (!new RegExp('[a-zA-Z 0-9-_]+').test(body.name)) return badRequest('Name must contain only letters, numbers, space, underscore, or a dash')

  const path = getPath(username, prefix, decodeURIComponent(directory), body.name + '.html')
  const content = '<p></p>'
  await s3.upload(S3_BUCKET_DATA, path, content)
  return ok({
    name: body.name + '.html'
  })
}

exports.update = async function (event, context) {
  const username = event.requestContext.authorizer.principalId
  const { prefix, directory, file } = event.pathParameters
  const body = JSON.parse(event.body)
  if (!body.content) return badRequest('Content is required')
  if (!username) return unauthorized('You are not logged in')
  if (prefix !== 'user' && prefix !== 'shared') return badRequest('Invalid path')

  const path = getPath(username, prefix, decodeURIComponent(directory), decodeURIComponent(file) + '.html')
  await s3.upload(S3_BUCKET_DATA, path, body.content)
  return ok({})
}

exports.delete = async function (event, context) {
  const username = event.requestContext.authorizer.principalId
  if (!username) return unauthorized('You are not logged in')

  return ok({})
}
