export type IError = Error & {
  status?: number;
  message?: string;
};
