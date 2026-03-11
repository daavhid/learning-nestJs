export interface PaginationMetaData {
  currentPage?: number;
  pageSize?: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface cursorPaginationMeta {
  cursor: string | Date | null;
  hasNextPage: boolean;
  // hasPreviousPage:boolean;
}

export interface strictCursorPaginationMeta {
  cursor: Record<string, any> | null;
  hasNextPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMetaData;
}

export interface cursorPaginationResponse<T> {
  data: T[];
  meta: cursorPaginationMeta;
}

export interface strictCursorPaginationResponse<T> {
  data: T[];
  meta: strictCursorPaginationMeta;
}
