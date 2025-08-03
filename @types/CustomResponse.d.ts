type CustomResponse<T> = {
  data?: T;
  success: boolean;
  result: number;
  text: string;
};

type Page<T> = {
  list: T;
  total: number;
  pageIndex: number;
  pageSize: number;
};
