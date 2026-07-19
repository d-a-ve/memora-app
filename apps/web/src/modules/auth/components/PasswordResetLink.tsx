import { useEffect, useState } from "react";

const PasswordResetLinkSent = ({ resendLink }: { resendLink: () => void }) => {
  const [countdown, setCountdown] = useState(10);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  const isCountdownOver = countdown === 0;
  useEffect(() => {
    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [countdown]);

  return (
    <div className="">
      <h1 className="text-fs-2 font-bold text-center mb-2">
        Password Reset Link Sent
      </h1>
      <p className="text-center text-fs-0">Please check your email inbox.</p>

      <div className="flex gap-2 mt-4">
        <p className="text-fs--1">
          Didn&apos;t receive an email?{" "}
          <span
            className={`${
              isCountdownOver
                ? "text-primary cursor-pointer"
                : "text-gray-400 cursor-not-allowed"
            } font-bold`}
            onClick={
              isCountdownOver
                ? () => {
                    resendLink();
                    setCountdown(120);
                  }
                : undefined
            }
          >
            Resend code
          </span>
        </p>
        <span className="text-[#003A1B] text-fs--1">
          in {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </span>
      </div>
    </div>
  );
};

export default PasswordResetLinkSent;
