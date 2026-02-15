import type { GridRowId } from "@mui/x-data-grid";

export const DEFAULT_PAGE = 0;
export const DEFAULT_PAGE_SIZE = 10;
export const NEW_ROW_ID: GridRowId = -1;
export const PAGE_SIZE_OPTIONS = [5, 10, 25] as const;

export const dataGridSlotProps = {
  filterPanel: {
    filterFormProps: {
      logicOperatorInputProps: { variant: "outlined" as const, size: "small" as const },
      columnInputProps: { variant: "outlined" as const, size: "small" as const, sx: { mt: "auto" } },
      operatorInputProps: { variant: "outlined" as const, size: "small" as const, sx: { mt: "auto" } },
      valueInputProps: {
        InputComponentProps: { variant: "outlined" as const, size: "small" as const },
      },
    },
  },
};

export function getRowClassName(params: { indexRelativeToCurrentPage: number }): string {
  return params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd";
}

/** Default DataGrid static props (density, pagination mode, etc.). */
export const dataGridDefaultProps = {
  density: "standard" as const,
  disableColumnResize: true,
  paginationMode: "server" as const,
  disableRowSelectionOnClick: true,
};
