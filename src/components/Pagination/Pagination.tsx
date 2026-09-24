import * as ReactPaginateModule from "react-paginate";
import css from "./Pagination.module.css";


const ReactPaginateRaw = ReactPaginateModule as unknown as {
  default?: { default?: unknown } | unknown;
};
const ReactPaginate = (
  ReactPaginateRaw.default && typeof ReactPaginateRaw.default === "object" && "default" in (ReactPaginateRaw.default as object)
    ? (ReactPaginateRaw.default as { default: unknown }).default
    : ReactPaginateRaw.default
) as React.ComponentType<Record<string, unknown>>;

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const handlePageChange = (selectedItem: { selected: number }) => {
    onPageChange(selectedItem.selected + 1);
  };

  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={handlePageChange}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
}