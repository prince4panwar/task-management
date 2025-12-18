import { Spinner } from "./ui/spinner";
import { useThemeStore } from "@/store/themeStore";

function Loader() {
  const { theme } = useThemeStore();
  return (
    <div
      className={`flex items-center justify-center h-screen text-lg ${
        theme === "light" ? "light" : "dark"
      }`}
    >
      <Spinner className="w-50 h-50 text-blue-600" />
    </div>
  );
}

export default Loader;
