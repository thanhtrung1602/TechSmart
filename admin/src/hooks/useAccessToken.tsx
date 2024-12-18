import { useQuery } from "@tanstack/react-query";
import instance, { setAccessToken, setRefreshToken } from "~/services/axios";

export default function useAccessToken() {
  useRefreshToken();
  return useQuery({
    queryKey: ["/auth/getAccessToken"],
    queryFn: async () => {
      const { data } = await instance.get("/auth/getAccessToken");
      setAccessToken(data);
      return data;
    },
  });
}

export function useRefreshToken() {
  return useQuery({
    queryKey: ["/auth/getRefreshToken"],
    queryFn: async () => {
      const { data } = await instance.get("/auth/getRefreshToken");
      setRefreshToken(data);
      return data;
    },
  });
}
