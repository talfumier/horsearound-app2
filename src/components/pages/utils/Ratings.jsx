import star from "./img/grading/star.png";
import starGrey from "./img/grading/greystar.png";
import horse from "./img/grading/horse.png";
import horseGrey from "./img/grading/greyhorse.png";
import run from "./img/grading/run.png";
import runGrey from "./img/grading/greyrun.png";
import bed from "./img/grading/bed.png";
import bedGrey from "./img/grading/greybed.png";

export function getNStars(n) {
  let stars = [];
  let comp = null;
  for (let i = 0; i < n; i++) {
    comp = (
      <span>
        <img className="fit-picture" src={star} alt="img" />
        <span>
          <abbr> </abbr>
        </span>
      </span>
    );
    stars.push(<span key={i + n * 3}>{comp}</span>);
  }
  return stars;
}
export function getStars(rating, type, img, imgGrey) {
  //type > "span" or "li"
  let stars = [];
  let comp = null;
  for (let i = 0; i < Math.round(rating); i++) {
    comp = (
      <>
        <img className="fit-picture" src={img} alt="img" />
        <span>
          <abbr> </abbr>
        </span>
      </>
    );
    stars.push(
      type === "span" ? <span key={i}>{comp}</span> : <li key={i}>{comp}</li>
    );
  }
  for (let i = Math.round(rating); i < 5; i++) {
    comp = (
      <>
        <img className="fit-picture" src={imgGrey} alt="imgGrey" />
        <span>
          <abbr> </abbr>
        </span>
      </>
    );
    stars.push(
      type === "span" ? <span key={i}>{comp}</span> : <li key={i}>{comp}</li>
    );
  }
  return stars;
}
export function getAnnounceRating(ann) {
  return ann.numberRatings
    ? (ann.environmentLandscapeNote +
        ann.cavalryNote +
        ann.qualityPriceNote +
        ann.receptionNote +
        ann.horseAroundNote) /
        5
    : ann.horseAroundNote;
}
export function StarRating({announce}) {
  return (
    <div className="d-flex justify-content-left">
      {getStars(getAnnounceRating(announce), "span", star, starGrey)}
    </div>
  );
}
export function HorseRating({level}) {
  return (
    <div className="d-flex justify-content-left">
      {getStars(level, "span", horse, horseGrey)}
    </div>
  );
}
export function PhysicalRating({level}) {
  return (
    <div className="d-flex justify-content-left">
      {getStars(level, "span", run, runGrey)}
    </div>
  );
}
export function BedRating({level}) {
  return (
    <div className="d-flex justify-content-left">
      {getStars(level, "span", bed, bedGrey)}
    </div>
  );
}
export function StarRatingLevel({level}) {
  return (
    <div className="d-flex justify-content-left">
      {getStars(level, "span", star, starGrey)}
    </div>
  );
}
