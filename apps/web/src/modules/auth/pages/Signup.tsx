import useForm from "@hooks/useForm";

import { InputFieldType } from "@myTypes/index";

import Button from "@components/Button";
import { FormHeader, FormWrapper } from "@components/Form";
import { InputWithLabel } from "@components/Input";
import { Password } from "@components/Input/Password";
import { AuthLayout } from "@components/Layout";
import ToastNotif from "@components/Toast";

export const SIGNUP_INPUT_FIELDS: InputFieldType[] = [
  {
    id: 1,
    labelText: "Name",
    labelFor: "name",
    inputType: "text",
    isRequired: true,
    placeHolder: "John Doe",
  },
  {
    id: 2,
    labelText: "Email",
    labelFor: "email",
    inputType: "email",
    isRequired: true,
    placeHolder: "example@gmail.com",
  },
];

export default function Signup() {
  const { signupSubmit, isLoading } = useForm();
  return (
    <AuthLayout
      sidePanel={{
        title: "Welcome to Memora!",
        subtitle:
          "For birthdays you adore, Memora keeps you on track for sure!",
      }}
    >
      <FormHeader
        headerTitle="Sign up for an account"
        subTitle="Already have an account? "
        subTitleCta="Login"
        ctaLinkTo="/login"
        showFooter
      />
      <FormWrapper submitFunction={signupSubmit}>
        {SIGNUP_INPUT_FIELDS.map(
          ({ id, labelText, labelFor, inputType, isRequired, placeHolder }) => {
            return (
              <InputWithLabel
                key={id}
                labelText={labelText}
                labelFor={labelFor}
                inputType={inputType}
                required={isRequired}
                placeHolder={placeHolder}
              />
            );
          }
        )}
        <Password />
        <div className="mt-2">
          <Button
            type="submit"
            isLoading={isLoading}
            label="Sign up"
            className="w-full"
          />
        </div>
      </FormWrapper>
      <ToastNotif />
    </AuthLayout>
  );
}
