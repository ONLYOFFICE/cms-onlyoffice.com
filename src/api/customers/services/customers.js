'use strict';

/**
 * customers service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::customers.customers');
