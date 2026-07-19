import { ReactNode } from "react";

export function AuthLayout({
  children,
  sidePanel,
}: {
  children: ReactNode;
  sidePanel: { title: string; subtitle: string };
}) {
  return (
    <div className="grid grid-cols-2 min-h-screen bg-background lg:grid-cols-1">
      <div className="lg:hidden bg-auth-gradient bg-cover bg-center text-background flex flex-col gap-y-6 justify-center px-12">
        <p className="text-fs-3 font-semibold">{sidePanel.title}</p>
        <p className="font-medium">{sidePanel.subtitle}</p>
      </div>
      <div className="py-8">
        <section className="max-w-lg mx-auto flex items-center justify-center h-full">
          <div className="w-full px-8">{children}</div>
        </section>
      </div>
    </div>
  );
}
