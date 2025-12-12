import React from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useThemeStore } from "@/store/themeStore";

function Pagination({ pagination }) {
  const [_, setSearchParams] = useSearchParams();

  if (!pagination) return null;

  const {
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
  } = pagination;

  const { theme } = useThemeStore();

  const handlePageClick = (page) => {
    if (page !== currentPage) {
      setSearchParams({ page });
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <li
          key={i}
          className={`cursor-pointer px-3 py-1 rounded ${
            i === currentPage
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-500 hover:text-white"
          }`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </li>
      );
    }

    return pages;
  };

  return (
    <div
      className={`fixed bottom-0 sm:w-2/3 w-full h-[43px] bg-white shadow-[-0px_-10px_8px_-3px_rgba(0,0,0,0.2)] ${
        theme === "light" ? "light" : "dark"
      }`}
    >
      <ul className="flex justify-center items-center h-full gap-1">
        {/* Previous */}
        <li
          className={`px-3 py-1 rounded ${
            !hasPrevPage
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-blue-500 hover:text-white"
          }`}
          onClick={() => hasPrevPage && handlePageClick(prevPage)}
        >
          <ChevronsLeft />
        </li>

        {/* Page numbers */}
        {renderPageNumbers()}

        {/* Next */}
        <li
          className={`px-3 py-1 rounded ${
            !hasNextPage
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-blue-500 hover:text-white"
          }`}
          onClick={() => hasNextPage && handlePageClick(nextPage)}
        >
          <ChevronsRight />
        </li>
      </ul>
    </div>
  );
}

export default Pagination;
