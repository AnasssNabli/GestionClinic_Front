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
  Select,
  Option
} from "@material-tailwind/react";
import { confirmation } from "@/widgets/alert_confirmation";
import { register2 } from "@/services/login.service";
import SweetAlert from 'sweetalert2'; 

export function AddSecretaire(props) {
  const { open, handleOpen, setReload, medecins } = props;

  const [formData, setFormData] = useState({
    type: "secretary",
    nom: "",
    prenom: "",
    cin: "",
    telephone: "",
    dateNaissance: "",
    email: "",
    Superieurid_medecin: "", 
    password: "",
  });

  const [errors, setErrors] = useState({});

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
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
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
      let confirmer = await confirmation();
      if (confirmer) {
        try {
          await register2(formData);
          setReload(formData);
          handleOpen();
          SweetAlert.fire("Bravo", "Secrétaire ajouté avec succès.", "success");
          
          // Reset form data after successful submission
          setFormData({
            type: "secretary",
            nom: "",
            prenom: "",
            cin: "",
            telephone: "",
            dateNaissance: "",
            email: "",
            Superieurid_medecin: "",
            password: "",
          });

          console.log("Secrétaire ajouté avec succès !");
        } catch (error) {
          SweetAlert.fire("Erreur", "Une erreur s'est produite lors de l'ajout' du secrétaire.", "error");
        }
      } else {
        handleOpen();
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
    setFormData({ ...formData, Superieurid_medecin: value });
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
          <Typography variant="h4" className="text-center text-blue-900">
            Ajouter une secrétaire
          </Typography>
          <Typography
            className="mb-3 font-normal text-center"
            variant="paragraph"
            color="gray"
          >
            Entrer les détails d'une secrétaire
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2"> {/* Adjusted gap */}
            {[
              { name: 'nom', label: 'Nom', type: 'text' },
              { name: 'prenom', label: 'Prénom', type: 'text' },
              { name: 'cin', label: 'CIN', type: 'text' },
              { name: 'telephone', label: 'Téléphone', type: 'text' },
              { name: 'dateNaissance', label: 'Date de Naissance', type: 'date' },
              { name: 'email', label: 'Email', type: 'email' },
              { name: 'password', label: 'Mot de Passe', type: 'password' }
            ].map((field, index) => (
              <div className="my-2" key={index}> {/* Adjusted margin */}
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
            <div className="my-2"> {/* Adjusted margin */}
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Supérieur
              </Typography>
              <Select
                label="Supérieur"
                onChange={(e) => handleSelectChange(e)}
                name="Superieurid_medecin"
                error={!!errors.Superieurid_medecin}
              >
                {medecins.map((medecin, key) => (
                  <Option key={key} value={medecin.id_medecin.toString()}>
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
            Ajouter
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
}

export default AddSecretaire;
