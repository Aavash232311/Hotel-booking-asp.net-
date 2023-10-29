import { Home } from "./components/Home";
import AdminNav from "./components/Admin/AdminNav";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import RegisterHotel from "./components/Business/RegisterHotel";
import Hotel from "./components/Business/Hotel";
import RoomHotel from "./components/Business/HotelRoom";
import HotemInfo from "./components/Business/HotelInfo";

const AppRoutes = [
  {
    index: true,
    element: <Home />,
    login: false,
    roles: []
  },
  {
    path: "/nav-admin",
    element: <AdminNav />,
    login: true,
    roles: ["Admin"]
  },
  {
    path: "/login-user",
    element: <Login />,
    login: false,
    roles: []
  },
  {
    path: "/register-user",
    element: <Register />,
    login: false,
    roles: []
  },
  {
    path: "/register-hotel",
    element: <RegisterHotel />,
    login: true,
    roles: []
  },
  {
    path: "/management",
    element: <Hotel />,
    login: true,
    roles: ["Manager"]
  },
  {
    path: "/room-hotel",
    element: <RoomHotel />,
    login: true,
    roles: ["Manager"]
  }, 
  {
    path: "/HotemInfo",
    element: <HotemInfo />,
    login: true,
    roles: ["Manager"]
  }
];

export default AppRoutes;
