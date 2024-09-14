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
import { UpdatePatient } from './UpdatePatient';
import { fetchPatients, deletePatient } from "@/services/patients.service";
import { confirmation } from "@/widgets/alert_confirmation";
import Swal from 'sweetalert2'; 

export function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogupOpen, setIsDialogupOpen] = useState(false);
  const [patientToUpdate, setPatientToUpdate] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetchPatients();
      setPatients(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmer = await confirmation(); 
    if (confirmer) {
      try {
        await deletePatient(id); 
        Swal.fire("Bravo", "Patient supprimé avec succès.", "success"); 
        fetchData(); 
      } catch (err) {
        Swal.fire("Erreur", "Une erreur s'est produite lors de la suppression du patient.", "error"); 
      }
    }
  };

  const handleCloseDialogForUpdate = () => {
    setIsDialogupOpen(false);
  };

  // Pagination logic
  const totalPages = Math.ceil(patients.length / itemsPerPage);
  const currentPatients = patients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
            Tableau des Patients
          </Typography>
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Nom", "Email", "Téléphone", "CIN", "Adresse", ""].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
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
                currentPatients.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-3 px-5 text-center">Aucun patient trouvé</td>
                  </tr>
                ) : (
                  currentPatients.map((patient, key) => {
                    const className = `py-3 px-5 ${key === currentPatients.length - 1 ? "" : "border-b border-blue-gray-50"}`;

                    return (
                      <tr key={patient.id_patient}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Avatar src={"/img/patient.png"} alt={patient.utilisateur?.nom || "Patient"} size="sm" variant="rounded" />
                            <div>
                              <Typography variant="small" color="blue-gray" className="font-semibold">
                                {patient.utilisateur?.nom} {patient.utilisateur?.prenom}
                              </Typography>
                              <Typography className="text-xs font-normal text-blue-gray-500">
                                {patient.utilisateur?.email}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-500">
                            {patient.utilisateur?.email}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-500">
                            {patient.utilisateur?.telephone}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-500">
                            {patient.utilisateur?.cin}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-500">
                            {patient.adresse}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Button
                            onClick={() => {
                              setPatientToUpdate(patient);
                              setIsDialogupOpen(true);
                            }}
                            color="blue"
                            size="sm"
                            className="mr-2"
                          >
                            Modifier
                          </Button>
                          <Button
                            onClick={() => handleDelete(patient.id_patient)}
                            color="red"
                            size="sm"
                          >
                            Supprimer
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

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

      {isDialogupOpen && (
        <UpdatePatient
          open={isDialogupOpen}
          handleOpen={handleCloseDialogForUpdate}
          patient={patientToUpdate}
          setReload={fetchData}
        />
      )}
    </div>
  );
}

export default Patients;
