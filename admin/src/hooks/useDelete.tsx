import { useMutation } from "@tanstack/react-query";
import instance from "~/services/axios";
import useAccessToken from "./useAccessToken";

function useDelete() {
  const { data: token } = useAccessToken();
  return useMutation({
    mutationFn: ({ url, data }: { url: string; data?: object }) =>
      instance
        .delete(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: data,
        })
        .then((response) => {
          return {
            data: response.data,
            status: response.status,
          };
        }),
  });
}

export default useDelete;
