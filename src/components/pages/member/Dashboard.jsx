import {FormattedMessage} from "react-intl";

function DashBoard({announces, bookings, invoices, user, onHandleToggle}) {
  return (
    <div className="w-100" id="parent">
      <section className="blockSection">
        <div className="container">
          <div className="row justify-content-center">
            <div
              className="col-md-4 col-sm-6 col-xs-12"
              style={{cursor: "pointer"}}
              onClick={() => {
                onHandleToggle(3, user); //Bookings
              }}
            >
              <div
                className="content-block"
                style={{backgroundColor: "#8caa7b"}}
              >
                <div
                  className="media bg-blue-c"
                  style={{backgroundColor: "#8caa7b"}}
                >
                  <div className="media-body ">
                    <h4 className="media-heading">{bookings.nbBookings}</h4>
                    <p>
                      <FormattedMessage id="src.components.memberPage.DashBoard.phrase1" />
                    </p>
                  </div>
                  <div className="media-right ">
                    <div
                      className="icon bg-blue-b"
                      style={{backgroundColor: "#8caa7b"}}
                    >
                      <i
                        className="fa fa-calendar-check-o"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {user.type === "pro" ? (
              <div
                className="col-md-4 col-sm-6 col-xs-12"
                style={{cursor: "pointer"}}
                onClick={() => {
                  onHandleToggle(2, user); //Pro announces
                }}
              >
                <div
                  className="content-block"
                  style={{backgroundColor: "#8caa7b"}}
                >
                  <div
                    className="media bg-red-c"
                    style={{backgroundColor: "#8caa7b"}}
                  >
                    <div className="media-body">
                      <h4 className="media-heading">{announces.length}</h4>
                      <p>
                        <FormattedMessage id="src.components.memberPage.DashBoard.phrase2" />
                      </p>
                    </div>
                    <div className="media-right">
                      <div
                        className="icon bg-red-b"
                        style={{backgroundColor: "#8caa7b"}}
                      >
                        <i className="fa fa-leanpub" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {user.type === "pro" ? (
              <div
                className="col-md-4 col-sm-6 col-xs-12"
                style={{cursor: "pointer"}}
                onClick={() => {
                  onHandleToggle(5, user); //Invoices
                }}
              >
                <div
                  className="content-block"
                  style={{backgroundColor: "#8caa7b"}}
                >
                  <div
                    className="media bg-green-c"
                    style={{backgroundColor: "#8caa7b"}}
                  >
                    <div className="media-body">
                      <h4 className="media-heading">{invoices.nbPending}</h4>
                      <p>
                        <FormattedMessage id="src.components.memberPage.DashBoard.phrase3" />
                      </p>
                    </div>
                    <div className="media-right">
                      <div
                        className="icon bg-green-b"
                        style={{backgroundColor: "#8caa7b"}}
                      >
                        <i className="fa fa-credit-card" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashBoard;
