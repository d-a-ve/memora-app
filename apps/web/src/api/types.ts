export type ApiErrorBody = {
  message: string;
  code?: string;
  details?: { field: string; message: string }[];
};

export type ApiUser = {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiBirthday = {
  id: string;
  name: string;
  birthday: string;
  createdAt: string;
  updatedAt: string;
};
