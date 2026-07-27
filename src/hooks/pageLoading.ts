import { ref } from 'vue';

const pageLoading = ref(false);

export default function usePageLoading() {
  const setPageLoading = (value: boolean) => {
    pageLoading.value = value;
  };

  return {
    pageLoading,
    setPageLoading,
  };
}
