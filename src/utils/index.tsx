import { Home, User, Calendar, Users } from "lucide-react";

export const pages = [
  {
    name: "Home",
    path: "/",
    description: "Welcome to Viby, your appointment management solution.",
    icon: <Home />,
  },
  {
    name: "Profile",
    path: "/profile",
    description: "Manage your profile and settings.",
    icon: <User />,
  },
  {
    name: "Appointments",
    path: "/appointments",
    description: "View and manage your appointments.",
    icon: <Calendar />,
  },
  {
    name: "Social",
    path: "/social",
    description: "Connect with friends and share your experiences.",
    icon: <Users />,
  },
];
