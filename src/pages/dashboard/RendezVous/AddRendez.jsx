import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  IconButton,
  Select,
  Option,
  Textarea
} from "@material-tailwind/react";
import { confirmation } from "@/widgets/alert_confirmation";
import SweetAlert from 'sweetalert2'; 
import { getDisponibilite } from "@/services/disponibilite.service";
import { createRendezVous } from "@/services/rendezvous.service";

export default function AddRendez(props) {
  const { open, handleOpen, setReload, medecins } = props;

  const [formData, setFormData] = useState({
    Id_Medecin: "",
    Date: "",
    Heure: "",
    Raison: "",
    Statut: "Planifie"
  });

  const [errors, setErrors] = useState({});
  const [disponibilites, setDisponibilites] = useState([]);
  const [isHeureDisabled, setHeureDisabled] = useState(true);

  // Reset form data when the dialog is closed
  useEffect(() => {
    if (!open) {
      setFormData({
        Id_Medecin: "",
        Date: "",
        Heure: "",
        Raison: "",
        Statut: "Planifie"
      });
      setErrors({});
      setDisponibilites([]);
      setHeureDisabled(true);
    }
  }, [open]);

  const getDayOfWeek = (dateString) => {
    const [year, month, day] = dateString.split('-'); 
    const date = new Date(year, month - 1, day);
    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return daysOfWeek[date.getDay()];
  };

  useEffect(() => {
    if (formData.Id_Medecin && formData.Date) {
      fetchDisponibilite();
    } else {
      setDisponibilites([]);
      setHeureDisabled(true);
      setFormData(prev => ({ ...prev, Heure: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.Id_Medecin, formData.Date]);

  const fetchDisponibilite = async () => {
    const selectedDate = formData.Date;
    const day = getDayOfWeek(selectedDate);
    const id_medecin = formData.Id_Medecin;
  
    try {
      const response = await getDisponibilite(day, formData.Date, id_medecin);
      setDisponibilites(response);
      setHeureDisabled(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des disponibilités", error);
      setDisponibilites([]);
      setHeureDisabled(true);
      setFormData(prev => ({ ...prev, Heure: "" }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.Id_Medecin) {
      newErrors.Id_Medecin = "Le médecin est requis";
      isValid = false;
    }
    if (!formData.Date) {
      newErrors.Date = "La date de rendez-vous est requise";
      isValid = false;
    }
    if (!formData.Heure) {
      newErrors.Heure = "L'heure de rendez-vous est requise";
      isValid = false;
    }
    if (!formData.Raison) {
      newErrors.Raison = "La raison est requise";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const confirmer = await confirmation();
      if (confirmer) {
        try {
           await createRendezVous(formData);
          
          setReload(formData);
          handleOpen();  // Close the dialog
          SweetAlert.fire("Bravo", "Rendez-vous ajouté avec succès.", "success");
        } catch (error) {
          SweetAlert.fire("Erreur", "Une erreur s'est produite lors de l'ajout du rendez-vous.", "error");
        }
      } else {
        handleOpen(); // Close the dialog on cancellation
      }
    }
  };

  const handleChange = (e, name) => {
    const { value } = e.target; 
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ""
    }));
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, Heure: value });
  };
  
  const handleSelectChangee = (value) => {
    setFormData({ ...formData, Id_Medecin: value });
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full max-w-[60rem] p-6">
        <div className="flex justify-end pe-2 pt-2">
          <IconButton
            size="sm"
            variant="text"
            onClick={handleOpen}
            className="bg-dark"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <CardBody className="flex flex-col gap-4 overflow-y-auto max-h-[50vh] pe-2">
          <Typography
            variant="h5"
            color="blue-gray"
            className="mt-1 text-center"
          >
            Ajouter un rendez-vous
          </Typography>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Médecin
                </Typography>
                <Select
                  label="Médecin"
                  onChange={(e) => handleSelectChangee(e)}
                  name="Id_Medecin"
                  error={!!errors.Id_Medecin}
                >
                  {medecins.map((medecin, key) => (
                    <Option key={key} value={medecin.id_medecin.toString()}>
                      {medecin.utilisateur.nom} {medecin.utilisateur.prenom}
                    </Option>
                  ))}
                </Select>
                {errors.Id_Medecin && (
                  <Typography color="red" className="mt-1">
                    {errors.Id_Medecin}
                  </Typography>
                )}
              </div>

              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Date de Rendez-vous
                </Typography>
                <Input
                  type="date"
                  label="Date de Rendez-vous"
                  value={formData.Date}
                  onChange={(e) => handleChange(e, "Date")}
                  error={!!errors.Date}
                />
                {errors.Date && (
                  <Typography color="red" className="mt-1">
                    {errors.Date}
                  </Typography>
                )}
              </div>
            </div>

            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Raison
              </Typography>
              <Textarea
                label="Raison"
                value={formData.Raison}
                onChange={(e) => handleChange(e, "Raison")}
                error={!!errors.Raison}
              />
              {errors.Raison && (
                <Typography color="red" className="mt-1">
                  {errors.Raison}
                </Typography>
              )}
            </div>

            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Heure de Rendez-vous
              </Typography>
              <div className="relative h-15 w-full">
                <select
                  label="Heure de Rendez-vous"
                  className="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-gray-900 disabled:border-0 disabled:bg-blue-gray-50"
                  onChange={(e) => handleSelectChange(e.target.value)}
                  name="Heure"
                  disabled={isHeureDisabled}
                  error={!!errors.Heure}
                >
                  <option value="">Sélectionnez une heure</option>
                  {disponibilites.length > 0 ? (
                    disponibilites.map((dispo) => {
                      const heureDebut = dispo.heureDebut;
                      const heureFin = dispo.heureFin;

                      // Convert heureDebut and heureFin to numbers for hours
                      let startHour = parseInt(heureDebut.split(':')[0], 10);
                      let endHour = parseInt(heureFin.split(':')[0], 10);

                      // Create options for each hour between heureDebut and heureFin
                      const options = [];
                      for (let hour = startHour; hour < endHour; hour++) {
                        const startTime = `${hour < 10 ? '0' : ''}${hour}:00`;
                        const endTime = `${(hour + 1) < 10 ? '0' : ''}${hour + 1}:00`;

                        options.push(
                          <option key={startTime} value={startTime}>
                            {`${startTime} - ${endTime}`}
                          </option>
                        );
                      }

                      return options;
                    })
                  ) : (
                    <option disabled>Aucune disponibilité</option>
                  )}
                </select>
              </div>
              {errors.Heure && (
                <Typography color="red" className="mt-1">
                  {errors.Heure}
                </Typography>
              )}
            </div>

          </div>
        </CardBody>
        <CardFooter className="pt-0 flex justify-between">
        <Button fullWidth variant="gradient" onClick={props.handleOpen}>
            Annuler
          </Button>
          <div className="w-4"></div>
          <Button fullWidth variant="gradient" color="blue" onClick={handleSubmit}>
            Ajouter
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
}
