import React, { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Textarea,
  IconButton,
} from "@material-tailwind/react";
import { confirmation } from "@/widgets/alert_confirmation";
import { createDepartement } from "@/services/departement.service";

export function AddDepartement(props) {
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.nom) {
      newErrors.nom = "Le nom est requis";
      isValid = false;
    }
    if (!formData.description) {
      newErrors.description = "La description est requise";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      let confirmer = await confirmation();
      if (confirmer) {
        try {
          await createDepartement(formData);
          props.setReload(formData); 
          props.handleOpen(); 
          
          // Reset form data after successful submission
          setFormData({
            nom: "",
            description: "",
          });

          console.log("Département ajouté avec succès !");
        } catch (error) {
          console.error("Erreur lors de l'ajout du département :", error);
        }
      } else {
        props.handleOpen();
      }
    }
  };

  const handleChange = (e, name) => {
    const { value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  return (
    <Dialog
      open={props.open}
      handler={props.handleOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full max-w-[60rem] p-6">
        <div className="flex justify-end pe-2 pt-2">
          <IconButton
            size="sm"
            variant="text"
            onClick={props.handleOpen}
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
        <CardBody className="flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
          <Typography variant="h4"  className="text-center text-blue-900">
            Ajouter un département
          </Typography>
          <Typography
            className="mb-3 font-normal text-center"
            variant="paragraph"
            color="gray"
          >
            Entrer les détails du département
          </Typography>
          <div className="my-4">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 font-medium"
            >
              Nom
            </Typography>
            <Input
              name="nom"
              label="Nom"
              size="lg"
              value={formData.nom}
              onChange={(e) => handleChange(e, "nom")}
              error={!!errors.nom}
            />
            {errors.nom && <Typography color="red" className="mt-1">{errors.nom}</Typography>}
          </div>
          <div className="my-4">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 font-medium"
            >
              Description
            </Typography>
            <Textarea
              name="description"
              label="Description"
              size="lg"
              value={formData.description}
              onChange={(e) => handleChange(e, "description")}
              error={!!errors.description}
            />
            {errors.description && <Typography color="red" className="mt-1">{errors.description}</Typography>}
          </div>
        </CardBody>
        <CardFooter className="pt-0 flex justify-between">
          <Button fullWidth className="bg-blue-900" onClick={props.handleOpen}>
            Annuler
          </Button>
          <div className="w-4"></div>
          <Button fullWidth className="bg-blue-900" onClick={handleSubmit}>
            Ajouter
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
}

export default AddDepartement;
