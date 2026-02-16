import { Typography } from "@mui/material";

export function ErrorState({ message }: { message: string }) {
  return <Typography color="error">{message}</Typography>;
}