import workConfig from '../../../../work.config.json';
import { createRouter } from '@tanstack/react-router';
import { routeTree } from '../routeTree.gen';

function rewriteInitRootUser(pathname: string) {
  return pathname;
}

export const router = createRouter({
  routeTree,
  basepath: `/${workConfig.cms_admin_path}`,
  defaultPreload: 'intent',
  scrollRestoration: true,
  rewrite: {
    input: ({ url }) => {
      const nextPathname = rewriteInitRootUser(url.pathname);
      if (nextPathname !== url.pathname) {
        url.pathname = nextPathname;
      }
      return url;
    },
    output: ({ url }) => {
      const nextPathname = rewriteInitRootUser(url.pathname);
      if (nextPathname !== url.pathname) {
        url.pathname = nextPathname;
      }
      return url;
    },
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
