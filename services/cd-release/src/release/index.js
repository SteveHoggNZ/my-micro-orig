'use strict'

var aws = require( '../vendor/aws.js' )
const log = require('../logging')


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

module.exports.putJobFailure = ({ jobId, invokeid }) => {
  const params = {
    failureDetails: {
      message: 'Release failure',
      type: 'ConfigurationError',
      externalExecutionId: invokeid
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
} = {}) => ({ jobId, invokeid }) => {
    return listFunctions()
      .then((data) => {
        log.info('listFunctions', data)
        return putJobSuccess({ jobId })
      })
      .catch((error) => {
        log.error('listFunctions error', error)
        return putJobFailure({ jobId, invokeid })
      })
  }
