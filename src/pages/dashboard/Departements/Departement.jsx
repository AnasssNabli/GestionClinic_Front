import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Button
} from "@material-tailwind/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { confirmation } from "@/widgets/alert_confirmation";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { fetchDepartements, deleteDepartement } from '@/services/departement.service';
import AddDepartement from "./AddDepartement"; 
import SweetAlert from 'sweetalert2'; 
import { UpdateDepartement } from './UpdateDepartement';

export function Departement() {
  const [departements, setDepartements] = useState([]);
  const [DepartementtoUpdate, setDepartementtoUpdate] = useState();
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [IsDialogupOpen, setIsDialogupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Nombre d'items par page

  useEffect(() => {
    fetchData();
  }, [reload]);

  const fetchData = async () => {
    try {
      const response = await fetchDepartements();
      setDepartements(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCloseDialogforup = () => {
    setIsDialogupOpen(false);
  };

  const handleupdateDepClick = (departement) => {
    setDepartementtoUpdate(departement);
    setIsDialogupOpen(true);
  };

  const handleAddDepartementClick = () => {
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmer = await confirmation();
    if (confirmer) {
      try {
        await deleteDepartement(id);
        SweetAlert.fire("Bravo", "Département supprimé avec succès.", "success");
        fetchData(); 
      } catch (err) {
        SweetAlert.fire("Erreur", "Une erreur s'est produite lors de la suppression du département.", "error");
      }
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(departements.length / itemsPerPage);
  const currentDepartements = departements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" className="mb-8 p-6 flex justify-between items-center bg-blue-900">
          <Typography variant="h6" color="white">
            Tableau des Départements
          </Typography>
          <Button className="flex items-center gap-3 ml-auto bg-gray-50 text-blue-900" size="sm" onClick={handleAddDepartementClick}>
            <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Ajouter un Département
          </Button>
        </CardHeader>
    
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["", "Nom", "Description", ""].map((el) => (
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
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="py-3 px-5 text-center">Chargement...</td>
                </tr>
              ) : (
                currentDepartements.map(({ id_dep, nom, description }, key) => {
                  const className = `py-1 px-3 ${
                    key === departements.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={id_dep}>
                       <td className={className}><Avatar src={"/img/dep.png"} size="lg" variant="rounded" /></td>
                      
                      <td className={className}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {nom}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {description}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Button
                          onClick={() => handleupdateDepClick({ id_dep, nom, description })}
                          color="blue"
                          size="sm"
                          className="mr-2"
                        >
                          Modifier
                        </Button>
                        <Button
                          onClick={() => handleDelete(id_dep)}
                          color="red"
                          size="sm"
                        >
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="text"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <ArrowLeftIcon className="h-5 w-5" /> Précédent
            </Button>
            <Typography variant="small" className="text-blue-gray-600">
              Page {currentPage} sur {totalPages}
            </Typography>
            <Button
              variant="text"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Suivant <ArrowRightIcon className="h-5 w-5" />
            </Button>
          </div>
        </CardBody>
      </Card>

      <AddDepartement
        open={isDialogOpen}
        handleOpen={() => setIsDialogOpen(false)}
        setReload={fetchData} 
      />
      {IsDialogupOpen && (
        <UpdateDepartement 
          open={IsDialogupOpen} 
          departement={DepartementtoUpdate} 
          setReload={setReload} 
          handleOpen={handleCloseDialogforup} 
        />
      )}
    </div>
  );
}

export default Departement;
