import { FormEvent, useRef, useState } from "react";

import useUserMutation from "@hooks/useUserMutation";
import { useUserQuery } from "@hooks/useUserQuery";

import { sendFeedback } from "@api/feedback";

import { cn } from "@helpers/cn";
import { toastError, toastSuccess } from "@helpers/toastNotifs";

import Button from "@components/Button";
import { FormWrapper } from "@components/Form";

import CardSectionLayout from "../components/Layout/CardSectionLayout";

const FeedbackType = {
  DEFAULT: "default",
  ISSUE: "issue",
  FEATURE: "feature",
  MESSAGE: "message",
} as const;

function Feedback() {
  const [error, setError] = useState({
    type: false,
    message: false,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const { data: user } = useUserQuery();
  const { mutate: feedback, isPending: isFeedbackSending } = useUserMutation<
    Awaited<ReturnType<typeof sendFeedback>>,
    Awaited<ReturnType<typeof sendFeedback>>,
    Parameters<typeof sendFeedback>[0]
  >({
    mutationFn: (data) => sendFeedback(data),
    onSuccess: (res) => {
      if (res.error && !res.message) {
        toastError(res.error);
        return;
      }

      formRef.current?.reset();
      toastSuccess("Feedback sent successfully");
    },
  });

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      type: formData.get("type"),
      message: formData.get("message"),
    };

    // I dont need to check for null as this would be the default value
    if (data.type === FeedbackType.DEFAULT) {
      setError((prev) => ({ ...prev, type: true }));
      return;
    }

    if (typeof data.message === "string" && data.message.length < 1) {
      setError((prev) => ({ ...prev, message: true }));
      return;
    }

    if (!user) {
      toastError("User not found, please login again.");
      return;
    }

    feedback({
      email: user.email,
      username: user.name,
      type: data.type as string,
      message: data.message as string,
    });
  };

  return (
    <CardSectionLayout>
      <h1 className="font-semibold text-fs-1 sm:mb-1">Send Feedback</h1>
      <p className="text-fs--1 max-w-xl">
        Have an issue to report, a feature to request, or just want to send the
        developer a message? Let him know below!
      </p>
      <div className="mt-8 relative before:w-full before:h-[1px] before:bg-gray-300 before:absolute before:-top-4">
        <div className="max-w-lg">
          <FormWrapper submitFunction={submitHandler} formRef={formRef}>
            <div className="flex flex-col gap-2">
              <label htmlFor="type" className="font-medium text-base">
                Select an option
              </label>
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.7}
                  stroke="currentColor"
                  aria-hidden="true"
                  className={cn(
                    "absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-all"
                  )}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>

                <select
                  id="type"
                  className={cn("input appearance-none", {
                    "border-red-500": error.type,
                  })}
                  defaultValue={FeedbackType.DEFAULT}
                  name="type"
                  onBlur={(e) => {
                    if (e.target.value === FeedbackType.DEFAULT) {
                      setError((prev) => ({ ...prev, type: true }));
                      return;
                    }

                    if (error.type) {
                      setError((prev) => ({ ...prev, type: false }));
                    }
                  }}
                >
                  <option value={FeedbackType.DEFAULT}>
                    Choose feedback type
                  </option>
                  <option value={FeedbackType.ISSUE}>Report an issue</option>
                  <option value={FeedbackType.FEATURE}>
                    Request for a feature
                  </option>
                  <option value={FeedbackType.MESSAGE}>
                    Send developer a message
                  </option>
                </select>
              </div>
              <p className="text-red-500 text-sm h-3">
                {error.type && "Please select a valid feedback type"}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="font-medium text-base">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className={cn("input resize-none", {
                  "border-red-500": error.message,
                })}
                name="message"
                onChange={(e) => {
                  if (e.target.value.length > 0 && error.message) {
                    setError((prev) => ({ ...prev, message: false }));
                  }
                }}
              ></textarea>
              <p className="text-red-500 text-sm h-3">
                {error.message && "Message field cannot be empty"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                type="submit"
                label="Send Feedback"
                isLoading={isFeedbackSending}
              />
            </div>
          </FormWrapper>
        </div>
      </div>
    </CardSectionLayout>
  );
}

export default Feedback;
