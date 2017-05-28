'use strict'

const AWS = require('aws-sdk')

module.exports.boil = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Successfully boiled!!!',
      input: event
    })
  }

  callback(null, response)
}
