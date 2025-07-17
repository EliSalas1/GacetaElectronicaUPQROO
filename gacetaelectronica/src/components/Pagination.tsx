'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (newPage: number, newOffset: number) => void;
  className?: string;
};

export const Pagination = ({
  page,
  totalItems,
  pageSize = 10,
  onPageChange,
  className
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const goToPage = (newPage: number) => {
    const newOffset = (newPage - 1) * pageSize;
    onPageChange(newPage, newOffset);
  };

  const renderPageButtons = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // máximo de botones visibles + elipsis

    if (totalPages <= maxVisible) {
      // pocas páginas, todas visibles
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // muchas páginas, usamos elipsis
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          '...',
          page - 1,
          page,
          page + 1,
          '...',
          totalPages
        );
      }
    }

    return pages.map((p, idx) => {
      if (p === '...') {
        return (
          <Button
            key={`ellipsis-${idx}`}
            variant="ghost"
            size="sm"
            disabled
            className="cursor-default"
          >
            …
          </Button>
        );
      }

      return (
        <Button
          key={p}
          variant={p === page ? "default" : "outline"}
          size="sm"
          onClick={() => goToPage(Number(p))}
        >
          {p}
        </Button>
      );
    });
  };

  return (
    <div className={cn("flex items-center justify-center gap-2 flex-wrap", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </Button>

      {renderPageButtons()}

      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </Button>
    </div>
  );
};
