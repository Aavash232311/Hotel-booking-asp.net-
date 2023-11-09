import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { Layout } from "./components/Layout";
import "./custom.css";
import Services from "./utils/services";
import jwt_decode from "jwt-decode";
import { Outlet } from "react-router-dom";

export default class App extends Component {
  static displayName = App.name;
  constructor(props) {
    super(props);
    this.utils = new Services();
    this.state = {
      render: false,
      loading: false,
      isLoggedIn: false,
    };
    // this.intervalId = setInterval(this.refreshToken, 270000); // 4.5 minutes in milliseconds
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  componentDidMount = () => {
    this.refreshToken();
  }

  refreshToken = async () => {
    try {
      await fetch("auth/RefreshToken", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }).then(rs => rs.json()).then((response) => {
        const {statusCode, value} = response;
        if (statusCode === 200) {
          localStorage.setItem("authToken", value);
        }else{
          // localStorage.removeItem("authToken", value); // login required 
        }
      })
    } catch (error) {
      console.error("Error:", error);
    }
  };

  render() {
    const RouteStackMiddleware = (rest) => {
      const [loggedIn, setLoggedIn] = React.useState(null);
      if (rest.login) {
        //since the user is logged in lets check in the required role
        const { roles } = rest; // page demainding role
        // check if the user is logged in
        this.utils.isLoggedIn().then((x) => {
          const { statusCode } = x;
          if (statusCode === 200) {
            setLoggedIn(true);
            return;
          }
          const { value } = x;
          if (value === false) {
            setLoggedIn(false);
            return;
          }
        });
        if (loggedIn === false) {
          return <>user not logged in {localStorage.getItem("authToken")}</>;
        }
        if (loggedIn === true) {
          if (roles.length === 0) return <Outlet />; // since we dont need any roles to access particular page
          const decoded = jwt_decode(this.utils.getToken());
          for (const i in decoded) {
            if (
              i ===
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ) {
              const clientRole = decoded[i]; // since client can have only one role,
              // lets find client role in the page demanding role
              const findRole = roles.find((x) => x === clientRole);
              if (findRole === undefined) {
                return <>status 500</>;
              } else {
                return <Outlet />;
              }
            }
          }
        }
        return <>Procressing...</>;
      } else {
        // since page is not asking for login
        return <Outlet />;
      }
    };
    return (
      <div>
        {this.state.loading && (
          <div>
            <center>
              <h6>Loading ...</h6>
            </center>
          </div>
        )}

        {!this.state.loading && (
          <div>
            <Layout>
              <Routes>
                {AppRoutes.map((route, index) => {
                  // this part will be migrated above
                  const { element, login, roles, ...rest } = route;
                  return (
                    <Route
                      element={
                        <RouteStackMiddleware
                          path={rest.path}
                          roles={roles}
                          login={login}
                        />
                      }
                      key={index}
                    >
                      <Route {...rest} element={element} />
                    </Route>
                  );
                })}
              </Routes>
            </Layout>
          </div>
        )}
      </div>
    );
  }
}
