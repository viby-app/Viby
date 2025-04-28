import Navbar from "./navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="pb-9">{children}</main>
      <Navbar />
    </>
  );
}
