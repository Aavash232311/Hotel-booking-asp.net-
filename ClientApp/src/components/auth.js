import { createContext, useState } from "react";

const AuthContext = createContext(undefined);

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const authToken = localStorage.getItem("authToken");

  const [user, setUser] = useState(() => (authToken ? authToken : null));

  const logOut = () => {
    localStorage.removeItem("authToken");
    window.location.reload();
  };
  const logIn = async (username, password) => {
    let data = await fetch("/auth/login/", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: username,
        Password: password,
      }),
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        return response;
      });
    if (data.statusCode === 200) {
      localStorage.setItem("authToken", data.value);
      setInterval(() => {
        fetch("/auth/RefreshToken/", {
          method: "get",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((rsp) => rsp.json())
          .then((response) => {
            if (response.statusCode === 200) {
              localStorage.setItem("authToken", response.value);
            } else {
              logOut();
            }
          });
      }, 540000);
      setUser(true);
      return true;
    }
    setUser(false);
    return false;
  };

  let methods = {
    user: user,
    logOut: logOut,
    logIn: logIn,
  };

  return (
    <AuthContext.Provider value={methods}>{children}</AuthContext.Provider>
  );
};