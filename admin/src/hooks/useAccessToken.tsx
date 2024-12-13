import { useQuery } from "@tanstack/react-query";
import instance, { setAccessToken } from "~/services/axios";

export default function useAccessToken() {
  return useQuery({
    queryKey: ["/auth/getAccessToken"],
    queryFn: async () => {
      const { data } = await instance.get("/auth/getAccessToken");
      setAccessToken(data);
      return data;
    },
  });
}
