'use strict'

const AWS = require('aws-sdk')

module.exports.boil = (event, context, callback) => {
  console.log(process.env)
  const version = process.env.SVC_VERSION

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Successfully boiled version ${version}`,
      input: event
    })
  }

  callback(null, response)
}
SVC_VERSION
