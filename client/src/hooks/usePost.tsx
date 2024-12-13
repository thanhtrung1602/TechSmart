import { useMutation } from "@tanstack/react-query";
import instance from "~/services/axios";
import useAccessToken from "./useAccessToken";

function usePost() {
  const { data: token } = useAccessToken();
  return useMutation({
    mutationFn: ({ url, data }: { url: string; data: object }) =>
      instance
        .post(url, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          return {
            data: response.data,
            status: response.status,
          };
        }),
  });
}

export function usePatch() {
  const { data: token } = useAccessToken();
  return useMutation({
    mutationFn: ({ url, data }: { url: string; data?: object }) =>
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

export function useDelete() {
  const { data: token } = useAccessToken();
  return useMutation({
    mutationFn: (url: string) =>
      instance
        .delete(url, {
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

export default usePost;
