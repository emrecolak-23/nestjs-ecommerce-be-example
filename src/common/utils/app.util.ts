import { Router } from 'express';

export const getAllRoutes = (router: Router) => {
  console.log(router.stack, 'router.stack');
  return {
    routes: router.stack
      .map((layer) => {
        console.log(layer, 'layer');
        if (layer.route) {
          const path = layer.route?.path;
          const method = layer.route?.stack[0].method;
          return `${method.toUpperCase()} ${path}`;
        }
      })
      .filter((item) => item !== undefined),
  };
};
