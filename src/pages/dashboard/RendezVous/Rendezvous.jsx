import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardHeader,
  Avatar,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { fetchRendezVous, updateRendezVousStatut } from "@/services/rendezvous.service";
import { confirmation } from "@/widgets/alert_confirmation";
import { fetchMedecins } from '@/services/medecins.services';
import AddRendez from "./AddRendez";

export function Rendezvous() {
  const [rendezVous, setRendezVous] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for handling the dialog
  const rendezVousPerPage = 6;
  const [medecins, setMedecins] = useState([]);
  const mockResponse = [{ id_medecin: 7, heuredebut: 8.00, heurefin: 11.00 },{ id_medecin: 8, heuredebut: 12.00, heurefin: 18.00 }];
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetchRendezVous();
      console.log("Fetched rendezVous data:", response);
      
      if (Array.isArray(response.data)) {
        setRendezVous(response.data);
      } else {
        console.error("Expected an array but got:", response.data);
        setRendezVous([]);
      }
      const response2 = await fetchMedecins();
      setMedecins(response2.data);
    } catch (error) {
      console.error("Error fetching rendez-vous list:", error);
    }
  }

  const handleAnnuler = async (id) => {
    const confirmer = await confirmation();
    if (confirmer) {
      try {
        const statut = "Annulé";
        await updateRendezVousStatut(id, statut);
        fetchData();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const indexOfLastRendezVous = currentPage * rendezVousPerPage;
  const indexOfFirstRendezVous = indexOfLastRendezVous - rendezVousPerPage;
  const currentRendezVous = rendezVous.slice(indexOfFirstRendezVous, indexOfLastRendezVous);

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

  const totalPages = Math.ceil(rendezVous.length / rendezVousPerPage);

  const handleAddRendezVousClick = () => {
    setIsDialogOpen(true);
  };
  const handleSelectChange = (value) => {
    setFormData({ ...formData, Superieurid_medecin: value });
 };
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" className="mb-8 p-6 flex justify-between items-center bg-blue-900">
          <Typography variant="h6" color="white">
            Liste des Rendez-vous
          </Typography>
          <Button className="flex items-center gap-3 ml-auto bg-gray-50 text-blue-900" size="sm" onClick={handleAddRendezVousClick}>
            Ajouter un Rendez-vous
          </Button>
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Médecin", "Date", "Heure", "Statut", "Actions"].map((el) => (
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
              {currentRendezVous.map(({ id_RendezVous, medecinName, date, heure, statut }) => (
                <tr key={id_RendezVous}>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <div className="flex items-center gap-4">
                      <Avatar src={"/img/rendez.png"} alt={medecinName} size="sm" variant="rounded" />
                      <div>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {medecinName}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" className="text-xs font-semibold text-blue-gray-500">
                      {date}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" className="text-xs font-semibold text-blue-gray-500">
                      {heure}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" className="text-xs font-semibold text-blue-gray-500">
                      {statut}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Button color="red" size="sm" onClick={() => handleAnnuler(id_RendezVous)}>
                      Annuler
                    </Button>
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

      <AddRendez
        open={isDialogOpen}
        handleOpen={() => setIsDialogOpen(false)}
        setReload={fetchData}
        medecins={medecins}
        mockResponse ={mockResponse}
      />
    </div>
  );
}

export default Rendezvous;
