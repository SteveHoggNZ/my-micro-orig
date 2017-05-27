'use strict'

// Reference:
// http://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html

module.exports.codepipeline_log = (event, context, callback) => {
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

  putJobSuccess('Event logged')
}
