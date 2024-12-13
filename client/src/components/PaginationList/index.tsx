import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { PaginationType } from '~/types/paginationType';

function PaginationList({ currentPage, itemsPerPage, totalProducts, handlePageClick }: PaginationType) {
    return (
        <div className="flex justify-center mt-8">
            <Pagination
                count={Math.ceil(totalProducts / itemsPerPage)}
                page={currentPage}
                onChange={handlePageClick}
                color="primary"
                showFirstButton
                showLastButton
                renderItem={(item) => (
                    <PaginationItem
                        {...item}
                        className={`px-3 py-2 border border-gray-300 rounded-md size-12
                                        ${item.selected ? 'bg-blue-100 text-main600 font-bold' : 'hover:bg-gray-200'} 
                                        ${item.disabled ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'}`}
                    />
                )}
                classes={{
                    root: 'flex justify-center items-center gap-x-2 mt-4',
                }}
            />
        </div>
    );
}

export default PaginationList;