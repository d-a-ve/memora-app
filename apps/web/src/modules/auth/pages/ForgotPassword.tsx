import { FormEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";

import useCustomMutation from "@hooks/useCustomMutation";

import { forgotPassword } from "@api/auth";

import { extractErrorMessage } from "@helpers/index";
import { toastError, toastSuccess } from "@helpers/toastNotifs";

import Button from "@components/Button";
import { FormHeader, FormWrapper } from "@components/Form";
import { InputWithLabel } from "@components/Input";
import { AuthLayout } from "@components/Layout";
import ToastNotif from "@components/Toast";

import PasswordResetLinkSent from "../components/PasswordResetLink";

type MutationFnType = { email: string };

export default function ForgotPassword() {
  const [isResetLinkSent, setIsResetLinkSent] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const { mutateAsync: forgotPasswordMutation, isPending: isSubmitting } =
    useCustomMutation<void, MutationFnType>({
      mutationFn: ({ email }) => forgotPassword(email),
    });

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userEmail = new FormData(e.currentTarget).get("email") as string;
    setSearchParams({ email: userEmail });

    try {
      await forgotPasswordMutation({ email: userEmail });
      setIsResetLinkSent(true);
    } catch (error: any) {
      toastError(extractErrorMessage(error.message));
    }
  };

  const resendLink = async () => {
    const userEmail = searchParams.get("email") as string;

    try {
      await forgotPasswordMutation({ email: userEmail });
      toastSuccess("Reset link sent successfully");
    } catch (error: any) {
      toastError(error.message);
    }
  };

  return (
    <AuthLayout
      sidePanel={{
        title: "Trouble logging in?",
        subtitle: "Reset your password and jump back into the memories.",
      }}
    >
      {isResetLinkSent ? (
        <PasswordResetLinkSent resendLink={resendLink} />
      ) : (
        <>
          <FormHeader
            headerTitle="Forgot your Password"
            subTitle="If you didn't forget your password "
            subTitleCta="Login"
            ctaLinkTo="/login"
          />
          <FormWrapper submitFunction={submitHandler}>
            <InputWithLabel
              labelText="Enter your email"
              labelFor="email"
              inputType="email"
              required={true}
            />
            <div className="mt-2">
              <Button
                type="submit"
                isLoading={isSubmitting}
                label="Submit"
                className="w-full"
              />
            </div>
          </FormWrapper>
        </>
      )}
      <ToastNotif />
    </AuthLayout>
  );
}
