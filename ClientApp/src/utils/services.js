import jwt_decode from "jwt-decode";
export default class Services {
  getToken = () => {
    return localStorage.getItem("authToken");
  };
  async isLoggedIn() {
    if (this.getToken() === null) {
      return Promise.resolve({ value: false });
    }
    return fetch("auth/authorize/", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.getToken(),
      },
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        return response;
      })
      .catch((err) => {});
  }
  getUserRole() {
    const token = localStorage.getItem("authToken");
    if (token == null) return null;
    const decoded = jwt_decode(token);
    for (const key in decoded) {
      if (
        key === "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ) {
        const userRole = decoded[key];
        return userRole;
      }
    }
  }
  userId() {
    const decoded = jwt_decode(this.getToken());
    for (let i in decoded) {
      if (i === "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name") {
        return decoded[i];
      }
    } // for other api write logic here
  }
}
