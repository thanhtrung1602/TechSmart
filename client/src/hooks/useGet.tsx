import { useQuery } from "@tanstack/react-query";
import instance from "~/services/axios";
import useAccessToken from "./useAccessToken";

function useGet<T>(
  url: string,
  options?: object,
  staleTime: number = 5 * 60 * 1000
) {
  const { data: token } = useAccessToken();

  return useQuery<T>({
    queryKey: [url, token],
    queryFn: async () => {
      const headers: { [key: string]: string } = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const { data } = await instance.get<T>(url, {
        headers,
        ...options,
      });
      return data;
    },
    staleTime,
    enabled: !!url,
  });
}

export default useGet;
