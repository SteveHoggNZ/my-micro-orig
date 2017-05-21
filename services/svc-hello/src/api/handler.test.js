'use strict'

const sinon = require( 'sinon' )
const expect = require( 'chai' ).expect
const AWS = require('aws-sdk')
const AWSXRay = require('aws-xray-sdk')

// Reference: https://eirikardal.no/stubbing-es2015-classes-with-sinon/
let listBuckets, s3Stub, captureAWSStub

const mockBucketList = { Buckets: [
  { Name: 'first-bucket',
       CreationDate: '2016-11-28T03:08:53.000Z' },
  { Name: 'second-bucket',
       CreationDate: '2016-11-29T00:00:00.000Z' }
] }

const mockBucketListError = {
  stack: [ 'stk1', 'stk2', 'stk3' ]
}

// === Start stub at global level ===
// stub modules before require('./handler')

// tell the stub to call the first argument
listBuckets = sinon
  .stub()
  .callsArgWith(0, null, mockBucketList)

s3Stub = sinon
  .stub(AWS, 'S3')
  .returns({ listBuckets })

captureAWSStub = sinon
  .stub(AWSXRay, 'captureAWS')
  .returns(AWS)
// === End stub at global level ===

// Handler needs to be required after stubs above
let handler = require('./handler')

// === Start Root-Level Hooks ===
// // You can stub at this level, but the "new AWS.S3" invocation needs
// // to happen in the svc_hello function if you do that otherwise
// // AWS.S3 is called before it is stubbed
// before(function() {
//   listBuckets = sinon
//    .stub()
//    .callsArgWith(0, {stack: ['err-stack']}, 'data')
//
//   s3Stub = sinon
//     .stub(AWS, 'S3')
//     .returns({ listBuckets })
//
//   captureAWSStub = sinon
//     .stub(AWSXRay, 'captureAWS')
//     .returns(AWS)
// })

afterEach(function() {
  listBuckets.resetHistory()
})

after(function() {
  captureAWSStub.restore()
  s3Stub.restore()
})
// === End Root-Level Hooks ===

// === Start Tests ===
describe('handler load', function() {
  it('should call AWSXRay.captureAWS on load', function(done) {
    expect(captureAWSStub.callCount).to.equal(1, 'captureAWS called once')
    done()
  })
  it('should call AWS.S3 on load', function(done) {
    expect(s3Stub.callCount).to.equal(1, 'S3 called once')
    done()
  })
})

describe('svc_hello', function() {
  it('should return expected body and statusCode', function(done) {
    handler.svc_hello({}, {}, (err, result) => {
      expect(s3Stub.callCount).to.equal(1, 'S3 called once')
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
      expect(err).to.not.equal(null, 'error value is not null')
      done()
    })
  })
})
// === End Tests ===
