import img from "../../../images/banner1.jpg";

function Banner({title}) {
  return (
    <section
      className="pageTitle"
      style={{backgroundImage: {img}, marginTop: 65}}
    >
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="titleTable">
              <div className="titleTableInner">
                <div className="pageTitleInfo">
                  <h1>{title}</h1>
                  <div className="under-border" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
