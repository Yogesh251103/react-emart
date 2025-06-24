import { cloneElement } from "react";

const MenuIcon = ({ children }) => {
  return <div>{cloneElement(children, { className: "size-6 mr-3" })}</div>;
};

export default MenuIcon;
