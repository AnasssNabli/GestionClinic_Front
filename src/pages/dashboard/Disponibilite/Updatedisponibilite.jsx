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
} from "@material-tailwind/react";
import { confirmation } from "@/widgets/alert_confirmation";
import { updateDisponibilite } from "@/services/disponibilite.service";

export function Updatedisponibilite(props) {
  const [timeRanges, setTimeRanges] = useState([
    { heureDebut: "", heureFin: "" },
  ]);

  const [errors, setErrors] = useState([]);

  const validateForm = () => {
    const newErrors = [];
    let isValid = true;

    timeRanges.forEach((range, index) => {
      const rangeErrors = {};
      if (!range.heureDebut) {
        rangeErrors.heureDebut = "Heure de début est requise";
        isValid = false;
      }
      if (!range.heureFin) {
        rangeErrors.heureFin = "Heure de fin est requise";
        isValid = false;
      }
      newErrors[index] = rangeErrors;
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      let confirmer = await confirmation();
      if (confirmer) {
        try {
          const disponibilites = timeRanges.map((range) => ({
            jourDeLaSemaine: props.day,
            heureDebut: range.heureDebut,
            heureFin: range.heureFin,
          }));
          await updateDisponibilite(disponibilites,props.day);
          props.setReload();
          props.handleOpen();
          console.log("Disponibilité ajoutée avec succès !");
        } catch (error) {
          console.error(
            "Erreur lors de l'ajout de la disponibilité :",
            error
          );
        }
      } else {
        props.handleOpen();
      }
    }
  };

  const handleChange = (e, index, field) => {
    const { value } = e.target;
    const newTimeRanges = [...timeRanges];
    newTimeRanges[index][field] = value;
    setTimeRanges(newTimeRanges);
    const newErrors = [...errors];
    newErrors[index][field] = "";
    setErrors(newErrors);
  };

  const addTimeRange = () => {
    setTimeRanges([...timeRanges, { heureDebut: "", heureFin: "" }]);
    setErrors([...errors, {}]);
  };

  return (
    <Dialog
      open={props.open}
      handler={props.handleClose}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full max-w-[60rem] p-6">
        <div className="flex justify-end pe-2 pt-2">
          <IconButton
            size="sm"
            variant="text"
            onClick={props.handleClose}
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
        <CardBody className="flex flex-col gap-3 overflow-y-auto max-h-[70vh]">
          <div className="flex items-center justify-center">
            <div className="ml-12">
                <Typography
                        variant="h4"
                        className="text-center text-blue-900"
                        >
                        Ajouter une disponibilité
                        </Typography>
                        <Typography
                        className="mb-3 font-normal text-center"
                        variant="paragraph"
                        color="gray"
                    >
                        Entrer les détails de la disponibilité
                    </Typography>
            </div>
            
          <div className="ml-12">
          <Button
            variant="text"
            onClick={addTimeRange}
            className="ml-10 p-2 border border-blue-900 text-blue-900"
            >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
                />
            </svg>
            </Button>

          </div>
          </div>
          
          {timeRanges.map((range, index) => (
            <div key={index} className="my-2">
              <div className="mb-3">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Heure de début
                </Typography>
                <Input
                  type="number"
                  name={`heureDebut-${index}`}
                  label="Heure de début"
                  size="lg"
                  value={range.heureDebut}
                  onChange={(e) => handleChange(e, index, "heureDebut")}
                  error={!!errors[index]?.heureDebut}
                />
                {errors[index]?.heureDebut && (
                  <Typography color="red" className="mt-1">
                    {errors[index].heureDebut}
                  </Typography>
                )}
              </div>
              <div className="mb-3">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Heure de fin
                </Typography>
                <Input
                  type="number"
                  name={`heureFin-${index}`}
                  label="Heure de fin"
                  size="lg"
                  value={range.heureFin}
                  onChange={(e) => handleChange(e, index, "heureFin")}
                  error={!!errors[index]?.heureFin}
                />
                {errors[index]?.heureFin && (
                  <Typography color="red" className="mt-1">
                    {errors[index].heureFin}
                  </Typography>
                )}
              </div>
            </div>
          ))}
          
        </CardBody>
        <CardFooter className="pt-0 flex justify-between">
          <Button fullWidth className="bg-blue-900" onClick={props.handleClose}>
            Annuler
          </Button>
          <div className="w-4"></div>
          <Button
            fullWidth
            className="bg-blue-900"
            onClick={handleSubmit}
          >
            Ajouter
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
}

export default Updatedisponibilite;
