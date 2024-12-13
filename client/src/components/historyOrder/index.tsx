import useGet from "~/hooks/useGet";

export default function HistoryOrder({ id }: { id: string }) {
  const { data: statusShip } = useGet(`/orders/getStatusOrderByGHTK/${id}`);

  console.log("statusShip: ", statusShip);

  return (
    <div>
      <div>Hello</div>
    </div>
  );
}
