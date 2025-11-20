import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../layout/AppLayout";

// Venues / public
import Home from "../features/venues/Home";
import VenuesList from "../features/venues/VenuesList";
import VenueDetail from "../features/venues/VenueDetail";

// Auth + profile
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import ProfilePage from "../features/profile/ProfilePage";

// Bookings
import MyBookings from "../features/bookings/MyBookings";

// Route guards
import Protected from "./Protected";
import ManagerRoute from "./ManagerRoute";

// Manager
import ManagerVenues from "../features/manager/ManagerVenues";
import ManagerVenueNew from "../features/manager/ManagerVenueNew";
import ManagerVenueEdit from "../features/manager/ManagerVenueEdit";
import ManagerVenueBookings from "../features/manager/ManagerVenueBookings";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/venues", element: <VenuesList /> },
      { path: "/venues/:id", element: <VenueDetail /> },
      { path: "/auth/login", element: <Login /> },
      { path: "/auth/register", element: <Register /> },

      // Logged-in users
      {
        element: <Protected />,
        children: [
          { path: "/bookings", element: <MyBookings /> },
          { path: "/profile", element: <ProfilePage /> },
        ],
      },

      // Venue managers only
      {
        element: <ManagerRoute />,
        children: [
          { path: "/manager/venues", element: <ManagerVenues /> },
          { path: "/manager/venues/new", element: <ManagerVenueNew /> },
          { path: "/manager/venues/:id/edit", element: <ManagerVenueEdit /> },
          { path: "/manager/venues/:id/bookings", element: <ManagerVenueBookings /> },
        ],
      },
    ],
  },
]);