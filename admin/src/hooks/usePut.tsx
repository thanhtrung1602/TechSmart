import { useMutation } from "@tanstack/react-query";
import instance from "~/services/axios";
import useAccessToken from "./useAccessToken";

function usePut() {
  const { data: token } = useAccessToken();
  return useMutation({
    mutationFn: ({ url, data }: { url: string; data: object }) =>
      instance
        .patch(url, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          return {
            data: res.data,
            status: res.status,
          };
        }),
  });
}

export default usePut;
