'use strict'

var sinon = require( 'sinon' )
var proxyquire = require("proxyquire")
var expect = require( 'chai' ).expect
// var AWS = require('aws-sdk')
// var AWSXRay = require('aws-xray-sdk')

proxyquire = proxyquire.noPreserveCache()

// Reference: https://eirikardal.no/stubbing-es2015-classes-with-sinon/
const mockBucketList = { Buckets: [
  { Name: 'first-bucket',
       CreationDate: '2016-11-28T03:08:53.000Z' },
  { Name: 'second-bucket',
       CreationDate: '2016-11-29T00:00:00.000Z' }
] }

const mockBucketListError = {
  stack: [ 'stk1', 'stk2', 'stk3' ]
}


// === Start Define stubs and include handler module ===
const stubs = {
  'aws-xray-sdk-core': {
    captureAWS: sinon.stub().returnsArg(0)
  },
  'aws-sdk': {
    S3: sinon.stub()
  },
  // as per http://gyandeeps.com/console-stubbing/
  '../logging': {
    info: sinon.spy(),
    error: sinon.spy()
  }
}

const listBuckets = sinon
  .stub()
  .callsArgWith(0, null, mockBucketList)

// Set the prototype's listBuckets method. This allows stub to be used as a
// constructor i.e. new AWS.S3
//
// The other option is to declare it as a function e.g.
// S3: function () {
//   this.listBuckets = listBuckets
// }
stubs['aws-sdk'].S3.prototype.listBuckets = listBuckets

let handler = proxyquire('./handler', stubs)
// === End Define stubs and include handler module ===


// === Start Root-Level Hooks ===
afterEach(function() {
  listBuckets.resetHistory()
})
// === End Root-Level Hooks ===


// === Start Tests ===
describe('handler load', function() {
  it('should call AWSXRay.captureAWS on load', function(done) {
    expect(stubs['aws-xray-sdk-core'].captureAWS.callCount)
      .to.equal(1, 'captureAWS called once')
    done()
  })
  it('should call AWS.S3 on load', function(done) {
    expect(stubs['aws-sdk'].S3.callCount).to.equal(1, 'S3 called once')
    done()
  })
})

describe('svc_hello', function() {
  it('should return expected body and statusCode', function(done) {
    handler.svc_hello({}, {}, (err, result) => {
      // expect(s3Stub.callCount).to.equal(1, 'S3 called once')
      expect(listBuckets.callCount).to.equal(1, 'listBuckets called once')

      expect(err).to.equal(null, 'error value is null')

      const bucketCount = mockBucketList.Buckets.length
      expect(result).to.deep.equal({
        "body": "{\"message\":\"Hello, you have " + bucketCount + " buckets\",\"input\":{}}",
        "statusCode": 200
      }, 'result value is correct')
      done()
    })
  })

  it('should return expected body and statusCode on error', function(done) {
    listBuckets.callsArgWith(0, mockBucketListError)

    handler.svc_hello({}, {}, (err, result) => {
      expect(stubs['../logging'].error.callCount)
        .to.equal(1, 'log.error called once')
      expect(err).to.not.equal(null, 'error value is not null')
      done()
    })
  })
})
// === End Tests ===
