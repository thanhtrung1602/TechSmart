
import Tippy from "@tippyjs/react/headless";
import { useState } from "react";
import { MenuType } from "~/types/menuType";
import MenuItem from "../MenuItem";
import Wrapper from "~/components/Popper";

function MenuTooltip({ children, items = [], className }: MenuType) {
  const [history] = useState([{ data: items }]);
  const [visible, setVisible] = useState(false);

  const current = history[history?.length - 1];

  const renderItems = () => {
    return current.data?.map((item, index) => (
      <MenuItem key={index} data={item} onClick={item.onClick} />
    ));
  };

  const handleToggle = () => {
    setVisible((prev) => !prev);
  };

  return (
    <Tippy
      appendTo={() => document.body}
      interactive
      placement="bottom-end"
      delay={[0, 500]}
      offset={[12, 8]}
      visible={visible} // Hiển thị dựa vào trạng thái visible
      onClickOutside={() => setVisible(false)} // Ẩn khi click bên ngoài
      render={(attrs) => (
        <div tabIndex={-1} {...attrs} className="mt-1">
          <Wrapper>
            <div className={className}>{renderItems()}</div>
          </Wrapper>
        </div>
      )}
    >
      <div onClick={handleToggle}>{children}</div>
    </Tippy>
  );
}

export default MenuTooltip;
