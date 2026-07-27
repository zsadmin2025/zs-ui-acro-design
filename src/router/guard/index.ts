import type { Router } from 'vue-router';
import { setRouteEmitter } from '@/utils/route-listener';
import usePageLoading from '@/hooks/pageLoading';
import setupPermissionGuard from './permission';

function setupPageGuard(router: Router) {
  const { setPageLoading } = usePageLoading();

  router.beforeEach(async (to) => {
    // emit route change and show global loading state
    setRouteEmitter(to);
    setPageLoading(true);
  });

  router.afterEach(() => {
    setPageLoading(false);
  });

  router.onError(() => {
    setPageLoading(false);
  });
}

export default function createRouteGuard(router: Router) {
  setupPageGuard(router);
  setupPermissionGuard(router);
}
