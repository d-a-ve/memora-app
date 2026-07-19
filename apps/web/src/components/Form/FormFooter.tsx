import { useQueryClient } from "@tanstack/react-query";

import { AUTHMETHODS } from "@constants/index";

import Button from "@components/Button";

export function FormFooter() {
  const queryClient = useQueryClient();
  return (
    <div>
      <div className="flex flex-col gap-4 mb-6">
        {AUTHMETHODS.map((method) => (
          <Button
            key={method.id}
            intent="secondary"
            label={method.name}
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["current-user"] });
              method.clickFunction();
            }}
            leftIcon={
              <img
                className="w-5 h-5"
                src={method.icon}
                alt={`${method.name}-icon`}
              />
            }
          />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <span className="w-1/5 h-[1px] bg-gray-400"></span>
        <p className="text-fs--1 text-center font-medium">Or continue with</p>
        <span className="w-1/5 h-[1px] bg-gray-400"></span>
      </div>
    </div>
  );
}
