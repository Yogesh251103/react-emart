import { createContext, useContext, useCallback, useEffect } from "react";
import { snackBarAtom } from "../atoms/sampleAtom";
import { useRecoilState } from "recoil";
import { notification } from "antd";

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackBar, setSnackBar] = useRecoilState(snackBarAtom);
  const [api, contextHolder] = notification.useNotification();

  const showSnackBar = useCallback((message, type = "info") => {
    setSnackBar({
      open: true,
      message,
      type,
    });

    // AntD handles auto-close, no need to manually close it in Recoil
    api[type]({
      message: type.charAt(0).toUpperCase() + type.slice(1),
      description: message,
    });
  }, [api, setSnackBar]);

  return (
    <SnackbarContext.Provider value={showSnackBar}>
      {contextHolder}
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);
