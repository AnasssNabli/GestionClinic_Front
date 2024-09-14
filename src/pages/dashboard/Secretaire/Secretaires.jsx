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
import { fetchSecretaires, deleteSecretaire } from "@/services/secretaires.service";
import { fetchMedecins } from '@/services/medecins.services';
import SweetAlert from 'sweetalert2'; 
import AddSecretaire from './AddSecretaire';
import UpdateSecretaire from './UpdateSecretaire'; 

export function Secretaires() {
  const [secretaires, setSecretaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogupOpen, setIsDialogupOpen] = useState(false);
  const [medecins, setMedecins] = useState([]);
  const [secretaireToUpdate, setSecretaireToUpdate] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items per page

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetchSecretaires();
      setSecretaires(response.data);
      const response2 = await fetchMedecins();
      setMedecins(response2.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddSecretaireClick = () => {
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmer = await confirmation();
    if (confirmer) {
      try {
        await deleteSecretaire(id);
        SweetAlert.fire("Bravo", "Secrétaire supprimé avec succès.", "success");
        fetchData();
      } catch (err) {
        SweetAlert.fire("Erreur", "Une erreur s'est produite lors de la suppression du secrétaire.", "error");
      }
    }
  };

  const handleCloseDialogForUpdate = () => {
    setIsDialogupOpen(false);
  };

  // Pagination Logic
  const totalPages = Math.ceil(secretaires.length / itemsPerPage);
  const currentSecretaires = secretaires.slice(
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
            Tableau des Secrétaires
          </Typography>
          <Button className="flex items-center gap-3 ml-auto bg-gray-50 text-blue-900" size="sm" onClick={handleAddSecretaireClick}>
            <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Ajouter une Secrétaire
          </Button>
        </CardHeader>
    
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
        <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Nom", "Email", "Téléphone", , "CIN", "Supérieur", ""].map((el) => (
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
                  <td colSpan="7" className="py-3 px-5 text-center">Chargement...</td>
                </tr>
              ) : (
                secretaires.map((secretaire, key) => {
                  const className = `py-3 px-5 ${
                    key === secretaires.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={secretaire.secretaireID}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar src={"/img/secretaire.png"} alt={secretaire.utilisateur.nom} size="sm" variant="rounded" />
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {secretaire.utilisateur.nom} {secretaire.utilisateur.prenom}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {secretaire.utilisateur.email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-500">
                          {secretaire.utilisateur.email}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-500">
                          {secretaire.utilisateur.telephone}
                        </Typography>
                      </td>
                     
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-500">
                          {secretaire.utilisateur.cin}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-500">
                          {secretaire.superieur?.utilisateur?.nom} {secretaire.superieur?.utilisateur?.prenom}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Button
                          onClick={() => {
                            setSecretaireToUpdate(secretaire);
                            setIsDialogupOpen(true);
                          }}
                          color="blue"
                          size="sm"
                          className="mr-2"
                        >
                          Modifier
                        </Button>
                        <Button
                          onClick={() => handleDelete(secretaire.secretaireID)}
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
              <ArrowLeftIcon className="h-5 w-5" /> Previous
            </Button>
            <Typography variant="small" className="text-blue-gray-600">
              Page {currentPage} sur {totalPages}
            </Typography>
            <Button
              variant="text"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next <ArrowRightIcon className="h-5 w-5" />
            </Button>
          </div>
        </CardBody>
      </Card>

      <AddSecretaire
        open={isDialogOpen}
        handleOpen={() => setIsDialogOpen(false)}
        setReload={fetchData}
        medecins={medecins}
      />

      {isDialogupOpen && (
        <UpdateSecretaire
          open={isDialogupOpen}
          handleOpen={handleCloseDialogForUpdate}
          secretaire={secretaireToUpdate}
          setReload={fetchData}
          medecins={medecins}
        />
      )}
    </div>
  );
}

export default Secretaires;
