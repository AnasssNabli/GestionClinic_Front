import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Typography,
} from "@material-tailwind/react";
import { DialogWithForm } from "./addclient";
import { Dialogupdate } from "./updateclient";
import { getClientList, deleteClient } from "@/services/clientservices";
import { createproject,getproject } from "@/services/projetservices";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import swal from 'sweetalert'
import { confirmation } from "@/widgets/alert_confirmation";
export function Clients() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogupOpen, setIsDialogupOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [clienttoupdate, setClienttoupdate] = useState();
  const [reload, setReload] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [imgcount, setImgcount] = useState(1);
  const initialized = useRef(false)
  const clientsPerPage =6;
  useEffect(() => {
       fetchData();        
  }, [reload]);
async function fetchData() {
      try {
        const data = await getClientList();
        setClients(data);
      } catch (error) {
        console.error("Error fetching client list:", error);
      }
    }
  const handledelete = async (idc) => {
    const confirmer = await confirmation();
    if (confirmer) {
      try {
        await deleteClient(idc);
        setReload(idc);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleAddClientClick = () => {
    setIsDialogOpen(true);
  };
  const handleAddprojetClick = () => {
    // getproject();
    createproject();
  };
  const handleupdateClientClick = (client) => {
    setClienttoupdate(client);
    setIsDialogupOpen(true);
  };

  const handleCloseDialogforadd = () => {
    setIsDialogOpen(false);
  };

  const handleCloseDialogforup = () => {
    setIsDialogupOpen(false);
  };

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(clients.length / clientsPerPage);
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
            Liste des clients
          </Typography>
          <Button className="flex items-center gap-3" size="sm" onClick={handleAddClientClick}>
            <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Ajouter Client
          </Button>
          
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                
                {["responsable","raison_sociale", "adresse", "telephone","actions"].map(
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
              {currentClients.map(({ id, raison_sociale, responsable, email, adresse, telephone }) => (
                <tr key={id}>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                        <div className="flex items-center gap-4">
                        <Avatar src="/img/bruce-mars.jpeg"  size="sm" />
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {responsable}
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
                      {raison_sociale}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-semibold"
                    >
                      {adresse}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-semibold"
                    >
                      {telephone}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Button color="red" size="sm" onClick={() => handledelete(id)}>Supprimer </Button>&nbsp;&nbsp;
                    <Button color="green" size="sm" onClick={() => handleupdateClientClick({ id, raison_sociale, responsable, email, adresse, telephone })}>Modifier</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
        <div className="flex items-center justify-between px-6 pb-6">
          <Button
            variant="text"
            onClick={prev}
            disabled={currentPage === 1}
          >
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
        <Dialogupdate open={isDialogupOpen} client={clienttoupdate} setReload={setReload} handleOpen={handleCloseDialogforup} />
      )}
      {isDialogOpen && (
        <DialogWithForm open={isDialogOpen} setReload={setReload} handleOpen={handleCloseDialogforadd}  />
      )}
    </div>
  );
}

export default Clients;
