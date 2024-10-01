export type Response<T> = {
  data: T[];
  pagination?: {
    count: number;
    limit: number;
    offset: number;
    page: number;
    totalPage: number;
  };
};
