import config from '../config.json';
const {access_key_id, access_secret, region, bucket, cdn }= config.aws; 

module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        baseUrl: cdn,
        rootPath: env('AWS_ROOT_PATH', 'images'),
        s3Options: {
          requestHandler: new (require('@smithy/node-http-handler').NodeHttpHandler)({
            requestTimeout: env.int('AWS_S3_REQUEST_TIMEOUT', 300000),
            connectionTimeout: env.int('AWS_S3_CONNECTION_TIMEOUT', 10000),
          }),
          maxAttempts: env.int('AWS_S3_MAX_ATTEMPTS', 3),
          credentials: {
            accessKeyId: access_key_id,
            secretAccessKey: access_secret,
          },
          region: region, 
          params: {
            Bucket: bucket,
          },
        },
      },
      actionOptions: {
        upload: {
          ACL: null,
          signedUrlExpires: env('AWS_SIGNED_URL_EXPIRES', 15 * 60),
        },
        uploadStream: {
          ACL: null,
          signedUrlExpires: env('AWS_SIGNED_URL_EXPIRES', 15 * 60),
        },
        delete: {},
      },
    },
  },
});