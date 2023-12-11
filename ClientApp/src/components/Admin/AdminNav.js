import React, { Component } from "react";
import "../Static/admin.css";
import { BsStack } from "react-icons/bs";
import User from "./User";
import Role from "./Role";
import Company from "./Company";
// in this admin panel we have broken css
// due to bootstrap and thiis react css overlapping
// so the entrie structure of this application is messed up
// so we are recreating another one 
class AdminNav extends Component {
  state = {
    render: "",
    showNav: false,
  };

  localCompoenet = (ev, name) => {
    ev.preventDefault();
    this.setState({
      render: name,
    });
  };
  toggleNav = () => {
    this.setState({ showNav: !this.state.showNav });
  };
  ConditionalRendering = () => {
    const { render } = this.state;
    switch (render) {
      case "user":
        return <User />;
      case "role":
        return <Role />;
      case "company":
        return <Company />;
      default:
        return null;
    }
  };
  render() {
    return (
      <div>
        <div className="adminFrame">
          <div id="admin">
            <BsStack
              id="nav-toggle"
              onClick={this.toggleNav}
              className="mr-2"
            />
            <div id="navbar" className={this.state.showNav ? "show" : ""}>
              <BsStack id="nav-hide-option" onClick={this.toggleNav} />
              <center>
                <h5 id="labelHeading">Adminstration</h5>
              </center>
              <a
                onClick={(ev) => {
                  this.localCompoenet(ev, "user");
                }}
                href="#option1"
              >
                Users
              </a>
              <a
                onClick={(ev) => {
                  this.localCompoenet(ev, "role");
                }}
                href="#option2"
              >
                Role Management
              </a>
              <a
                onClick={(ev) => {
                  this.localCompoenet(ev, "company");
                }}
                href="#option2"
              >
                Company{" "}
              </a>
              <a href="#option3">Surf</a>
            </div>
            <div id="content">
              <center>
                <h5>Admin Page</h5>
                {this.ConditionalRendering()}
              </center>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminNav;
