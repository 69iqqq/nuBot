import { useRouter } from "next/navigation";
import { useNavigation } from "@/lib/context/navigation";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@mui/material";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { isMobileNavOpen, closeMobileNav } = useNavigation();

  const handleClick = () => {
    closeMobileNav();
  };

  return (
    <>
      {/* Overlay when mobile nav is open */}
      {isMobileNavOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50"
          onClick={closeMobileNav}
        />
      )}

      {/* Sidebar container */}
      <div
        className={cn(
          " md:inset-y-0 fixed top-14 bottom-0 left-0 z-50 w-72 bg-gray-50/80 backdrop-blur-xl border-r border-gray-200/50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:top-0 flex flex-col",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200/50">
          <Button
            className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/50 shadow-sm hover:shadow transition-all duration-200"
            onClick={handleClick}
          >
            <PlusIcon className="mr-2 h-4 w-4" /> New Chat
          </Button>
        </div>
      </div>
    </>
  );
}
