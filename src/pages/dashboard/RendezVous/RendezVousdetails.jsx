import React, { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  IconButton,
  Textarea,
} from "@material-tailwind/react";
import SweetAlert from 'sweetalert2';
import { createvisite } from "@/services/visite.service";
import { updateRendezVousStatut } from "@/services/rendezvous.service";
function RendezVousDetails({ appointment, handleClose, setReload }) {
  const [formData, setFormData] = useState({
    montant: "",
    notes: "",
    medicaments: [],
  });
  const [showMedicaments, setShowMedicaments] = useState(false);
  const [medicamentsList, setMedicamentsList] = useState([]);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.montant) {
      newErrors.montant = "Le montant est requis";
      isValid = false;
    }
    if (!formData.notes) {
      newErrors.notes = "Les notes sont requises";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const visiteData = {
          Id_Medecin: appointment.id_Medecin,
          Id_patient: appointment.id_patient,
          Montant: formData.montant,
          Notes: formData.notes,
          Date: appointment.date,
          Medicaments: medicamentsList,
        };

        await createvisite(visiteData);
        const statut = "Terminé";
        await updateRendezVousStatut(appointment.id_RendezVous, statut);
        SweetAlert.fire("Succès", "Visite créée avec succès.", "success");
        setReload(true); // Trigger reload in parent component
        handleClose(); // Close the dialog
      } catch (error) {
        SweetAlert.fire("Erreur", "Une erreur s'est produite lors de la création de la visite.", "error");
      }
    }
  };

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" });
  };

  const addMedicament = () => {
    setShowMedicaments(true);
    setMedicamentsList([...medicamentsList, { Nom: "", Instructions: "" }]);
  };

  const handleMedicamentChange = (index, field, value) => {
    const newMedicaments = [...medicamentsList];
    newMedicaments[index][field] = value;
    setMedicamentsList(newMedicaments);
  };

  return (
    <Dialog open={!!appointment} handler={handleClose} className="bg-transparent shadow-none">
      <Card className="mx-auto w-full max-w-[40rem] p-6">
        <div className="flex justify-between items-center border-b border-blue-900 pb-2 mb-4">
          <Typography variant="h4" className="text-blue-900">
            Détails du Rendez-vous
          </Typography>
          <Button
            variant="filled"
            onClick={addMedicament}
            className="bg-blue-900 text-white"
          >
            Ajouter Médicament
          </Button>
          <IconButton size="sm" variant="text" onClick={handleClose} className="bg-dark">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </IconButton>
        </div>
        <CardBody className="flex flex-col gap-2 overflow-y-auto max-h-[70vh]">
          <div className="my-2">
            <Typography variant="small" color="blue-gray" className="mb-1 font-medium">
              Montant
            </Typography>
            <Input
              name="montant"
              label="Montant"
              size="lg"
              type="number"
              value={formData.montant}
              onChange={(e) => handleChange(e, "montant")}
              error={!!errors.montant}
            />
            {errors.montant && (
              <Typography color="red" className="mt-1">
                {errors.montant}
              </Typography>
            )}
          </div>

          <div className="my-2">
            <Typography variant="small" color="blue-gray" className="mb-1 font-medium">
              Notes
            </Typography>
            <Textarea
              label="Notes"
              value={formData.notes}
              onChange={(e) => handleChange(e, "notes")}
              error={!!errors.notes}
            />
            {errors.notes && (
              <Typography color="red" className="mt-1">
                {errors.notes}
              </Typography>
            )}
          </div>

          {showMedicaments && medicamentsList.map((medicament, index) => (
            <div key={index} className="flex gap-4 my-2">
              <div className="flex-1">
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium">
                  Nom
                </Typography>
                <Input
                  type="text"
                  label="Nom"
                  size="lg"
                  value={medicament.Nom}
                  onChange={(e) => handleMedicamentChange(index, "Nom", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium">
                  Instructions
                </Typography>
                <Input
                  type="text"
                  label="Instructions"
                  size="lg"
                  value={medicament.Instructions}
                  onChange={(e) => handleMedicamentChange(index, "Instructions", e.target.value)}
                />
              </div>
            </div>
          ))}
        </CardBody>

        <CardFooter className="pt-0 flex justify-between">
          <Button fullWidth className="bg-blue-900" onClick={handleClose}>
            Annuler
          </Button>
          <div className="w-4"></div>
          <Button fullWidth className="bg-blue-900" onClick={handleSubmit}>
            Enregistrer
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
}

export default RendezVousDetails;
