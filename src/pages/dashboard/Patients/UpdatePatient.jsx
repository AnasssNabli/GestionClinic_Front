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
  Textarea,
} from "@material-tailwind/react";
import { updatePatient } from "@/services/patients.service";
import { confirmation } from "@/widgets/alert_confirmation";
import Swal from "sweetalert2";

export function UpdatePatient(props) {
  const { patient, open, handleOpen, setReload } = props;

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    cin: "",
    telephone: "",
    dateNaissance: "",
    email: "",
    adresse: "",
    HistoriqueMedical: "",
    genre: "",
    password: "", 
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (patient && patient.utilisateur) {
      setFormData({
        nom: patient.utilisateur.nom || "",
        prenom: patient.utilisateur.prenom || "",
        cin: patient.utilisateur.cin || "",
        telephone: patient.utilisateur.telephone || "",
        dateNaissance: patient.utilisateur.dateNaissance || "",
        email: patient.utilisateur.email || "",
        adresse: patient.adresse || "",
        HistoriqueMedical: patient.historiquemedical || "",
        genre: patient.genre ? "F" : "M" || "", 
        password: patient.utilisateur.password || "", 
      });
    }
  }, [patient]);

  const handleChange = (e, name) => {
    const { value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, genre: value });
    setErrors({ ...errors, genre: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.nom) {
      newErrors.nom = "Le nom est requis";
      isValid = false;
    }
    if (!formData.prenom) {
      newErrors.prenom = "Le prénom est requis";
      isValid = false;
    }
    if (!formData.cin) {
      newErrors.cin = "Le CIN est requis";
      isValid = false;
    }
    if (!formData.telephone) {
      newErrors.telephone = "Le téléphone est requis";
      isValid = false;
    }
    if (!formData.dateNaissance) {
      newErrors.dateNaissance = "La date de naissance est requise";
      isValid = false;
    }
    if (!formData.email) {
      newErrors.email = "L'email est requis";
      isValid = false;
    }
    if (!formData.genre) {
      newErrors.genre = "Le genre est requis";
      isValid = false;
    }
    if (!formData.adresse) {
      newErrors.adresse = "L'adresse est requise";
      isValid = false;
    }
    if (!formData.HistoriqueMedical) {
      newErrors.HistoriqueMedical = "L'historique médical est requis";
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
          await updatePatient(patient.id_patient, formData);
          setReload();
          handleOpen();
          Swal.fire("Bravo", "Patient mis à jour avec succès", "success");
        } catch (error) {
          console.error("Erreur lors de la mise à jour du patient :", error);
          Swal.fire("Erreur", "Une erreur s'est produite lors de la mise à jour du patient.", "error");
        }
      } else {
        handleOpen();
      }
    }
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full max-w-[80rem] p-6">
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
        <CardBody className="flex flex-col gap-6 overflow-y-auto max-h-[80vh]">
          <Typography variant="h4" color="blue-gray" className="text-center text-blue-900">
            Modifier un patient
          </Typography>
          <Typography className="mb-4 font-normal text-center" variant="paragraph" color="gray">
            Entrer les détails du patient
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'nom', label: 'Nom', type: 'text' },
              { name: 'prenom', label: 'Prénom', type: 'text' },
              { name: 'cin', label: 'CIN', type: 'text' },
              { name: 'telephone', label: 'Téléphone', type: 'text' },
              { name: 'dateNaissance', label: 'Date de Naissance', type: 'date' },
              { name: 'email', label: 'Email', type: 'email' },
              { name: 'password', label: 'Mot de Passe', type: 'password' },
            ].map((field, index) => (
              <div className="my-4" key={index}>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  {field.label}
                </Typography>
                <Input
                  name={field.name}
                  type={field.type}
                  label={field.label}
                  size="lg"
                  value={formData[field.name]}
                  onChange={(e) => handleChange(e, field.name)}
                  error={!!errors[field.name]}
                />
                {errors[field.name] && <Typography color="red" className="mt-1">{errors[field.name]}</Typography>}
              </div>
            ))}
            <div className="my-4">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Genre
              </Typography>
              <Select
                label="Genre"
                name="genre"
                onChange={(e) => handleSelectChange(e.target.value)}  
                value={formData.genre}  
                error={!!errors.genre}
              >
                <Option value="M">Homme</Option>
                <Option value="F">Femme</Option>
              </Select>
              {errors.genre && <Typography color="red" className="mt-1">{errors.genre}</Typography>}
            </div>
            <div className="my-4 col-span-full">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Historique Médical
              </Typography>
              <Textarea
                name="HistoriqueMedical"
                label="Historique Médical"
                size="lg"
                value={formData.HistoriqueMedical}
                onChange={(e) => handleChange(e, 'HistoriqueMedical')}
                error={!!errors.HistoriqueMedical}
                rows={4}
              />
              {errors.HistoriqueMedical && <Typography color="red" className="mt-1">{errors.HistoriqueMedical}</Typography>}
            </div>
            <div className="my-4 col-span-full">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Adresse
              </Typography>
              <Textarea
                name="adresse"
                label="Adresse"
                size="lg"
                value={formData.adresse}
                onChange={(e) => handleChange(e, 'adresse')}
                error={!!errors.adresse}
                rows={4}
              />
              {errors.adresse && <Typography color="red" className="mt-1">{errors.adresse}</Typography>}
            </div>
          </div>
        </CardBody>
        <CardFooter className="pt-0 flex justify-between">
          <Button fullWidth variant="gradient" onClick={handleOpen}>
            Annuler
          </Button>
          <div className="w-4"></div>
          <Button fullWidth variant="gradient" color="blue" onClick={handleSubmit}>
            Mettre à jour
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
}

export default UpdatePatient;
