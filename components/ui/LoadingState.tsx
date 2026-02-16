import { Box, CircularProgress } from "@mui/material";
import { loadingContainerShort } from "@/styles/page-layout";

export function LoadingState() {
  return (
    <Box sx={loadingContainerShort}>
      <CircularProgress />
    </Box>
  );
}