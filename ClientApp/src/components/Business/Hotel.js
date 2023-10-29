import React, { Component } from "react";
import "../Static/business/hotel.css";
import { NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import Services from "../../utils/services";

class Hotel extends Component {
  constructor(props) {
    super(props);
    this.utils = new Services();
    this.state = {
      hotel: null,
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
              <NavLink tag={Link} to="/">
                surf
              </NavLink>
            </NavItem>
          </div>
        </nav>
      </div>
    );
  }
}

export default Hotel;
