const AWS = require('aws-sdk') // eslint-disable-line import/no-extraneous-dependencies

var s3 = new AWS.S3()

module.exports.list = function (bucket, path) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      MaxKeys: 1000,
      Delimiter: '/',
      Prefix: path
    }
    s3.listObjects(params, (error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
  })
}

module.exports.upload = function (bucket, path, data) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      Key: path,
      Body: data
    }
    s3.upload(params, (error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
  })
}

module.exports.folder = function (bucket, path) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      Key: path + '/'
    }
    s3.putObject(params, (error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
  })
}

module.exports.get = function (bucket, path) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      Key: path
    }
    s3.getObject(params, (error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
  })
}
