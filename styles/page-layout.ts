import type { SxProps, Theme } from "@mui/material";

/** Full-page wrapper: centered content, background, padding. */
export const pageLayout: SxProps<Theme> = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  bgcolor: "background.default",
  py: 6,
  px: 2,
};

/** Inner content box – list page (wide). */
export const pageContentList: SxProps<Theme> = {
  width: "100%",
  maxWidth: 1280,
};

/** Inner content box – form pages (create/edit). */
export const pageContentForm: SxProps<Theme> = {
  width: "100%",
  maxWidth: 640,
};

/** Inner content box – order detail page. */
export const pageContentDetail: SxProps<Theme> = {
  width: "100%",
  maxWidth: 720,
};

/** Centered loading spinner – full height. */
export const loadingContainer: SxProps<Theme> = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

/** Centered loading spinner – fixed height (e.g. list placeholder). */
export const loadingContainerShort: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: 320,
};

/** Error state: centered message + actions. */
export const errorContainer: SxProps<Theme> = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: 2,
};

/** Card-style box for forms or detail block (border, padding, paper bg). */
export const formCard: SxProps<Theme> = {
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  p: 3,
  bgcolor: "background.paper",
};

/** Wrapper for DataGrid (height so pagination is visible). */
export const dataGridWrapper: SxProps<Theme> = {
  height: 720,
  minHeight: 480,
  width: "100%",
};
