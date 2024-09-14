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
} from "@material-tailwind/react";
import { updateSecretaire } from "@/services/secretaires.service";
import { confirmation } from "@/widgets/alert_confirmation";
import SweetAlert from 'sweetalert2';

export function UpdateSecretaire(props) {
  const { secretaire, medecins, open, handleOpen, setReload } = props;

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    cin: "",
    telephone: "",
    dateNaissance: "",
    email: "",
    Superieurid_medecin: "",
    password: "Anas246@",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (secretaire && secretaire.utilisateur) {
      setFormData({
        nom: secretaire.utilisateur.nom || "",
        prenom: secretaire.utilisateur.prenom || "",
        cin: secretaire.utilisateur.cin || "",
        telephone: secretaire.utilisateur.telephone || "",
        dateNaissance: secretaire.utilisateur.dateNaissance || "",
        email: secretaire.utilisateur.email || "",
        Superieurid_medecin: secretaire.superieur?.id_medecin || "",
        password: "",
      });
    }
  }, [secretaire]);

  const handleChange = (e, name) => {
    const { value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, Superieurid_medecin: value });
    setErrors({ ...errors, Superieurid_medecin: "" });
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
  
    if (!formData.Superieurid_medecin) {
      newErrors.Superieurid_medecin = "Le supérieur est requis";
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
          await updateSecretaire(secretaire.secretaireID, formData);
          setReload();
          handleOpen();
          SweetAlert.fire("Bravo", "Secrétaire mis à jour avec succès", "success");
        } catch (error) {
          console.error("Erreur lors de la mise à jour du secrétaire :", error);
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
        <CardBody className="flex flex-col gap-3 overflow-y-auto max-h-[70vh]">
          <Typography variant="h4" color="blue-gray" className="text-center text-blue-900">
            Modifier une secrétaire
          </Typography>
          <Typography
            className="mb-2 font-normal text-center"
            variant="paragraph"
            color="gray"
          >
            Entrer les détails du secrétaire
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'nom', label: 'Nom', type: 'text' },
              { name: 'prenom', label: 'Prénom', type: 'text' },
              { name: 'cin', label: 'CIN', type: 'text' },
              { name: 'telephone', label: 'Téléphone', type: 'text' },
              { name: 'dateNaissance', label: 'Date de Naissance', type: 'date' },
              { name: 'email', label: 'Email', type: 'email' },
              
            ].map((field, index) => (
              <div className="my-2" key={index}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-1 font-medium"
                >
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
            <div className="my-2 col-span-1 md:col-span-2">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-1 font-medium"
              >
                Supérieur
              </Typography>
              <Select
                label="Supérieur"
                onChange={handleSelectChange}
                name="Superieurid_medecin"
                value={formData.Superieurid_medecin}
                error={!!errors.Superieurid_medecin}
              >
                {medecins.map((medecin, key) => (
                  <Option key={key} value={medecin.id_medecin}>
                    {medecin.utilisateur.nom} {medecin.utilisateur.prenom}
                  </Option>
                ))}
              </Select>
              {errors.Superieurid_medecin && <Typography color="red" className="mt-1">{errors.Superieurid_medecin}</Typography>}
            </div>
          </div>
        </CardBody>
        <CardFooter className="pt-0 flex justify-between">
          <Button fullWidth className="bg-blue-900" onClick={handleOpen}>
            Annuler
          </Button>
          <div className="w-4"></div>
          <Button fullWidth className="bg-blue-900" onClick={handleSubmit}>
            Mettre à jour
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
}

export default UpdateSecretaire;
