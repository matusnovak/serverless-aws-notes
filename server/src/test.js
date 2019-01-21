const dirs = require('./rest/dirs');

(async () => {
  const body = await dirs.read({
    requestContext: {
      authorizer: {
        principalId: 'admin'
      }
    },
    pathParameters: {
      prefix: 'user',
      directory: 'Hello World'
    }
  })

  console.log(body)
})()
