export type PaginationType = {
    currentPage: number,
    itemsPerPage: number,
    totalProducts: number,
    handlePageClick: (event: React.ChangeEvent<unknown>, page: number) => void
}