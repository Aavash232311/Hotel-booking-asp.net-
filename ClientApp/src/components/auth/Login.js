import React, { Component } from "react";
import "../Static/auth/login.css";
import AuthContext, { AuthProvider } from "../auth";

class Login extends Component {
  state = {
    username: null,
    password: null,
  };

  updateEvent = (ev) => {
    const { value, name } = ev.target;
    this.setState({ [name]: value });
  };
  render() {
    return (
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            const loginRequest = () => {
              if (this.state.username !== "" && this.state.password !== "") {
                value
                  .logIn(this.state.username, this.state.password)
                  .then((rsp) => {
                    if (rsp !== true) {
                      this.setState({ errorRender: true });
                    } else {
                      const urlParams = new URLSearchParams(
                        window.location.search
                      );
                      let myParam = urlParams.get("call"); // conept of callback function
                      if (!myParam) {
                        window.location.href = "/";
                      }
                    }
                  });
              }
            };
            return (
              <div>
                <div className="login-component">
                  <center>
                    <div id="login-frame">
                      <center>
                        <h4 id="login-label">Login</h4>
                      </center>
                      <br />
                      <span className="side-label">username</span> <br />
                      <input
                        placeholder="enter your username"
                        className="login-input form-control"
                        onInput={this.updateEvent}
                        name="username"
                        autoComplete="off"
                      ></input>
                      <br />
                      <span className="side-label">password</span> <br />
                      <input
                        type="password"
                        placeholder="enter your password"
                        className="login-input form-control"
                        onInput={this.updateEvent}
                        name="password"
                      ></input>
                      <span className="side-label">forgot password?</span>{" "}
                      <br />
                      <button
                        onClick={loginRequest}
                        className="btn btn-outline-primary login-input"
                      >
                        login
                      </button>
                      <hr style={{visibility: "hidden", height: "100px"}} ></hr>
                      {this.state.errorRender ? (
                        <>
                          <div
                            className="alert alert-warning login-input"
                            role="alert"
                            style={{marginTop: "20px"}}
                          >
                            username or password incorrect!!
                          </div>
                        </>
                      ) : null}
                    </div>
                  </center>
                </div>
              </div>
            );
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
  }
}

export default Login;
