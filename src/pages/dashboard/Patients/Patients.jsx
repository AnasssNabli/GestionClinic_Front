import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Button
} from "@material-tailwind/react";
import { UpdatePatient } from './UpdatePatient';
import { fetchPatients, deletePatient } from "@/services/patients.service";
import { confirmation } from "@/widgets/alert_confirmation";
import Swal from 'sweetalert2'; // Ensure correct import

export function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogupOpen, setIsDialogupOpen] = useState(false);
  const [patientToUpdate, setPatientToUpdate] = useState(null); 

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
      setLoading(false); // Ensure loading state is cleared on error
    }
  };

  const handleAddPatientClick = () => {
    setIsDialogOpen(true);
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
                patients.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-3 px-5 text-center">Aucun patient trouvé</td>
                  </tr>
                ) : (
                  patients.map((patient) => {
                    const className = `py-3 px-5 ${
                      patient === patients[patients.length - 1]
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={patient.id_patient}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Avatar src={"/img/patient.png"} alt={patient.utilisateur?.nom || "Patient"} size="sm" variant="rounded" />
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
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
