import { PropsWithChildren } from "react";

function CardSectionLayout({ children }: PropsWithChildren) {
  return (
    <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 sm:p-4">
      {children}
    </div>
  );
}

export default CardSectionLayout;
