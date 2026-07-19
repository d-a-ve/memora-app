import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";

import { createUserAccount, createUserSession } from "@api/auth";

import getValidFormData from "@helpers/getValidFormData";
import { extractErrorMessage } from "@helpers/index";
import { toastError } from "@helpers/toastNotifs";

export default function useForm() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const signupSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { formData, isFormValid } = getValidFormData(e);
    const [nameField, emailField, passwordField, confirmPasswordField] =
      formData;
    const doesPasswordMatch = passwordField[1] === confirmPasswordField[1];

    try {
      if (isFormValid && doesPasswordMatch) {
        setIsLoading(true);
        // Signup creates the session cookie; no separate login step needed.
        const account = await createUserAccount(
          emailField[1] as string,
          passwordField[1] as string,
          nameField[1] as string
        );
        queryClient.invalidateQueries({ queryKey: ["current-user"] });
        navigate(`/dashboard/${account.$id}?query_limit=15`, { replace: true });
      } else {
        toastError(
          "Cannot submit the form. Please check the highlighted fields for errors and try again."
        );
      }
    } catch (error: any) {
      toastError(extractErrorMessage(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const loginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { formData, isFormValid } = getValidFormData(e);
    const [emailField, passwordField] = formData;

    try {
      if (isFormValid) {
        setIsLoading(true);
        const session = await createUserSession(
          emailField[1] as string,
          passwordField[1] as string
        );
        queryClient.invalidateQueries({ queryKey: ["current-user"] });
        navigate(`/dashboard/${session.userId}/`, { replace: true });
      } else {
        toastError(
          "Cannot submit the form. Please check the highlighted fields for errors and try again."
        );
      }
    } catch (error: any) {
      toastError(extractErrorMessage(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signupSubmit,
    loginSubmit,
    isLoading,
  };
}
