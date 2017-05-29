'use strict'


const AWS = require('aws-sdk')


module.exports = {
  CodePipeline: () => new AWS.CodePipeline(),
  Lambda: () => new AWS.Lambda()
}
