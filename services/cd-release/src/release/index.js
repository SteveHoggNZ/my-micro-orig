'use strict'

var aws = require( '../vendor/aws.js' )


const codepipeline = aws.CodePipeline()
const lambda = aws.Lambda()


module.exports.putJobSuccess = ({ jobId }) => {
  const params = {
    jobId: jobId
  }

  return new Promise(function(resolve, reject) {
    codepipeline.putJobSuccessResult(params, function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

module.exports.putJobFailure = ({ jobId }) => {
  const params = {
    failureDetails: {
      message: 'Release failure',
      type: 'ConfigurationError'
    },
    jobId: jobId
  }

  return new Promise(function(resolve, reject) {
    codepipeline.putJobFailureResult(params, function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

module.exports.listFunctions = () => {
  const params = {}

  return new Promise(function(resolve, reject) {
    lambda.listFunctions(params, function(err, data) {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

module.exports.makePrerelease = ({
  putJobSuccess = module.exports.putJobSuccess,
  putJobFailure = module.exports.putJobFailure,
  listFunctions = module.exports.listFunctions
} = {}) => ({ jobId }) => {
    return listFunctions()
      .catch((error) => {
        console.log('LF error', error)
        return putJobFailure({ jobId })
      })
      .then((data) => {
        console.log('LF data', data)
        return putJobSuccess({ jobId })
      })
  }
