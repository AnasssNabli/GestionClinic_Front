import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Typography,
  Progress,
  Select,
  Option
} from "@material-tailwind/react";
import { Addform } from "./addprojet";
import { Updateprojet } from "./updateprojet";
import { createproject, getproject, deleteProject, filtreranne, filtrerstatus, filtrermanager, getrole } from "@/services/projetservices";
import { getClientList } from "@/services/clientservices";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { confirmation } from "@/widgets/alert_confirmation";
export function Projets() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogupOpen, setIsDialogupOpen] = useState(false);
  const [projets, setProjets] = useState([]);
  const [managers, setManagers] = useState([]);
  const [years, setYears] = useState([]);
  const [projettoupdate, setProjettoupdate] = useState();
  const [clientNames, setClientNames] = useState({});
  const [reload, setReload] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [role, setRole] = useState(1);
  const [clients, setClients] = useState([]);
  const projetsPerPage = 6;
  const initialized = useRef(false);

  useEffect(() => {
      fetchData();
  }, [reload]);

  async function fetchData() {
    try {
      const data = await getproject();
      const cldata = await getClientList();
      const idrole = await getrole();
      idrole === 1 ? setRole(1) : idrole === 2 ? setRole(2) : setRole(3);

      setClients(cldata);
      setProjets(data.projects);
      console.log(projets);
      setManagers(data.Bu_managers);
      setYears(data.years);
      const clientNamesData = {};
      for (const project of data.projects) {
        const client = cldata.find((client) => client.id === project.id_client);
        if (client) {
          clientNamesData[project.id_client] = client.raison_sociale;
        }
      }
      setClientNames(clientNamesData);
    } catch (error) {
      console.error("Error fetching projets list:", error);
    }
  }

  const handledelete = async (id) => {
    let confirmer = await confirmation();
            if (confirmer) {
              try {
                await deleteProject(id);
                setReload(id);
              } catch (error) {
                console.log(error);
              }
            } else {

            }
    
  };

  const handleAddProjectClick = () => {
    setIsDialogOpen(true);
  };

  const handleupdateProjectClick = (project) => {
    setProjettoupdate(project);
    setIsDialogupOpen(true);
  };

  const handleCloseDialogforadd = () => {
    setIsDialogOpen(false);
  };

  const handleCloseDialogforup = () => {
    setIsDialogupOpen(false);
  };

  const handlefilteryears = async (y) => {
    const year = { filteryear: y };
    const data = await filtreranne(year);
    setProjets(data.projects);
  };

  const handlefiltermanagers = async (m) => {
    const manager = { filterbu: m };
    const data = await filtrermanager(manager);
    setProjets(data.projects);
  };

  const handlefilterstatut = async (st) => {
    const statut = { filterstatut: st };
    const data = await filtrerstatus(statut);
    setProjets(data.projects);
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
            Liste des projets
          </Typography>
          {role === 3 ? "" :
          <Button className="flex items-center gap-3" size="sm" onClick={handleAddProjectClick}>
            <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Ajouter Projet
          </Button>
          }
        </CardHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="flex space-x-4">
            <Select
              label="filtrer avec l'annee"
              onChange={handlefilteryears}
              name="id_client"
            >
              {years.map((year) => (
                <Option key={year.toString()} value={year.toString()}>
                  {year}
                </Option>
              ))}
            </Select>
            <Select
              label="filtrer avec les managers"
              onChange={handlefiltermanagers}
              name="id_client"
            >
              {managers.map((bu) => (
                <Option key={bu.id.toString()} value={bu.id.toString()}>
                  {bu.username}
                </Option>
              ))}
            </Select>
            <Select
              label="filtrer avec le statut"
              onChange={handlefilterstatut}
              name="id_client"
            >
              <Option value="0">En cours</Option>
              <Option value="1">Termine</Option>
            </Select>
          </div>
        </div>
        <CardBody className="overflow-x-scroll px-6 pt-0 pb-6">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Designation", "Client","Montant total", "Taux de Realisation", "Statut",role ===3?"":"Actions"].map(
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
              {currentProjets.map(({ id_projet, designiation, id_type, id_client, mode_facturation, tarif, nbrJh, montant_ht, Duree, description, new_taux_realisation, statut }) => (
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
                        <Typography
                          variant="small"
                          className="text-xs font-medium text-blue-gray-600"
                        >
                          ${montant_ht}
                        </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <div className="w-10/12">
                      <Typography
                        variant="small"
                        className="mb-1 block text-xs font-medium text-blue-gray-600"
                      >
                        {new_taux_realisation}%
                      </Typography>
                      <Progress
                        value={new_taux_realisation}
                        variant="gradient"
                        color={new_taux_realisation === 100 ? "green" :new_taux_realisation <= 25? "red":new_taux_realisation <=50?"amber":new_taux_realisation <=75?"indigo":"teal"}
                        size="md"
                      />
                    </div>
                     
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-semibold"
                    >
                      {statut ? "Termine" : "En cours"}
                    </Typography>
                  </td>
                  {role === 3 ? "" :
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Button color="red" size="sm" onClick={() => handledelete(id_projet)}>Supprimer</Button>&nbsp;&nbsp;
                      <Button color="green" size="sm" onClick={() => handleupdateProjectClick({ id_projet, designiation, id_type, id_client, mode_facturation, tarif, nbrJh, montant_ht, Duree, description })}>Modifier</Button>
                    </td>
                  }
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
        <Updateprojet clients={clients} open={isDialogupOpen} project={projettoupdate} setReload={setReload} handleOpen={handleCloseDialogforup} />
      )}
      {isDialogOpen && (
        <Addform open={isDialogOpen} setReload={setReload} handleOpen={handleCloseDialogforadd} />
      )}
    </div>
  );
}
export default Projets;
