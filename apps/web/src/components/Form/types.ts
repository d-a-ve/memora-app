import { ReactNode, FormEvent, RefObject } from "react";

export type FormHeaderType = {
  headerTitle: string;
  subTitle: string;
  subTitleCta: string;
  ctaLinkTo: string;
};

export type FormWrapperType = {
  submitFunction: ((e: FormEvent<HTMLFormElement>) => void) | undefined;
  children: ReactNode;
  formRef?: RefObject<HTMLFormElement>;
};
