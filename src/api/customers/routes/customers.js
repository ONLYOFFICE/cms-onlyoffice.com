'use strict';

/**
 * customers router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::customers.customers');
