import { Home } from "./components/Home";
import AdminNav from "./components/Admin/AdminNav";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import RegisterHotel from "./components/Business/RegisterHotel";
import Hotel from "./components/Business/Hotel";
import RoomHotel from "./components/Business/HotelRoom";
import HotemInfo from "./components/Business/HotelInfo";
import PublicHotel from "./components/public/hotel";
import Results from "./components/public/result";
import Transaction from "./components/Business/transaction";
import TransactionSuccess from "./components/public/transactionSuccess";
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
    login: false,
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
  },
  {
    path: "/see-content",
    element: <PublicHotel />,
    login: false,
    roles:[]
  },
  {
    path: "/night-owl-me",
    element: <Results />,
    login: false,
    roles: []
  },
  {
    path: "/transaction",
    element: <Transaction />,
    login: true, 
    roles: ["Manager"]
  },
  {
    path: "/success-esewa",
    element: <TransactionSuccess />,
    login: true,
    roles: []
  }
];

export default AppRoutes;
