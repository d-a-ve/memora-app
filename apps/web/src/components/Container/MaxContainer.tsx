import { PropsWithChildren } from "react";

function MaxContainer({ children }: PropsWithChildren) {
  return <div className="max-w-[1440px] mx-auto">{children}</div>;
}

export default MaxContainer;
