import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Avatar, Button, IconButton, Typography } from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import routes from "@/routes";  // Import your routes

export function Sidenav({ brandImg, brandName }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  // Get user type from localStorage
  const userType = localStorage.getItem("type");

  // Define route filters based on user type
  const routeFilters = {
    admin: ["dashboard", "profile", "Départements", "Médecins", "Secrétaires", "Patients"],
    medecin: ["dashboard", "profile", "Patients", "Rendez Vous", "Disponibilite", "Visites"],
    secretary: ["dashboard", "profile", "Patients", "Rendez Vous", "Disponibilite", "Visites"],
    patient: ["dashboard", "profile", "Rendez Vous", "Visites"]
  };

  // Filter routes based on user type
  const filteredRoutes = routes
    .filter(route => route.layout !== "auth")
    .map(route => ({
      ...route,
      pages: route.pages.filter(page => routeFilters[userType]?.includes(page.name))
    }))
    .filter(route => route.pages.length > 0);

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div className="relative">
        <Link to="/" className="py-6 px-8 text-center">
          <Typography variant="h6" className="text-blue-900">
            {brandName}
          </Typography>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4">
        {filteredRoutes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {pages.map(({ icon, name, path }) => (
              <li key={name}>
                <NavLink to={`/${layout}${path}`}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "filled" : "text"}
                      className={`flex items-center gap-4 px-4 capitalize ${
                        isActive ? "bg-blue-900 text-white" : "text-blue-900"
                      }`}
                      fullWidth
                    >
                      {icon}
                      <Typography color="inherit" className="font-medium capitalize">
                        {name}
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/favicon.png",
  brandName: "Gestion Hopital",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
};

Sidenav.displayName = "/src/widgets/layout/sidenav.jsx";

export default Sidenav;
