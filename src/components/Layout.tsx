import { type ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen overflow-hidden mx-auto flex flex-col">
      <Header />
      <main className="">{children}</main>
    </div>
  );
}
