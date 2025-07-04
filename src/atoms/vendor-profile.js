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

export const outletInvoice = atom({
  key: "vendorOutletInvoice",
  default: {
    loaded: false,
    data: [],
  },
});

export const outletStock = atom({
  key: "outletStock",
  default: {
    loaded: false,
    data: [],
  },
  dangerouslyAllowMutability: true,
});

export const productsList = atom({
  key: "productsList",
  default: {
    loaded: false,
    data: [],
  },
  dangerouslyAllowMutability: true,
});

export const restockingRequest = atom({
  key: "restockingRequest",
  default: {
    loaded: false,
    data: [],
  },
  dangerouslyAllowMutability: true,
});

export const replacementRequest = atom({
  key: "replacementRequest",
  default: {
    loaded: false,
    data: [],
  },
  dangerouslyAllowMutability: true,
});
