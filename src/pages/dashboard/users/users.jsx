import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  CardHeader,
  Chip,
  Avatar,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { getusers, deleteuser } from "@/services/usersservices";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import  Dialogupdateuser  from "./updateuser";
import { confirmation } from "@/widgets/alert_confirmation";
export function Users() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogupOpen, setIsDialogupOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [usertoupdate, setUsertoupdate] = useState();
  const [reload, setReload] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const initialized = useRef(false)
  const clientsPerPage = 6;
  useEffect(() => {
  
       fetchData();      
      console.log(222);
  }, [reload]);
async function fetchData() {
      try {
        const data = await getusers();
        setUsers(data);
        
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    }
  const handledelete = async (idu) => {
    let confirmer = await confirmation();
    if (confirmer) {
      try {
        await deleteuser(idu);
        setReload(idu);
      } catch (error) {
        console.log(error);
      }
    } else {
      props.handleOpen();
    }
    
  };
  const handleupdateUserClick = (ids) => {
    setUsertoupdate(ids);
    setIsDialogupOpen(true);
  };
  const handleCloseDialogforup = () => {
    setIsDialogupOpen(false);
  };
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = users.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(users.length / clientsPerPage);
  const next = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12 ">
      <Card>
      <CardHeader
          variant="gradient"
          color="gray"
          className="mb-8 p-6 flex items-center justify-between"
        >
          <Typography variant="h6" color="white">
            Liste des utilisateur
          </Typography>
          
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
          <thead>
              <tr>
                {["Utilisateur", "City","Role","Actions"].map(
                  (el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  )
                )}
              </tr>
            </thead> 
            <tbody>
              {currentClients.map(({ id, username, email,city, id_role }) => (
                <tr key={id}>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                        <div className="flex items-center gap-4">
                          <Avatar src="/img/team-2.jpeg"  size="sm" />
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {username}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {email}
                            </Typography>
                          </div>
                        </div>
                    </td>
                  
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-semibold"
                    >
                      {city
                      }
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Chip
                          variant="gradient"
                          color={id_role === 1
                            ? "dark"
                            : id_role === 2
                            ? "blue-gray"
                            : "teal"}
                          value={id_role === 1
                            ? "Admin"
                            : id_role === 2
                            ? "BU Manager"
                            : "Consultant"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Button
                      color="red"
                      size="sm"
                      onClick={() => handledelete(id)}
                    >
                      Supprimer
                    </Button>&nbsp;&nbsp;
                    <Button
                      color="green"
                      size="sm"
                      onClick={() =>
                        handleupdateUserClick({
                          id,
                          id_role,
                        })
                      }
                    >
                      Modifier
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
        <div className="flex items-center justify-between px-6 pb-6">
          <Button variant="text" onClick={prev} disabled={currentPage === 1}>
            <ArrowLeftIcon className="h-5 w-5" /> Previous
          </Button>
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="text"
            onClick={next}
            disabled={currentPage === totalPages}
          >
            Next <ArrowRightIcon className="h-5 w-5" />
          </Button>
        </div>
      </Card>
      {isDialogupOpen && (
        <Dialogupdateuser
          open={isDialogupOpen}
          user={usertoupdate}
          setReload={setReload}
          handleOpen={handleCloseDialogforup}
        />
      )}
    </div>
  );
}

export default Users;
