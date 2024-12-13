import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const instanceProvince = axios.create({
  baseURL: import.meta.env.VITE_API_PROVINCE_URL,
});

function useProvince<T>(url: string, params?: object) {
  return useQuery<T>({
    queryKey: [url, params],
    queryFn: async () => {
      const response = await instanceProvince.get(url, {
        params,
      });
      return response.data.results;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export default useProvince;
