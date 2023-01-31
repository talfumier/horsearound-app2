import {useState, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import _ from "lodash";
import {getTime, parseISO, setHours} from "date-fns";
import {useCookies} from "react-cookie";
import Meta from "../common/Meta";
import Banner from "../common/Banner";
import FilterSort from "./FilterSort";
import {getAnnounceRating} from "../utils/Ratings";
import Announces from "./Announces";

function PageContent({announces, presetFilter}) {
  const lang = useIntl().locale;
  const [cookies, setCookie] = useCookies(["filter"]);
  const [sort, setSort] = useState({});
  useEffect(() => {
    //Initial sorting
    if (cookies.filter && cookies.filter.sort)
      setSort({id: cookies.filter.sort, order: cookies.filter.order});
    else setSort({id: "Avis", order: "desc"});
  }, []);
  const [filteredData, setFilteredData] = useState([]);
  const [state, setState] = useState([]);
  useEffect(() => {
    let anns = announces.data;
    /* let anns = announces.data.filter(
      (ann) =>
        !ann.dates.every(
          (date) =>
            parseISO(date.period.dateEnd).getTime() < new Date().getTime()
        )
    ); */
    /* anns = anns.sort(
      (ann1, ann2) => getAnnounceRating(ann2) - getAnnounceRating(ann1)
    ); */
    setState(anns);
    window.scrollTo(0, 0);
    let filtered = null;
    const keys = Object.keys(presetFilter); //presetFilter coming from Home page activity boxes, destinations/activities pop-up
    if (keys.length > 0) {
      const fltr = getSimplifiedFilter(_.cloneDeep(presetFilter));
      if (keys.includes("activities")) {
        filtered = _.filter(anns, (ann) => {
          return isFilteredMulti("category", -1, ann, fltr.activities);
        });
      }
      if (keys.includes("destinations")) {
        filtered = _.filter(anns, (ann) => {
          return isFilteredMulti("destination", 1, ann, fltr.destinations);
        });
      }
      setCookie("filter", {filter: presetFilter, page: 1});
      setFilteredData(filtered);
    } else if (cookies.filter && cookies.filter.filter) {
      const fltr = cookies.filter.filter;
      if (fltr.dates) {
        //cookies data are stringified, so string dates need to be converted back to dates
        fltr.dates.selection.startDate = parseISO(
          fltr.dates.selection.startDate
        );
        fltr.dates.selection.endDate = parseISO(fltr.dates.selection.endDate);
      }
      handleFilter(fltr, anns);
    } else setFilteredData(anns);
  }, [presetFilter]);
  function split(anns) {
    let annsSplit = [],
      chunk = 3;
    for (let i = 0; i < anns.length; i += chunk) {
      annsSplit.push(anns.slice(i, i + chunk));
    }
    return annsSplit;
  }
  function handleSearch(searchText) {
    let filtered = state;
    // search for the text in the json
    filtered = filtered.filter((ann) =>
      new RegExp(".*" + searchText + ".*", "i").test(JSON.stringify(ann.title))
    );
    if (filtered.length === 0) {
      filtered = state;
      filtered = filtered.filter((ann) =>
        new RegExp(".*" + searchText + ".*", "i").test(
          JSON.stringify(ann.description.fr)
        )
      );
    }
    // Split the announces array into chunks for pagination purpose
    const anns = split(filtered);
    setState({
      filtered: anns,
    });
  }
  function getSimplifiedFilter(filter) {
    let arr = [],
      items = [];
    try {
      if (Object.keys(filter.dates).length !== 0)
        filter.dates = {
          startDate: filter.dates.selection.startDate.getTime(),
          endDate: filter.dates.selection.endDate.getTime(),
        };
    } catch (error) {
      filter.dates = {};
    }
    try {
      if (Object.keys(filter.promo).length !== 0) {
        Object.keys(filter.promo.promo1).map((key) => {
          if (filter.promo.promo1[key]) arr.push(parseInt(key));
        });
      }
    } catch (error) {}
    filter.promo = arr;
    arr = [];
    try {
      if (Object.keys(filter.price).length !== 0) {
        arr = [filter.price.priceRange["0"], filter.price.priceRange["1"]];
      }
    } catch (error) {}
    filter.price = arr;
    arr = [];
    try {
      if (Object.keys(filter.note).length !== 0) {
        Object.keys(filter.note.star).map((key, idx) => {
          if (filter.note.star[key]) arr.push(idx + 1);
        });
      }
    } catch (error) {}
    filter.note = arr;

    items = ["equestrianLevel", "comfortLevel", "physicalLevel"];
    items.map((item) => {
      arr = [];
      try {
        if (Object.keys(filter[item]).length !== 0) {
          Object.keys(filter[item].cat1).map((key, idx) => {
            if (filter[item].cat1[key]) arr.push(idx + 1);
          });
        }
      } catch (error) {}
      filter[item] = arr;
    });
    items = ["destinations", "activities", "divers"];
    items.map((item) => {
      arr = [];
      try {
        Object.keys(filter[item]).map((item_key) => {
          Object.keys(filter[item][item_key]).map((subitem_key) => {
            if (filter[item][item_key][subitem_key]) arr.push(subitem_key);
          });
        });
      } catch (error) {}
      filter[item] = arr;
    });

    try {
      if (filter.divers.includes("with") && filter.divers.includes("without"))
        filter.divers.splice(-2);
    } catch (error) {
      filter.divers = [];
    }
    arr = [];
    try {
      if (Object.keys(filter.search).length !== 0) {
        Object.keys(filter.search.tags).map((key, idx) => {
          if (filter.search.tags[key]) arr.push(filter.search.tags[key].text);
        });
      }
    } catch (error) {}
    filter.search = arr;
    return filter;
  }
  function isFilteredDatesPromo(ann, dates, promo) {
    function promoIn(np, date, promo) {
      if (!np) return false; //no date.promo as there is req
      for (let i = 0; i < promo.length; i++) {
        if (date.promotion >= promo[i]) return true;
      }
      return false;
    }
    function getN(annDates, key) {
      for (let i = 0; i < annDates.length; i++) {
        if (Object.keys(annDates[i]).includes(key)) {
          return true;
        }
      }
      return false;
    }
    const nrd = Object.keys(dates).length > 0,
      nrp = promo.length > 0;
    if (!nrd && !nrp) return true; //no dates nor promo req, returns true whatever n
    let n = Object.keys(ann).includes("dates");
    const nd = n ? getN(ann.dates, "period") : false,
      np = n ? getN(ann.dates, "promotion") : false;
    if (!n && (nrd || nrp)) return false; //no dates in ann as there are dates or promo req
    if ((!nd && nrd) || (!np && nrp)) return false; //no dates as there is dates req, no promo as there is promo req
    n = ann.dates.length;
    const bls = [];
    let i,
      j,
      bl = false;
    let date = null;
    for (i = 0; i < n; i++) {
      date = ann.dates[i];
      bls.push([
        nrd
          ? parseISO(date.period.dateStart).getTime() >= dates.startDate
          : true,
        nrd ? parseISO(date.period.dateStart).getTime() <= dates.endDate : true,
        nrd ? parseISO(date.period.dateEnd).getTime() >= dates.startDate : true,
        nrd ? parseISO(date.period.dateEnd).getTime() <= dates.endDate : true,
        nrd
          ? parseISO(date.period.dateStart).getTime() <= dates.startDate
          : true,
        nrd ? parseISO(date.period.dateEnd).getTime() >= dates.endDate : true,
        nrp ? promoIn(np, date, promo) : true, //if promo req, check that date.promo fulfills req
      ]);
    }
    for (i = 0; i < n; i++) {
      bl = false;
      for (j = 0; j < 6; j += 2) {
        bl = bl || (bls[i][j] && bls[i][j + 1] && bls[i][6]);
      }
      if (bl) return true;
    }
    return false;
  }
  function isFilteredPrice(ann, price) {
    if (price.length === 0) return true; //no price req, returns true whatever ann
    if (ann.priceAdulte >= price[0] && ann.priceAdulte <= price[1]) return true;
    return false;
  }
  function isFilteredNote(ann, note) {
    if (note.length === 0) return true; //no note req, returns true whatever ann
    const annNote = Math.round(getAnnounceRating(ann)),
      n = note.length;
    for (let i = 0; i < n; i++) {
      if (annNote === note[i]) return true;
    }
    return false;
  }
  function isFilteredLevel(level, ann, levels) {
    if (levels.length === 0) return true; //no level req, returns true whatever ann
    const n = levels.length;
    for (let i = 0; i < n; i++) {
      if (ann[level] === levels[i]) return true;
    }
    return false;
  }
  function isFilteredMulti(item, idx, ann, items) {
    if (items.length === 0) return true; //no req, returns true whatever ann
    const n = items.length;
    for (let i = 0; i < n; i++) {
      if ((idx === -1 ? ann[item] : ann[item][idx]) === items[i]) return true;
    }
    return false;
  }
  function isFilteredVarious(ann, items) {
    if (items.length === 0) return true; //no req, returns true whatever ann
    const n = items.length,
      bls = [];
    let i;
    for (i = 0; i < n; i++) {
      switch (items[i]) {
        case "with":
          bls.push(ann.haveGuide !== null ? ann.haveGuide : false);
          break;
        case "without":
          bls.push(ann.haveGuide !== null ? !ann.haveGuide : true);
          break;
        default:
          bls.push(ann[items[i]]);
      }
    }
    if (bls.includes(false)) return false;
    return true;
  }
  function isFilteredSearch(ann, searches) {
    if (searches.length === 0) return true; //no req, returns true whatever ann
    const n = searches.length;
    let regex = null;
    for (let i = 0; i < n; i++) {
      regex = new RegExp(".*" + searches[i] + ".*", "i"); //not case sensitive
      if (regex.test(ann.title[lang]) || regex.test(ann.description[lang]))
        return true;
    }
    return false;
  }
  function handleFilter(filter, data) {
    const fltr = getSimplifiedFilter(_.cloneDeep(filter));
    const filtered = _.filter(data, (ann, idx) => {
      return (
        isFilteredDatesPromo(ann, fltr.dates, fltr.promo) &&
        isFilteredPrice(ann, fltr.price) &&
        isFilteredNote(ann, fltr.note) &&
        isFilteredLevel("equestrianLevel", ann, fltr.equestrianLevel) &&
        isFilteredLevel("comfortLevel", ann, fltr.comfortLevel) &&
        isFilteredLevel("physicalLevel", ann, fltr.physicalLevel) &&
        isFilteredMulti("destination", 1, ann, fltr.destinations) && //ann.destination=[continent, country]
        isFilteredMulti("category", -1, ann, fltr.activities) &&
        isFilteredVarious(ann, fltr.divers) &&
        isFilteredSearch(ann, fltr.search)
      );
    });
    setFilteredData(filtered);
  }
  function prt(id, data) {
    data.map((ann) => {
      console.log(ann._id, ann[id]);
    });
  }
  function handleSort(id, order) {
    setSort({id, order});
  }
  function getFilteredDataSorted(sort, rawData) {
    let orderedData = null;
    switch (sort.id) {
      case "Prix":
        orderedData = rawData.sort((ann1, ann2) =>
          ann1.priceChild && ann2.priceChild
            ? ann1.priceAdulte < ann1.priceChild &&
              ann2.priceAdulte < ann2.priceChild
              ? (ann2.priceAdulte - ann1.priceAdulte) * sort.order === "asc"
                ? -1
                : 1
              : ann1.priceChild < ann1.priceAdulte &&
                ann2.priceChild < ann2.priceAdulte
              ? (ann2.priceChild - ann1.priceChild) * sort.order === "asc"
                ? -1
                : 1
              : ann1.priceAdulte < ann1.priceChild &&
                ann2.priceAdulte > ann2.priceChild
              ? (ann2.priceChild - ann1.priceAdulte) * sort.order === "asc"
                ? -1
                : 1
              : ann1.priceAdulte > ann1.priceChild &&
                ann2.priceAdulte < ann2.priceChild
              ? (ann2.priceAdulte - ann1.priceChild) * sort.order === "asc"
                ? -1
                : 1
              : null
            : (ann2.priceAdulte - ann1.priceAdulte) * sort.order === "asc"
            ? -1
            : 1
        );
        break;
      case "Avis":
        orderedData = rawData.sort((ann1, ann2) =>
          ((ann2.numberRatings
            ? (ann2.environmentLandscapeNote +
                ann2.cavalryNote +
                ann2.qualityPriceNote +
                ann2.receptionNote +
                ann2.horseAroundNote) /
              5
            : ann2.horseAroundNote) -
            (ann1.numberRatings
              ? (ann1.environmentLandscapeNote +
                  ann1.cavalryNote +
                  ann1.qualityPriceNote +
                  ann1.receptionNote +
                  ann1.horseAroundNote) /
                5
              : ann1.horseAroundNote)) *
            sort.order ===
          "asc"
            ? -1
            : 1
        );
        break;
      case "Niveau équestre":
        orderedData = _.orderBy(rawData, ["equestrianLevel"], [sort.order]);
        break;
      case "Niveau Physique":
        orderedData = _.orderBy(rawData, ["physicalLevel"], [sort.order]);
        break;
      case "Niveau de confort":
        orderedData = _.orderBy(rawData, ["comfortLevel"], [sort.order]);
        break;
      default:
        orderedData = _.orderBy(
          rawData,
          [(item) => item.creationDate.$date],
          [sort.order]
        );
    }
    return split(orderedData);
  }
  return (
    <div>
      <Meta id="announces"></Meta>
      <Banner
        title={
          <FormattedMessage id="src.components.annoncesPage.annonces.title" />
        }
      />
      {
        <>
          <FilterSort
            presetFilter={
              Object.keys(presetFilter).length > 0
                ? presetFilter
                : cookies.filter && cookies.filter.filter
                ? cookies.filter.filter
                : {}
            }
            onSearch={handleSearch}
            onFilter={(filter) => {
              handleFilter(filter, state);
            }}
            onSort={(id, order) => {
              handleSort(id, order);
            }}
          ></FilterSort>
          <Announces
            announces={getFilteredDataSorted(sort, filteredData)}
          ></Announces>
        </>
      }
    </div>
  );
}

export default PageContent;
