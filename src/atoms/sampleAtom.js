import { atom } from "recoil";
const adminToken = localStorage.getItem("adminToken") || "";
const vendorToken = localStorage.getItem("vendorToken") || "";

export const axiosAtom = atom({
  key: "axiosState",
  default: {
    loading: false,
    response: null,
    error: "",
  },
});

export const authAtom = atom({
  key: "authState",
  default: {
    userName: "",
    password: "",
    isLoggedIn: !!adminToken || !!vendorToken,
    tokenAdmin: adminToken,
    tokenVendor: vendorToken,
  },
});

export const snackBarAtom = atom({
  key: "snackBar",
  default: {
    open: false,
    message: "",
    type: "info",
  },
});

export const productList = atom({
  key: "productList",
  default: [],
});

export const warehouseAtom = atom({
  key: "warehouseList",
  default: [],
});

export const supplierList = atom({
  key: "supplierList",
  default: [],
});

export const outletList = atom({
  key: "outletList",
  default: [],
});

export const outletInvoice = atom({
  key: "outletInvoice",
  default: {
    loaded: false,
    data: [],
  },
  dangerouslyAllowMutability: true,
});

export const supplierInvoice = atom({
  key: "supplierInvoice",
  default: {
    loaded: false,
    data: [],
  },
  dangerouslyAllowMutability: true,
});

export const restockingRequestList = atom({
  key: "restockingRequestList",
  default: [],
});

export const replacementRequestList = atom({
  key: "replacementRequestList",
  default: [],
});

export const approvedRequestList = atom({
  key: "approvedRequestList",
  default: [],
});

export const rejectedRequestList = atom({
  key: "rejectedRequestList",
  default: [],
});
