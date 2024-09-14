import React, { useState, useEffect } from "react";
import { Button, Card, CardHeader, CardBody, Typography ,Avatar} from "@material-tailwind/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { fetchvisite } from "@/services/visite.service"; // Ensure the service is correctly implemented
import Invoice from "./pagefacture";

export function Visite() {
  const [visites, setVisites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetchvisite();
      if (response.data) {
        setVisites(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching visits:", error);
      setLoading(false); // Stop loading even if there's an error
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(visites.length / itemsPerPage);
  const currentVisites = visites.slice(
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
        <CardHeader variant="gradient" className="mb-8 p-6 bg-blue-900 flex justify-between">
          <Typography variant="h6" color="white">
            Tableau des Visites
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["","Médecin", "Patient", "Date", "Actions"].map((el) => (
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
                  <td colSpan="4" className="py-3 px-5 text-center">Chargement...</td>
                </tr>
              ) : (
                currentVisites.map((visite) => (
                  <tr key={visite.id_Visite}>
                    <td className="py-3 px-5 border-b border-blue-gray-50"><Avatar src={"/img/visite.png"}  size="sm" variant="rounded" /></td>
                     
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                        
                      <Typography className="text-xs font-semibold text-blue-gray-500">
                        {visite.medecinName || 'Médecin inconnu'}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography className="text-xs font-semibold text-blue-gray-500">
                        {visite.patientName || 'Patient inconnu'}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography className="text-xs font-semibold text-blue-gray-500">
                        {visite.date ? new Date(visite.date).toLocaleDateString() : 'Date inconnue'}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <PDFDownloadLink
                        document={<Invoice visite={visite} />}
                        fileName={`ordonnance-${visite.id_Visite}.pdf`}
                      >
                        <Button color="blue" size="sm">
                          Télécharger Ordonnance
                        </Button>
                      </PDFDownloadLink>
                    </td>
                  </tr>
                ))
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
    </div>
  );
}

export default Visite;
