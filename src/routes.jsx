import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
 
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables} from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import { Medecins } from "./pages/dashboard/Medecin/Medecins";
import Departement from "./pages/dashboard/Departements/Departement";
import { Secretaires } from "./pages/dashboard/Secretaire/Secretaires";
import Patients from "./pages/dashboard/Patients/Patients";
import {Disponibilite} from "./pages/dashboard/Disponibilite/disponibilite";
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
        name: "Départements",
        path: "/Departements",
        element: <Departement />,
      }  ,
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Médecins",
        path: "/Medecins",
        element: <Medecins />,
      }  ,
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Secrétaires",
        path: "/Secretaires",
        element: <Secretaires/>,
      }  ,
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Patients",
        path: "/Patients",
        element: <Patients/>,
      }  ,
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      }  ,
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Disponibilite",
        path: "/Disponibilite",
        element: <Disponibilite />,
      }  
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
