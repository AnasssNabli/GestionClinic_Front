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
import { updateMedecin } from "@/services/medecins.services";
import { confirmation } from "@/widgets/alert_confirmation";
import SweetAlert from 'sweetalert2';

export function UpdateMedecin(props) {
  const { medecin, departements, open, handleOpen, setReload } = props;

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    cin: "",
    telephone: "",
    dateNaissance: "",
    email: "",
    specialisation: "",
    DepartementID: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (medecin && medecin.utilisateur) {
      setFormData({
        nom: medecin.utilisateur.nom || "",
        prenom: medecin.utilisateur.prenom || "",
        cin: medecin.utilisateur.cin || "",
        telephone: medecin.utilisateur.telephone || "",
        dateNaissance: medecin.utilisateur.dateNaissance || "",
        email: medecin.utilisateur.email || "",
        specialisation: medecin.specialisation || "",
        DepartementID: medecin.departementID || "",
        password: "",
      });
    }
  }, [medecin]);

  const handleChange = (e, name) => {
    const { value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, DepartementID: value });
    setErrors({ ...errors, DepartementID: "" });
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
    if (!formData.specialisation) {
      newErrors.specialisation = "La spécialisation est requise";
      isValid = false;
    }
    if (!formData.DepartementID) {
      newErrors.DepartementID = "Le département est requis";
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
          await updateMedecin(medecin.id_medecin, formData);
          setReload();
          handleOpen();
          SweetAlert.fire("Bravo", "Médecin mis à jour avec succès", "success");
        } catch (error) {
          console.error("Erreur lors de la mise à jour du médecin :", error);
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
        <CardBody className="flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
          <Typography variant="h4" color="blue-gray" className="text-center text-blue-900">
            Modifier un médecin
          </Typography>
          <Typography
            className="mb-3 font-normal text-center"
            variant="paragraph"
            color="gray"
          >
            Entrer les détails du médecin
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'nom', label: 'Nom', type: 'text' },
              { name: 'prenom', label: 'Prénom', type: 'text' },
              { name: 'cin', label: 'CIN', type: 'text' },
              { name: 'telephone', label: 'Téléphone', type: 'text' },
              { name: 'dateNaissance', label: 'Date de Naissance', type: 'date' },
              { name: 'email', label: 'Email', type: 'email' },
              { name: 'specialisation', label: 'Spécialisation', type: 'text' },
              { name: 'password', label: 'Mot de Passe', type: 'password' }
            ].map((field, index) => (
              <div className="my-4" key={index}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
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
            <div className="my-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Département
              </Typography>
              <Select
                label="Département"
                onChange={handleSelectChange}
                name="DepartementID"
                value={formData.DepartementID}
                error={!!errors.DepartementID}
              >
                {departements.map((departement, key) => (
                  <Option key={key} value={departement.id_dep}>
                    {departement.nom}
                  </Option>
                ))}
              </Select>
              {errors.DepartementID && <Typography color="red" className="mt-1">{errors.DepartementID}</Typography>}
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

export default UpdateMedecin;
