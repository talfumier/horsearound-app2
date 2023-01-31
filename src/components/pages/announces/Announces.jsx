import {useState, useEffect} from "react";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import AnnouncesList from "./AnnouncesList";
import Pagination from "./Pagination";
import AnnouncesMap from "./AnnouncesMap";

function Announces({announces}) {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["filter"]);
  const [state, setState] = useState({});
  useEffect(() => {
    setState({
      currentPage:
        cookies.filter && cookies.filter.page ? cookies.filter.page : 1,
    });
  }, [announces]);
  function handlePageChange(page) {
    navigate("/announces", {replace: true}); //removes query parameters in the URL (coming from home page) once current page has changed
    let filter = cookies.filter;
    if (filter) {
      filter.page = page;
    } else {
      filter = {page: page};
    }
    setCookie("filter", filter, {path: "/"});
    setState({
      currentPage: page,
    });
  }
  return (
    Object.keys(state).length === 1 && (
      <section className="mainContentSection packagesSection">
        <br />
        <br />
        <div className="mx-xl-5">
          <div className="row mx-auto">
            <div className="col-xl-8">
              <AnnouncesList
                announces={announces[state.currentPage - 1]}
                // onUnHover={onUnHover}
              />
            </div>
            <div className="col-xl-4">
              <div className="bookingAside h-100">
                <aside>
                  <AnnouncesMap announces={announces[state.currentPage - 1]} />
                </aside>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <Pagination
                onPageChange={handlePageChange}
                currentPage={state.currentPage}
                pagesCount={announces.length}
              />
            </div>
          </div>
        </div>
      </section>
    )
  );
}

export default Announces;
