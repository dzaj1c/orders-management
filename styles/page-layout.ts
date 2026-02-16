import type { SxProps, Theme } from "@mui/material";

export const pageLayout: SxProps<Theme> = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  bgcolor: "background.default",
  py: 6,
  px: 2,
};

export const pageContentList: SxProps<Theme> = {
  width: "100%",
  maxWidth: 1600,
};

export const pageContentForm: SxProps<Theme> = {
  width: "100%",
  maxWidth: 640,
};

export const pageContentDetail: SxProps<Theme> = {
  width: "100%",
  maxWidth: 720,
};

export const loadingContainer: SxProps<Theme> = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const loadingContainerShort: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: 320,
};

export const errorContainer: SxProps<Theme> = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: 2,
};

export const formCard: SxProps<Theme> = {
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  p: 3,
  bgcolor: "background.paper",
};

export const dataGridWrapper: SxProps<Theme> = {
  height: 720,
  minHeight: 480,
  width: "100%",
};
