// @/components/shared/tables/TablePagination.tsx
import React from "react";
import { useLanguage } from "@/components/context/LanguageContext";
import { translations } from "@/translations";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function TablePagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: TablePaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const { language } = useLanguage();
  const t = translations[language].dashboard.pagination;

  return (
    <div className="border-t border-neutral-200 dark:border-neutral-700 px-4 py-3 flex items-center justify-between">
      <div className="flex-1 text-sm text-neutral-500 dark:text-neutral-400">
        {t.showing} {t.ከ}{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} {t.to} {" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} {t.of} {totalItems}{" "}
        {t.results}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            {t.page} {currentPage} {t.of_2} {totalPages}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
