import Navbar from "./navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="pb-9 lg:pt-9 dark:text-black bg-[#F2EFE7] dark:bg-[#F2EFE7]">{children}</main>
      <Navbar />
    </>
  );
};

export default Layout;
