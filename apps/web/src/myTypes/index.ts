type Preferences = {
  [key: string]: any;
};

export type InputFieldType = {
  id: number;
  labelText: string;
  labelFor: string;
  inputType: string;
  isRequired: boolean;
  placeHolder?: string;
  twoLabelElements?: boolean;
  isPassword?: boolean;
};

export type IconPropsType = {
  width: string | number;
  height: string | number;
};

export type UserType = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  password?: string;
  hash?: string;
  hashOptions?: object;
  registration: string;
  status: boolean;
  passwordUpdate: string;
  email: string;
  phone: string;
  emailVerification: boolean;
  phoneVerification: boolean;
  prefs: Preferences;
};

export type databaseDocType = Record<string, unknown>;

export type birthdaysAttrType = {
  user_id: string;
  person_name: string;
  person_birthday: string;
};

export type documentType = {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  [key: string]: any;
};

export type birthdayDataType = {
  total: number;
  documents: documentType[];
};

export type ErrorType = {
  message: string;
  type: string;
  code: number;
};
