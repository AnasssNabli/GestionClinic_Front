import React, { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  Select,
  CardBody,
  Option,
  CardFooter,
  Typography,
  Input,
  IconButton,
} from "@material-tailwind/react";
import { confirmation } from "@/widgets/alert_confirmation";
import { register2 } from "@/services/login.service";
import SweetAlert from 'sweetalert2'; 
export function AddMedecin(props) {
  const [formData, setFormData] = useState({
    "type" : "medecin" , 
    nom: "",
    prenom: "",
    cin: "",
    telephone: "",
    dateNaissance: "",
    email: "",
    specialisation: "",
    password: "",  
  });

  const [errors, setErrors] = useState({});
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    if (!validatePassword(newPassword)) {
      setPasswordError("Le mot de passe doit contenir au moins une lettre, un chiffre, un caractère spécial et doit comporter au moins 8 caractères.");
    } else {
      setPasswordError("");
    }
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
    if (!formData.password) {  
      newErrors.password = "Le mot de passe est requis";
      isValid = false;
    } else if (passwordError) {
      newErrors.password = passwordError;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };


  const handleSelectChange = (value) => {
    setFormData({ ...formData, DepartementID: value });
  };
  
  const handleSubmit = async () => {
    if (validateForm()) {
      let confirmer = await confirmation();
      if (confirmer) {
        try {
          await register2(formData);
          props.setReload(formData); 
          props.handleOpen(); 
          SweetAlert.fire("Bravo", "Médecin  ajouté avec succès .", "success");
          console.log("Médecin ajouté avec succès !");
        } catch (error) {
          console.error("Erreur lors de l'ajout du médecin :", error);
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
    if (name === "password") {
      handlePasswordChange(e);
    }
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
        <CardBody className="flex flex-col gap-2 overflow-y-auto max-h-[70vh]">
          <Typography variant="h4" className="text-center text-blue-900">
            Ajouter un médecin
          </Typography>
          <div className="my-2 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
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
              {errors.nom && (
                <Typography color="red" className="mt-1">
                  {errors.nom}
                </Typography>
              )}
            </div>
            <div className="flex-1 min-w-[200px]">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Prénom
              </Typography>
              <Input
                name="prenom"
                label="Prénom"
                size="lg"
                value={formData.prenom}
                onChange={(e) => handleChange(e, "prenom")}
                error={!!errors.prenom}
              />
              {errors.prenom && (
                <Typography color="red" className="mt-1">
                  {errors.prenom}
                </Typography>
              )}
            </div>
          </div>
          <div className="my-2 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Département
              </Typography>
              <Select
                error={!!errors.departement}
                label="Département"
                onChange={(e) => handleSelectChange(e)}
                name="departement"
              >
                {props.departements.map(departement => (
                  <Option key={departement.id_dep} value={departement.id_dep.toString()}>
                    {departement.nom}
                  </Option>
                ))}
              </Select>
              {errors.departement && (
                <Typography color="red" className="mt-1">
                  {errors.departement}
                </Typography>
              )}

            </div>
          </div>
          <div className="my-2 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                CIN
              </Typography>
              <Input
                name="cin"
                label="CIN"
                size="lg"
                value={formData.cin}
                onChange={(e) => handleChange(e, "cin")}
                error={!!errors.cin}
              />
              {errors.cin && (
                <Typography color="red" className="mt-1">
                  {errors.cin}
                </Typography>
              )}
            </div>
            <div className="flex-1 min-w-[200px]">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Téléphone
              </Typography>
              <Input
                name="telephone"
                label="Téléphone"
                size="lg"
                value={formData.telephone}
                onChange={(e) => handleChange(e, "telephone")}
                error={!!errors.telephone}
              />
              {errors.telephone && (
                <Typography color="red" className="mt-1">
                  {errors.telephone}
                </Typography>
              )}
            </div>
          </div>
          <div className="my-2 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Date de Naissance
              </Typography>
              <Input
                type="date"
                name="dateNaissance"
                label="Date de Naissance"
                size="lg"
                value={formData.dateNaissance}
                onChange={(e) => handleChange(e, "dateNaissance")}
                error={!!errors.dateNaissance}
              />
              {errors.dateNaissance && (
                <Typography color="red" className="mt-1">
                  {errors.dateNaissance}
                </Typography>
              )}
            </div>
            <div className="flex-1 min-w-[200px]">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Email
              </Typography>
              <Input
                name="email"
                label="Email"
                size="lg"
                value={formData.email}
                onChange={(e) => handleChange(e, "email")}
                error={!!errors.email}
              />
              {errors.email && (
                <Typography color="red" className="mt-1">
                  {errors.email}
                </Typography>
              )}
            </div>
          </div>
          <div className="my-2 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Mot de passe
              </Typography>
              <Input
                type="password"
                name="password"
                label="Mot de passe"
                size="lg"
                value={formData.password}
                onChange={handlePasswordChange}
                error={!!errors.password}
              />
              {errors.password && (
                <Typography color="red" className="mt-1">
                  {errors.password}
                </Typography>
              )}
            </div>
            <div className="flex-1 min-w-[200px]">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Spécialisation
              </Typography>
              <Input
                name="specialisation"
                label="Spécialisation"
                size="lg"
                value={formData.specialisation}
                onChange={(e) => handleChange(e, "specialisation")}
                error={!!errors.specialisation}
              />
              {errors.specialisation && (
                <Typography color="red" className="mt-1">
                  {errors.specialisation}
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

AddMedecin.displayName = "/src/widgets/layout/AddMedecin.jsx";

export default AddMedecin;
