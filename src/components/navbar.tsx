import { pages } from "~/utils";

const Navbar = () => {
  return (
    <nav className="fixed bottom-0 z-50 flex w-full items-center justify-around border-t border-gray-800 bg-[#48A6A7] p-5 py-2 lg:top-0 lg:max-h-10">
      <div className="container mx-auto flex items-center justify-between">
        <ul className="flex space-x-4">
          {pages.map((page) => (
            <li key={page.name} className="min-w-10">
              <a href={page.path} className="text-white hover:text-gray-200">
                <span className="min-w-12">{page.icon}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="text-lg font-bold text-white">Viby</div>
    </nav>
  );
};

export default Navbar;
