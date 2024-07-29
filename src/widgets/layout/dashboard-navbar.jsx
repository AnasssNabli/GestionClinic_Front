import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { logout } from "@/services/loginservice";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "@/context";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await logout(token);
      }
      localStorage.clear();
      navigate("/auth/sign-in");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                
                className="font-normal opacity-50 transition-all text-blue-900 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              
              className="font-normal text-blue-900"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" className="text-blue-900">
            {page}
          </Typography>
        </div>
        <div className="flex items-center">
          
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
          <Menu>
            <MenuHandler>
              <Button
                variant="text"
                color="blue-gray"
                className="hidden items-center gap-1 px-4 xl:flex normal-case text-blue-900"
              >
                <img src="/img/user.png" alt="Profile" className="h-5 w-5" />
                Votre profil
              </Button>
            </MenuHandler>
            <MenuList>
              <MenuItem className="flex">
                <img src="/img/user.png" alt="Profile" className="h-5 w-5 mr-2" />
                <Link to="/dashboard/profile">Votre profil</Link>
              </MenuItem>
              <MenuItem onClick={handleLogout} className="flex">
                <img src="/img/user.png" alt="Sign out" className="h-5 w-5 mr-2" />
                <p>Se déconnecter</p>
              </MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray" className="grid xl:hidden">
                <img src="/img/user.png" alt="Profile" className="h-5 w-5" />
              </IconButton>
            </MenuHandler>
            <MenuList>
              <MenuItem>
                <Link to="/profile">Votre profil</Link>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <img src="/img/user.png" alt="Sign out" className="h-5 w-5 mr-2" />
                Se déconnecter
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
