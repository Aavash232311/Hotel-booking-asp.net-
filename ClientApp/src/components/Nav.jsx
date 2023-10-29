import React, { Component } from "react";
import "./Static/nav.css";
import Services from "../utils/services";
import { NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import AuthContext, { AuthProvider } from "./auth";

class Nav extends Component {
  constructor(props) {
    super(props);
    this.utils = new Services();
    this.state = {
      login: false,
    };
  }
  componentDidMount = () => {
    // check if user is logged in by valadation jwt with the server
    fetch("auth/authorize", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.utils.getToken(),
      },
      method: "get",
    }).then((rsp) => {
      const { status } = rsp;
      if (status === 200) {
        // we are doing a constructor check to check a jwt on a very surface level
        // to make sure we are not stuck on a glitch like we faced on our previous project
        this.setState({ login: true });
      } else {
        this.setState({ login: false });
      }
    });
  };
  render() {
    return (
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            const user = value.user;
            const role = this.utils.getUserRole(user);

            return (
              <div id="nav-bar">
                <div id="logo">Bespeaking</div>
                <div id="u-list-nav">
                  <div className="h-list">
                    {this.utils.getUserRole() === "Manager" ? (
                      <>
                        <div className="h-list">
                          <NavItem>
                            <NavLink tag={Link} to="/management">
                              hotel adminstration
                            </NavLink>
                          </NavItem>
                        </div>
                      </>
                    ) : null}
                    {this.state.login === true ? (
                      <>
                        <div onClick={value.logOut} className="h-list">
                          Logout
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-list">
                          <NavItem>
                            <NavLink tag={Link} to="/login-user">
                              login
                            </NavLink>
                          </NavItem>
                        </div>
                        <div className="h-list">
                          <NavItem>
                            <NavLink tag={Link} to="/register-user">
                              register
                            </NavLink>
                          </NavItem>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
  }
}

export default Nav;
