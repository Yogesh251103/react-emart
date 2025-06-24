import { atom } from "recoil";

export const adminUserDetails = atom({
  key: "adminUserDetails",
  default: {
    loaded: false,
    data: {
      name: "",
      email: "",
      phone: "",
      username: "",
      image: "",
    },
  },
  dangerouslyAllowMutability: true,
});
