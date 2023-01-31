import {FormattedMessage} from "react-intl";
import ActivityBox from "./ActivityBox";

function HomeToursContent({selectedPack, cats, announces}) {
  function returningAnnounce(type) {
    let announce = null;
    announces.data.forEach((ann) => {
      if (ann.title === type) {
        announce = ann.announce;
      }
    });
    return announce;
  }
  return (
    <div className="row isotopeContainer">
      {selectedPack.map((cat) => {
        return (
          <ActivityBox
            key={cat}
            img={cats[cat].img}
            title={<FormattedMessage key={cats[cat].id} id={cats[cat].id} />}
            link={cats[cat].link}
            announce={returningAnnounce(cat)}
          />
        );
      })}
    </div>
  );
}

export default HomeToursContent;
