import useForm from "@hooks/useForm";

import { InputFieldType } from "@myTypes/index";

import Button from "@components/Button";
import { FormHeader, FormWrapper } from "@components/Form";
import { InputWithLabel, InputWithLabelWrapper } from "@components/Input";
import { AuthLayout } from "@components/Layout";
import { NormalLink } from "@components/Link";
import ToastNotif from "@components/Toast";

export const LOGIN_INPUT_FIELDS: InputFieldType[] = [
  {
    id: 1,
    labelText: "Email",
    labelFor: "email",
    inputType: "email",
    isRequired: true,
  },
  {
    id: 2,
    labelText: "Password",
    labelFor: "password",
    inputType: "password",
    twoLabelElements: true,
    isRequired: true,
    isPassword: true,
  },
];

export default function Login() {
  const { loginSubmit, isLoading: isFormSubmitting } = useForm();

  return (
    <AuthLayout
      sidePanel={{
        title: "Welcome back!",
        subtitle:
          "For birthdays you adore, Memora keeps you on track for sure!",
      }}
    >
      <FormHeader
        headerTitle="Login to your account"
        subTitle="Don't have an account? "
        subTitleCta="Sign up"
        ctaLinkTo="/signup"
        showFooter
      />
      <FormWrapper submitFunction={loginSubmit}>
        {LOGIN_INPUT_FIELDS.map(
          ({
            id,
            labelText,
            labelFor,
            inputType,
            twoLabelElements,
            isRequired,
            placeHolder,
            isPassword,
          }) => {
            if (twoLabelElements) {
              return (
                <InputWithLabelWrapper
                  key={id}
                  labelText={labelText}
                  labelFor={labelFor}
                  inputType={inputType}
                  placeHolder={placeHolder}
                  required={isRequired}
                  isPassword={isPassword}
                >
                  <NormalLink
                    href="/forgot-password"
                    label="Forgot password?"
                    className="text-sm"
                  />
                </InputWithLabelWrapper>
              );
            }
            return (
              <InputWithLabel
                key={id}
                labelText={labelText}
                labelFor={labelFor}
                inputType={inputType}
                placeHolder={placeHolder}
                required={isRequired}
              />
            );
          }
        )}
        <div className="mt-2">
          <Button
            type="submit"
            isLoading={isFormSubmitting}
            label="Login"
            className="w-full"
          />
        </div>
      </FormWrapper>
      <ToastNotif />
    </AuthLayout>
  );
}
