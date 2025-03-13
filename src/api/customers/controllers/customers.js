'use strict';

/**
 * customers controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::customers.customers');
