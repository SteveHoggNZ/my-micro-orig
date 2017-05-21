'use strict'

const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const s3 = new AWS.S3({ signatureVersion: 'v4' })

module.exports.svc_hello = (event, context, callback) => {
  s3.listBuckets(function(err, data) {
    let response

    if (err) {
      console.error(err)
      callback('Opps, got an error when listing buckets')
    } else {
      const bucketCount = data.Buckets.length
      response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Hello, you have ' + bucketCount + ' buckets',
          input: event
        })
      }
      callback(null, response)
    }
  })

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
}
