const { aws } = require("../config.json");

module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "strapi-provider-upload-aws-s3-advanced",
      providerOptions: {
        accessKeyId: env("  ", aws.access_key_id),
        secretAccessKey: env("AWS_ACCESS_SECRET", aws.access_secret),
        region: env("AWS_REGION", aws.region),
        params: {
          Bucket: env("AWS_BUCKET_NAME", aws.bucket),
        },
        baseUrl: env("CDN_BASE_URL", aws.cdn),
      },     
    },    
  },
});



