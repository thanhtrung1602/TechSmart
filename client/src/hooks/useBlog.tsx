import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const instanceBlog = axios.create({
  baseURL: import.meta.env.VITE_API_BLOG_URL,
});

function useBlog<T>(url: string) {
  return useQuery<T>({
    queryKey: [url],
    queryFn: async () => {
      const response = await instanceBlog.get(url);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export default useBlog;
