const { aws } = require("../config.json");
const { access_key_id, access_secret, region, bucket, cms_cdn } = aws;


module.exports = () => ({
  upload: {
    config: {
      provider: "strapi-provider-upload-aws-s3-advanced",
      providerOptions: {
        accessKeyId: access_key_id,
        secretAccessKey: access_secret,
        region: region,
        params: {
          Bucket: bucket,
        },
        baseUrl: cms_cdn,
      },     
    },    
  },
});



