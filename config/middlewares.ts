export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "script-src": ["'self'", "'unsafe-inline'", `*`],
          "img-src": ["'self'", "data:", "blob:", `*`],
          "media-src": ["'self'", "data:", "blob:", `*`],
          upgradeInsecureRequests: null, 
        },
        referrerPolicy: {
          policy: ["origin"],
        },      
      },      
    },
  }, 
  { name: 'strapi::cors', 
    config: { 
      enabled: true,
      headers: ['Origin'], 
      origin: ['*'], 
    }, 
  },  
  'strapi::poweredBy',
  'strapi::query',
  {
    name: "strapi::body",
    config: {
      formLimit: "256mb", // modify form body
      jsonLimit: "256mb", // modify JSON body
      textLimit: "256mb", // modify text body
      formidable: {
        maxFileSize: 200 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
