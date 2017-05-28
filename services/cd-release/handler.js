'use strict'

const AWS = require('aws-sdk')

module.exports.prerelease = (event, context, callback) => {
  const codepipeline = new AWS.CodePipeline()

  // Retrieve the Job ID from the Lambda action
  const jobId = event["CodePipeline.job"].id

  // Notify AWS CodePipeline of a successful job
  const putJobSuccess = function(message) {
      const params = {
          jobId: jobId
      }

      codepipeline.putJobSuccessResult(params, function(err, data) {
          if(err) {
            callback(err)
          } else {
            const response = {
              statusCode: 200,
              body: JSON.stringify({
                message,
                input: event
              })
            }

            callback(null, response)
          }
      })
  }

  console.log('Code Pipeline Event:', JSON.stringify(event))

  putJobSuccess(`Successfully pre-released (pre-release version) ${process.env.SVC_VERSION}`)
}

module.exports.release = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Successfully released version ${process.env.SVC_VERSION}`,
      input: event
    })
  }

  callback(null, response)
}
