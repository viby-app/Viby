import type { $Enums } from "@prisma/client";
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

export type AppointmentModalDetails = {
  user: {
    name: string;
    id: string;
    phone: string | null;
    email: string | null;
    emailVerified: Date | null;
    isPhoneVerified: boolean;
    image: string | null;
    role: $Enums.Role;
    createdAt: Date;
    updatedAt: Date | null;
  };
};

export const statusBadgeColors: Record<string, string> = {
  BOOKED: "badge-warning",
  CANCELLED: "badge-error",
  COMPLETED: "badge-success",
};
