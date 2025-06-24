import { atom } from "recoil";
const adminToken = localStorage.getItem("adminToken")  || " ";
const vendorToken = localStorage.getItem("vendorToken") || ""
export const countAtom = atom({
    key:"countAtom",
    default:0
})

export const axiosAtom = atom({
  key: 'axiosState',
  default: {
    loading: false,
    response: null,
    error: '',
  },
});

export const authAtom = atom({
  key: 'authState',
  default:{
    userName: "",
    password: "",
    isLoggedIn: !!adminToken || !!vendorToken,
    tokenAdmin: adminToken,
    tokenVendor: vendorToken

  }
})

export const snackBarAtom = atom({
  key: "snackBar",
  default: {
    open: false,
    message: "",
    type: "info"
  }
})

export const warehouseAtom = atom({
  key: "warehouse",
  default: []
})
export const supplierAtom = atom({
  key: supplierData,
  default: []
})