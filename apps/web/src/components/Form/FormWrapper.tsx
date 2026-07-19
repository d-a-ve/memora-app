import { FormWrapperType } from "./types";

export function FormWrapper({
  submitFunction,
  children,
  formRef,
}: FormWrapperType) {
  return (
    <div className="mb-8 md:mb-6">
      <form
        className="flex flex-col gap-6"
        onSubmit={submitFunction}
        ref={formRef}
      >
        {children}
      </form>
    </div>
  );
}
