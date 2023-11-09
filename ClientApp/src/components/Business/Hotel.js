import React, { Component } from "react";
import "../Static/business/hotel.css";
import { NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import Services from "../../utils/services";
import { AiOutlineWarning } from "react-icons/ai";

class Hotel extends Component {
  constructor(props) {
    super(props);
    this.utils = new Services();
    this.state = {
      hotel: null,
      error: null,
    };
  }
  componentDidMount() {
    fetch("hotel/get-hotel", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.utils.getToken(),
      },
      method: "get",
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { value } = response;
        this.setState({ hotel: value });
      });
  }

  makeLive = () => {
    fetch("hotel/make-hotel-live", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.utils.getToken(),
      },
      method: "get",
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { value } = response;
        if (value === "your hotel is live") {
          if (this.state.hotel !== null) {
            window.location.reload();
          }
        }
        this.setState({ error: [value] });
      });
  };
  closeAlertClick = (ev, j) => {
    let arr = [...this.state.error];
    arr = arr.filter((i) => arr.indexOf(i) !== j);
    this.setState({ error: arr });
  };
  render() {
    return (
      <div id="componenet-main">
        <nav
          className="navbar navbar-light"
          id="hotel-nav-bar"
          style={{ backgroundColor: "#e3f2fd" }}
        >
          <span className="navbar-brand" href="#">
            Hotel adminstration
            {this.state.hotel !== null ? (
              <span> ({this.state.hotel.company.name})</span>
            ) : null}
          </span>

          <div className="hotel-nav-list">
            <NavItem>
              <NavLink tag={Link} to="/room-hotel">
                room options
              </NavLink>
            </NavItem>
          </div>
          <div className="hotel-nav-list">
            <NavItem>
              <NavLink tag={Link} to="/HotemInfo">
                hotel information
              </NavLink>
            </NavItem>
          </div>
          <div className="hotel-nav-list">
            <NavItem>
              <NavLink tag={Link} to="/transaction">
                transaction
              </NavLink>
            </NavItem>
          </div>
          <div className="hotel-nav-list">
            <NavItem>
              <NavLink tag={Link} to="/">
                surf
              </NavLink>
            </NavItem>
          </div>
        </nav>
        {this.state.error !== null
          ? this.state.error.map((i, j) => {
              return (
                <React.Fragment key={j}>
                  {" "}
                  <div className="alert alert-info alertHotel" role="alert">
                    {i}
                    <button
                      type="button"
                      className="close"
                      data-dismiss="alert"
                      aria-label="Close"
                      onClick={(ev) => {
                        this.closeAlertClick(ev, j);
                      }}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>{" "}
                  <hr style={{ visibility: "hidden" }} />
                </React.Fragment>
              );
            })
          : null}
        <footer>
          {this.state.hotel !== null &&
          this.state.hotel.hotel.live === false ? (
            <div id="warningLeft" className="p-3 mb-2 bg-warning text-dark">
              <AiOutlineWarning /> at least one <b>room</b> and{" "}
              <b>transaction detail (At lest one)</b> required for hotel to be{" "}
              <b>
                live{" "}
                <a
                  onClick={this.makeLive}
                  style={{
                    textDecoration: "underline",
                    color: "blue",
                    cursor: "pointer",
                  }}
                >
                  click here
                </a>
              </b>
            </div>
          ) : null}
        </footer>
      </div>
    );
  }
}

export default Hotel;
