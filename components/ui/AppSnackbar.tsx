"use client";

import * as React from "react";
import { Alert, Snackbar } from "@mui/material";

export type SnackbarSeverity = "error" | "success" | "info" | "warning";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}

interface SnackbarContextValue {
  show: (message: string, severity?: SnackbarSeverity) => void;
  showError: (message: string) => void;
  hide: () => void;
}

const SnackbarContext = React.createContext<SnackbarContextValue | null>(null);

const defaultState: SnackbarState = {
  open: false,
  message: "",
  severity: "error",
};

const AUTO_HIDE_DURATION = 6000;

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<SnackbarState>(defaultState);

  const show = React.useCallback(
    (message: string, severity: SnackbarSeverity = "error") => {
      setState({ open: true, message, severity });
    },
    []
  );

  const showError = React.useCallback((message: string) => {
    setState({ open: true, message, severity: "error" });
  }, []);

  const hide = React.useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const handleClose = React.useCallback(
    (_: unknown, reason?: string) => {
      if (reason === "clickaway") return;
      hide();
    },
    [hide]
  );

  const value = React.useMemo<SnackbarContextValue>(
    () => ({ show, showError, hide }),
    [show, showError, hide]
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={AUTO_HIDE_DURATION}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={state.severity}
          onClose={() => handleClose(null)}
          variant="filled"
        >
          {state.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar(): SnackbarContextValue {
  const ctx = React.useContext(SnackbarContext);
  if (ctx == null) {
    throw new Error("useSnackbar must be used within SnackbarProvider");
  }
  return ctx;
}
