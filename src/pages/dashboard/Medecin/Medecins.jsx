import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Button
} from "@material-tailwind/react";
import { confirmation } from "@/widgets/alert_confirmation";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import axios from 'axios';
import { fetchMedecins, deleteMedecin } from "@/services/medecins.services";
import AddMedecin from "./AddMedecin"; 
import SweetAlert from 'sweetalert2'; 

export function Medecins() {
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
 
  const fetchData = async () => {
    try {
      const response = await fetchMedecins();
      setMedecins(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddMedecinClick = () => {
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmer = await confirmation();
    if (confirmer) {
      try {
        await deleteMedecin(id);
        SweetAlert.fire("Bravo", "Médecin supprimé avec succès.", "success");
        fetchData(); // Recharger les données après la suppression
      } catch (err) {
        SweetAlert.fire("Erreur", "Une erreur s'est produite lors de la suppression du médecin.", "error");
      }
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
      <CardHeader variant="gradient"  className="mb-8 p-6 flex justify-between items-center bg-blue-900">
      <Typography variant="h6" color="white">
        Tableau des Médecins
      </Typography>
      <Button className="flex items-center gap-3 ml-auto bg-gray-50 text-blue-900" size="sm" onClick={handleAddMedecinClick}>
        <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Ajouter un Médecin
      </Button>
    </CardHeader>
    
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Nom", "Spécialisation", "Date de naissance" , "CIN" , "Téléphone", ""].map((el) => (
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
                  <td colSpan="6" className="py-3 px-5 text-center">Chargement...</td>
                </tr>
              ) : (
                medecins.map(({ id_medecin, utilisateur, specialisation }, key) => {
                  const className = `py-3 px-5 ${
                    key === medecins.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={id_medecin}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar src={"/img/doctor.png"} alt={utilisateur.nom} size="sm" variant="rounded" />
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {utilisateur.nom} {utilisateur.prenom}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {utilisateur.email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {specialisation}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {utilisateur.dateNaissance}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {utilisateur.cin}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {utilisateur.telephone}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Button
                          onClick={() => handleDelete(id_medecin)}
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
        </CardBody>
      </Card>
      {}
      <AddMedecin
        open={isDialogOpen}
        handleOpen={() => setIsDialogOpen(false)}
        setReload={fetchData} 
      />
    </div>
  );
}

export default Medecins;
