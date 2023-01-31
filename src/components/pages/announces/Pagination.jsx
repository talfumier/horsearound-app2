import {FormattedMessage} from "react-intl";
import _ from "lodash";
import PropTypes from "prop-types";

const Pagination = ({pagesCount, currentPage, onPageChange}) => {
  if (pagesCount === 1) return null;
  const pages = _.range(1, pagesCount + 1);
  return (
    <nav className="nav justify-content-center">
      <ul className="pagination">
        <li key="previous" className="page-item ">
          <span
            className="btn btn-outline-success mx-1"
            aria-hidden="true"
            onClick={() =>
              onPageChange(currentPage === 1 ? pagesCount : currentPage - 1)
            }
          >
            <FormattedMessage id="global.previous" />
          </span>
        </li>
        {pages.map((page) => (
          <li
            key={page}
            className={page === currentPage ? "page-item active" : "page-item"}
          >
            <a
              className="page-link"
              onClick={() => {
                onPageChange(page);
              }}
            >
              {page}
            </a>
          </li>
        ))}
        <li key="next" className="page-item ">
          <span
            className="btn btn-outline-success mx-1"
            aria-hidden="true"
            onClick={() =>
              onPageChange(currentPage === pagesCount ? 1 : currentPage + 1)
            }
          >
            <FormattedMessage id="global.next" />
          </span>
        </li>
      </ul>
    </nav>
  );
};
Pagination.propTypes = {
  pagesCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
export default Pagination;
