import Button from "~/components/Button";
import { MenuItemType } from "~/types/menuType";

function MenuItem({ className, data, onClick }: MenuItemType) {
  return (
    <Button className={className} to={data.to} onClick={onClick}>
      <div className="flex items-center gap-x-2 px-4 py-2 transition-colors rounded hover:bg-gray-200  hover:text-main600">
        <span className="text-sm">{data.icon}</span>
        <span className="text-sm">{data.name}</span>
      </div>
    </Button>
  );
}

export default MenuItem;
