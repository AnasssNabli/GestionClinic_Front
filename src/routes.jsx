import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
 
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables,Clients,Projets, Notifications,Users,Etat,Facture} from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Gestion des clients",
        path: "/clients",
        element: <Clients />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Gestion des utilisateurs",
        path: "/users",
        element: <Users />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Gestion des projets",
        path: "/projets",
        element: <Projets />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Gestion des Progressions",
        path: "/etat-avancement",
        element: <Etat />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Gestion des Factures",
        path: "/factures",
        element: <Facture />,
      },
      
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
