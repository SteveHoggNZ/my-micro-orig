'use strict'

const AWS = require('aws-sdk')

module.exports.sup = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Sup, 4th time a charm!!!',
      input: event
    })
  }

  callback(null, response)
}
