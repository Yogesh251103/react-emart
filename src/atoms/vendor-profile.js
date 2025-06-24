import { atom } from "recoil";

export const vendorUserDetails = atom({
  key: "vendorUserDetails",
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
