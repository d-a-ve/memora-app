import Button from "@components/Button";

import { ShowMode } from "../../types";

export default function ShowAddBirthday({
  modal,
  showMode,
}: {
  modal: { open: () => void };
  showMode: ShowMode;
}) {
  switch (showMode.mode) {
    case "text":
      return (
        <div className="space-y-6">
          <p>{showMode.text}</p>
          <Button
            onClick={() => modal.open()}
            size="sm"
            label={showMode.openModalText}
          />
        </div>
      );

    case "button":
      return (
        <div className="fixed right-8 bottom-8">
          <Button
            size="sm"
            label="+"
            className="text-xl px-3 py-1 font-semibold"
            onClick={() => modal.open()}
          />
        </div>
      );

    default:
      return <p>Unknown show mode props passed!!</p>;
  }
}
