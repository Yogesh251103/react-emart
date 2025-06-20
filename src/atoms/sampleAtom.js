import { atom } from "recoil";

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