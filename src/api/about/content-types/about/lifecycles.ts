export default {
  async afterUpdate(event) {
    const { result, params } = event;

    if (result && params?.data?.publishedAt) {
      const locale = result.locale || "en";

      try {
        await strapi.plugins["webhooks"].service("webhooks").triggerWebhooks({
          model: "about",
          entry: {
            locale: locale,
          },
        });
      } catch (error) {
        strapi.log.error("Failed to trigger webhook:", error);
      }
    }
  },

  async afterCreate(event) {
    const { result } = event;

    if (result && result.publishedAt) {
      const locale = result.locale || "en";

      try {
        await strapi.plugins["webhooks"].service("webhooks").triggerWebhooks({
          model: "about",
          entry: {
            locale: locale,
          },
        });
      } catch (error) {
        strapi.log.error("Failed to trigger webhook:", error);
      }
    }
  },
};
