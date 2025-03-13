'use strict';

/**
 * blognews service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::blognews.blognews');
