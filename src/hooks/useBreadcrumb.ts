import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const useBreadcrumb = () => {
  const route = useRoute();
  const breadcrumbItems = ref<string[]>([]);

  const updateBreadcrumb = () => {
    const titles: string[] = [];
    route.matched.forEach((record) => {
      if (record.meta?.title) {
        titles.push(record.meta.title);
      }
    });
    breadcrumbItems.value = titles;
  };

  watch(() => route.path, updateBreadcrumb);
  updateBreadcrumb();

  return { breadcrumbItems };
};

export default useBreadcrumb;
