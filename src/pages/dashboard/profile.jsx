import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Button,
  Input,
} from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import { fetchUserData, UpdateUserData } from "@/services/profil.service";
import SweetAlert from 'sweetalert2';
import { confirmation } from "@/widgets/alert_confirmation";

export function Profile() {
  const [formData, setFormData] = useState({
    id: "",
    prenom: "",
    nom: "",
    cin: "",
    email: "",
    dateNaissance: "",
    telephone: "",
    oldPassword: "",
    newPassword: "", // Modifié pour correspondre au back-end
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    prenom: "",
    nom: "",
    cin: "",
    email: "",
    dateNaissance: "",
    telephone: "",
    oldPassword: "",
    newPassword: "", // Modifié pour correspondre au back-end
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const fetchInfo = async () => {
    try {
      const res = await fetchUserData();
      const userData = res.data;
      setFormData({
        id: userData.id,
        prenom: userData.prenom,
        nom: userData.nom,
        cin: userData.cin,
        email: userData.email,
        dateNaissance: userData.dateNaissance,
        telephone: userData.telephone,
        oldPassword: "",
        newPassword: "", // Modifié pour correspondre au back-end
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des informations utilisateur", error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevState) => ({ ...prevState, [name]: "" }));
  };

  const validatePassword = () => {
    const { newPassword, confirmPassword } = formData;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (newPassword && !passwordRegex.test(newPassword)) {
      setPasswordError(
        "Le mot de passe doit comporter au moins 8 caractères, inclure des majuscules, des minuscules, un chiffre et un caractère spécial."
      );
      return false;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas.");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Validation des champs requis
    for (const key in formData) {
      if (formData[key] === "" && key !== "oldPassword" && key !== "newPassword" && key !== "confirmPassword") {
        newErrors[key] = "Ce champ est requis.";
        valid = false;
      }
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Adresse email invalide.";
      valid = false;
    }

    setErrors(newErrors);

    // Validation du mot de passe
    if (formData.newPassword || formData.confirmPassword) {
      if (!validatePassword()) {
        valid = false;
      }
    }

    return valid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const confirmer = await confirmation();
      if (confirmer) {
        try {
          const id = formData.id;
          await UpdateUserData(id, formData);

          SweetAlert.fire("Bravo", "Profil mis à jour avec succès", "success");
        } catch (error) {
          Swal.fire("Erreur", "Une erreur s'est produite lors de la mise à jour du profil.", "error");
        }
      } else {
        console.log('erreur de validation du formulaire');
      }
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-5xl mx-auto shadow-2xl rounded-lg p-10 transition-transform transform hover:scale-105 duration-500">
        <CardBody>
          {/* Photo de profil et boutons */}
          <div className="flex items-center justify-between pb-8 border-b border-gray-300">
            <div className="flex items-center gap-6">
              <Avatar
                src="/img/user.png"
                alt="Photo de profil"
                size="xl"
                variant="rounded"
                className="shadow-lg"
              />
              <div>
                <Typography variant="h4" className="font-bold text-gray-900">
                  {formData.prenom} {formData.nom}
                </Typography>
                <Typography variant="small" className="text-gray-500">
                  {formData.email}
                </Typography>
              </div>
            </div>
            <div className="flex gap-4">
            <Link to="/home" className="inline-block">
            <Button
              size="sm"
              color="blue"
              className="transition duration-300 transform hover:scale-110 hover:bg-blue-900"
            >
              Retour
            </Button>
          </Link>
            </div>
          </div>

          {/* Section Formulaire */}
          <Typography variant="h6" className="font-bold mt-3">
            Les informations générales
          </Typography>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-gray-300">
            {/* Première colonne */}
            <div className="space-y-4">
              <Input
                label="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                className="focus:ring focus:ring-blue-500 rounded-lg shadow-md transition-all duration-300"
              />
              {errors.prenom && (
                <Typography variant="small" className="text-red-500">
                  {errors.prenom}
                </Typography>
              )}
              <Input
                label="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                className="focus:ring focus:ring-blue-500 rounded-lg shadow-md transition-all duration-300"
              />
              {errors.nom && (
                <Typography variant="small" className="text-red-500">
                  {errors.nom}
                </Typography>
              )}
              <Input
                label="Numéro de téléphone"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                className="focus:ring focus:ring-blue-500 rounded-lg shadow-md transition-all duration-300"
              />
              {errors.telephone && (
                <Typography variant="small" className="text-red-500">
                  {errors.telephone}
                </Typography>
              )}
            </div>

            {/* Deuxième colonne */}
            <div className="space-y-4">
              <Input
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="focus:ring focus:ring-blue-500 rounded-lg shadow-md transition-all duration-300"
              />
              {errors.email && (
                <Typography variant="small" className="text-red-500">
                  {errors.email}
                </Typography>
              )}
              <Input
                label="Date de naissance"
                type="date"
                name="dateNaissance"
                value={formData.dateNaissance}
                onChange={handleInputChange}
                className="focus:ring focus:ring-blue-500 rounded-lg shadow-md transition-all duration-300"
              />
              {errors.dateNaissance && (
                <Typography variant="small" className="text-red-500">
                  {errors.dateNaissance}
                </Typography>
              )}
              <Input
                label="Cin"
                name="cin"
                value={formData.cin}
                onChange={handleInputChange}
                className="focus:ring focus:ring-blue-500 rounded-lg shadow-md transition-all duration-300"
              />
              {errors.cin && (
                <Typography variant="small" className="text-red-500">
                  {errors.cin}
                </Typography>
              )}
            </div>
          </div>

          {/* Section Comptes sociaux */}
          <div className="mt-8 space-y-4 pb-8 border-b border-gray-300">
            <Typography variant="h6" className="font-bold">
              Comptes sociaux
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <Typography>Compte Facebook</Typography>
                <Button size="sm" color="blue" className="transition duration-300 transform hover:scale-110">
                  Se connecter
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <Typography>Compte Twitter</Typography>
                <Button size="sm" color="blue" className="transition duration-300 transform hover:scale-110">
                  Se connecter
                </Button>
              </div>
            </div>
          </div>

          
          {/* Section Changement de mot de passe */}
          <div className="mt-8 space-y-4 pb-8 border-b border-gray-300">
          <Typography variant="h6" className="font-bold">
            Changement de mot de passe
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Ancien mot de passe"
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleInputChange}
              className="focus:ring focus:ring-blue-500 rounded-lg shadow-md transition-all duration-300"
            />
            {errors.oldPassword && (
              <Typography variant="small" className="text-red-500">
                {errors.oldPassword}
              </Typography>
            )}
            <Input
              label="Nouveau mot de passe"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="focus:ring focus:ring-blue-500 rounded-lg shadow-md transition-all duration-300"
            />
            {errors.newPassword && (
              <Typography variant="small" className="text-red-500">
                {errors.newPassword}
              </Typography>
            )}
            <Input
              label="Confirmer le nouveau mot de passe"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="focus:ring focus:ring-blue-500 rounded-lg shadow-md transition-all duration-300"
            />
            {errors.confirmPassword && (
              <Typography variant="small" className="text-red-500">
                {errors.confirmPassword}
              </Typography>
            )}
          </div>
          {passwordError && (
            <Typography variant="small" className="text-red-500">
              {passwordError}
            </Typography>
          )}
          </div>


          {/* Bouton de soumission */}
          <div className="float-right mt-6">
            <Button
              size="md"
              color="green"
              onClick={handleSubmit}
              className="transition duration-300 transform hover:scale-110"
            >
             Sauvegarder les modifications
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Profile;