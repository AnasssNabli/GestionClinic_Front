import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip
} from "@material-tailwind/react";
import {
  createproject,
  getprojectf,
  deleteProject,
  filtreranne,
  filtrerstatus,
  filtrermanager,
  getrole
} from "@/services/projetservices";
import { getClientList } from "@/services/clientservices";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Invoice } from './pagefacture';
import { createfacture, getfactures ,recouvrer} from "@/services/factureservice";

export function Facture() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogupOpen, setIsDialogupOpen] = useState(false);
  const [projets, setProjets] = useState([]);
  const [managers, setManagers] = useState([]);
  const [years, setYears] = useState([]);
  const [projettoupdate, setProjettoupdate] = useState();
  const [clientNames, setClientNames] = useState({});
  const [clientfacture, setClientfacture] = useState({});
  const [factures, setFactures] = useState({});
  const [reload, setReload] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [role, setRole] = useState(1);
  const [clients, setClients] = useState([]);
  const projetsPerPage = 6;

  useEffect(() => {
    fetchData();
  }, [reload]);

  async function fetchData() {
    try {
      const dataf = await getfactures();
      const data = await getprojectf();
      const cldata = await getClientList();
      const idrole = await getrole();

      setRole(idrole);
      setClients(cldata);
      setProjets(data.projects);
      setManagers(data.Bu_managers);
      setYears(data.years);

      const clientNamesData = {};
      const clientf = {};
      for (const project of data.projects) {
        const client = cldata.find((client) => client.id === project.id_client);
        if (client) {
          clientNamesData[project.id_client] = client.raison_sociale;
          clientf[project.id_client] = client;
        }
      }
      setClientfacture(clientf);
      setClientNames(clientNamesData);

      const facturess = {};
      for (const project of data.projects) {
        const facture = dataf.find((f) => f.id_projet === project.id_projet);
        if (facture) {
          facturess[project.id_projet] = facture;
        }
      }
      setFactures(facturess);
    } catch (error) {
      console.error("Error fetching projects list:", error);
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      setReload(!reload);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddProjectClick = () => {
    setIsDialogOpen(true);
  };

  const handleUpdateProjectClick = (project) => {
    setProjettoupdate(project);
    setIsDialogupOpen(true);
  };

  const handleCloseDialogForAdd = () => {
    setIsDialogOpen(false);
  };

  const handleCloseDialogForUpdate = () => {
    setIsDialogupOpen(false);
  };

  const handleFilterYears = async (y) => {
    const year = { filteryear: y };
    const data = await filtreranne(year);
    setProjets(data.projects);
  };

  const handleFilterManagers = async (m) => {
    const manager = { filterbu: m };
    const data = await filtrermanager(manager);
    setProjets(data.projects);
  };

  const handleFilterStatus = async (st) => {
    const status = { filterstatus: st };
    const data = await filtrerstatus(status);
    setProjets(data.projects);
  };
  
  const handlerecouvrement = async (idp) => {
    const change = await recouvrer(idp);
    setReload(change);
  };

  const indexOfLastProject = currentPage * projetsPerPage;
  const indexOfFirstProject = indexOfLastProject - projetsPerPage;
  const currentProjets = projets.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projets.length / projetsPerPage);

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
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader
          variant="gradient"
          color="gray"
          className="p-6 flex items-center justify-between"
        >
          <Typography variant="h6" color="white">
            Liste des projets facturé
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-6 pb-6">
          {projets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Typography variant="h6" color="blue-gray">
                Aucun projet disponible pour le moment
              </Typography>
            </div>
          ) : (
            <>
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["Designation", "Client", "Facturation", "Recouvrement", "Actions"].map(
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
                  {currentProjets.map(({ id_projet, designiation, id_client, facturation, recouvrement, mode_facturation }) => (
                    <tr key={id_projet}>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {designiation}
                        </Typography>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {clientNames[id_client]}
                        </Typography>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Chip
                          variant="gradient"
                          color={facturation ? "cyan" : "red"}
                          value={facturation ? "Facturé" : "Non Facturé"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Chip
                          variant="gradient"
                          color={recouvrement ? "cyan" : "red"}
                          value={recouvrement ? "Recouvré" : "Non Recouvré"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <PDFDownloadLink 
                          document={
                            <Invoice 
                              client={clientfacture[id_client]} 
                              facture={factures[id_projet]} 
                              projet={{ id_projet, designiation, mode_facturation }} 
                            />
                          } 
                          fileName={`facture_${id_projet}.pdf`}
                        >
                          {({ loading }) => 
                            loading ? 'Loading document...' : (
                              <Button color="blue" size="sm" >Download Facture</Button>
                            )
                          }
                        </PDFDownloadLink>&nbsp;&nbsp;
                        {role === 3 ? "" :
                        <Button color="green" size="sm" onClick={() => handlerecouvrement(id_projet)}>Recouvrer</Button>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
