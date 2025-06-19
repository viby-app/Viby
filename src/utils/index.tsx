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


export const statusBadgeColors: Record<string, string> = {
  BOOKED: "badge-warning",
  CANCELLED: "badge-error",
  COMPLETED: "badge-success",
};

export const statusBorderColors: Record<string, string> = {
  BOOKED: "border-yellow-400",
  CANCELLED: "border-red-600",
  COMPLETED: "border-green-600",
};

export const swipeVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    position: "absolute",
  }),
  center: {
    x: 0,
    opacity: 1,
    position: "relative",
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    position: "absolute",
  }),
};