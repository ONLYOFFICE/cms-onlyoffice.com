export default (plugin: any) => {
  console.log('[UPLOAD-EXTENSION] Loading upload extension...');
  console.log('[UPLOAD-EXTENSION] Plugin controllers:', Object.keys(plugin.controllers || {}));
  console.log('[UPLOAD-EXTENSION] content-api methods:', Object.keys(plugin.controllers['content-api'] || {}));
  console.log('[UPLOAD-EXTENSION] admin-upload methods:', Object.keys(plugin.controllers['admin-upload'] || {}));
  const applyPathLogic = (ctx: any) => {
    console.log('[PATH-LOGIC] Starting applyPathLogic');
    const body: any = ctx.request?.body || {};
    let ref: string | undefined = body?.ref;
    console.log('[PATH-LOGIC] Initial ref from body:', ref);

    const filesInput = (ctx.request as any).files;
    const files = filesInput?.files ?? filesInput;
    console.log('[PATH-LOGIC] Files detected:', !!files, Array.isArray(files) ? files.length : 'single file');

    const rawPath: string | undefined = (ctx.query?.path as string) || (body?.path as string);
    const normalizedPath = rawPath
      ? String(rawPath).trim().replace(/^\/+/, '').replace(/\/+$/, '')
      : undefined;

    const setPath = (file: any, path: string) => {
      if (!file?.path) file.path = path;
    };

    if (normalizedPath && files) {
      // Reflect desired path into body and query as well
      try { (ctx.request.body as any).path = normalizedPath; } catch {}
      try { (ctx.query as any).path = normalizedPath; } catch {}
      try { strapi.log.info?.(`[upload-path] explicit path=\"${normalizedPath}\"`); } catch {}
      if (Array.isArray(files)) {
        files.forEach((f) => setPath(f, normalizedPath));
      } else if (typeof files === 'object') {
        if (Array.isArray((files as any).files)) {
          (files as any).files.forEach((f: any) => setPath(f, normalizedPath));
        } else {
          setPath(files, normalizedPath);
        }
      }
      return;
    }

    const mapByRef: Record<string, string> = {
      'api::customer.customer': 'customers',
      'api::event.event': 'events',
      'api::partner.partner': 'partners',
      'api::webinar.webinar': 'webinars',
    };

    if (!ref) {
      console.log('[PATH-LOGIC] No ref found, checking referer');
      const referer: string | undefined = (ctx.headers?.referer as string) || ctx.get?.('referer');
      console.log('[PATH-LOGIC] Referer header:', referer);
      if (referer) {
        try {
          const decoded = decodeURIComponent(referer);
          console.log('[PATH-LOGIC] Decoded referer:', decoded);
          try { strapi.log.info?.(`[upload-path] referer="${decoded}"`); } catch {}
          const m = decoded.match(/content-manager\/collection-types\/(api::[^\/?#]+)/i);
          if (m && m[1]) {
            ref = m[1];
            console.log('[PATH-LOGIC] Extracted ref from URL pattern:', ref);
          }
          if (!ref) {
            console.log('[PATH-LOGIC] No ref from pattern, trying keyword detection');
            const lower = decoded.toLowerCase();
            if (lower.includes('/webinars')) ref = 'api::webinar.webinar';
            else if (lower.includes('/partners')) ref = 'api::partner.partner';
            else if (lower.includes('/events')) ref = 'api::event.event';
            else if (lower.includes('/customers')) ref = 'api::customer.customer';
            console.log('[PATH-LOGIC] Keyword-based ref detection result:', ref);
          }
        } catch (e) {
          console.log('[PATH-LOGIC] Error processing referer:', e);
          try { strapi.log.debug?.(`[upload-path] error processing referer: ${e}`); } catch {}
        }
      }
    }

    const target = ref ? mapByRef[ref] : undefined;
    console.log('[PATH-LOGIC] Final ref:', ref, 'target folder:', target);
    if (target && files) {
      console.log('[PATH-LOGIC] Setting path to:', target);
      try { strapi.log.info?.(`[upload-path] resolved ref="${ref}" -> folder="${target}"`); } catch {}
      try { (ctx.request.body as any).path = target; } catch {}
      try { (ctx.query as any).path = target; } catch {}
      const ensurePath = (file: any) => {
        console.log('[PATH-LOGIC] Setting file.path to:', target, 'for file:', file?.name || 'unknown');
        if (!file.path) file.path = target;
      };
      if (Array.isArray(files)) {
        files.forEach(ensurePath);
      } else if (typeof files === 'object') {
        if (Array.isArray((files as any).files)) {
          (files as any).files.forEach(ensurePath);
        } else {
          ensurePath(files);
        }
      }
    } else {
      console.log('[PATH-LOGIC] No target found or no files - skipping path assignment');
    }
  };

  if (plugin.controllers['admin-upload']?.upload) {
    const originalUpload = plugin.controllers['admin-upload'].upload;
    plugin.controllers['admin-upload'].upload = async function(ctx: any) {
      try {
        console.log('[UPLOAD-DEBUG] Starting upload processing');
        console.log('[UPLOAD-DEBUG] Request body:', JSON.stringify(ctx.request?.body || {}, null, 2));
        console.log('[UPLOAD-DEBUG] Request headers referer:', ctx.headers?.referer);
        applyPathLogic(ctx);
      } catch (e) {
        console.log('[UPLOAD-DEBUG] Error in applyPathLogic:', e);
        try { strapi.log.debug?.(`[upload-wrapper] error: ${e}`); } catch {}
      }

      return await originalUpload.call(this, ctx);
    };
  }


  plugin.controllers.partners = plugin.controllers.partners || {};
  plugin.controllers.partners.upload = async (ctx: any) => {
    const filesInput = (ctx.request as any).files;

    const files = filesInput?.files ?? filesInput;

    if (!files) {
      ctx.throw(400, 'No files provided');
      return;
    }

    const setPath = (file: any) => {
      file.path = 'partners';
    };

    if (Array.isArray(files)) {
      files.forEach(setPath);
    } else if (typeof files === 'object') {
      if (Array.isArray((files as any).files)) {
        (files as any).files.forEach(setPath);
      } else {
        setPath(files);
      }
    }

    return plugin.controllers['content-api'].upload(ctx);
  };

  plugin.controllers.partners.pathUpload = async (ctx: any) => {
    const filesInput = (ctx.request as any).files;
    const files = filesInput?.files ?? filesInput;

    if (!files) {
      ctx.throw(400, 'No files provided');
      return;
    }

    const rawPath: string | undefined = (ctx.query?.path as string) || (ctx.request?.body?.path as string);
    if (!rawPath) {
      ctx.throw(400, 'Missing path query parameter');
      return;
    }

    const normalized = String(rawPath).trim().replace(/^\/+/, '').replace(/\/+$/,'');
    if (!normalized) {
      ctx.throw(400, 'Invalid path');
      return;
    }

    const setPath = (file: any) => {
      file.path = normalized;
    };

    if (Array.isArray(files)) {
      files.forEach(setPath);
    } else if (typeof files === 'object') {
      if (Array.isArray((files as any).files)) {
        (files as any).files.forEach(setPath);
      } else {
        setPath(files);
      }
    }

    return plugin.controllers['content-api'].upload(ctx);
  };

  plugin.routes['content-api'].routes.push({
    method: 'POST',
    path: '/upload/partners',
    handler: 'partners.upload',
    config: {
      middlewares: [],
      policies: [],
    },
  });

  plugin.routes['content-api'].routes.push({
    method: 'POST',
    path: '/upload/with-path',
    handler: 'partners.pathUpload',
    config: {
      middlewares: [],
      policies: [],
    },
  });

  return plugin;
};

