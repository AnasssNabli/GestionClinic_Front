import React, { useState } from 'react';
import { Card, Input, Button, Typography, Radio } from "@material-tailwind/react";
import { register } from "@/services/loginservice";
import { Link, useNavigate } from "react-router-dom";

export function SignUp() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [cin, setCin] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [genre, setGenre] = useState("M");
  const [adresse, setAdresse] = useState("");
  const [historiqueMedical, setHistoriqueMedical] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (!validatePassword(newPassword)) {
      setPasswordError("Le mot de passe doit contenir au moins une lettre, un chiffre, un caractère spécial et doit comporter au moins 8 caractères.");

    } else {
      setPasswordError("");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    
    if (!validatePassword(password)) {
      setPasswordError("Le mot de passe doit contenir au moins une lettre, un chiffre, un caractère spécial et doit comporter au moins 8 caractères.");
      return;
    }
  
  
    const userObject = {
      Type: "patient",
      Email: email,
      Password: password,
      Nom: nom,
      Prenom: prenom,
      Telephone: telephone,
      Cin: cin,
      DateNaissance: dateNaissance,
      Genre: genre,
      Adresse: adresse,
      Historiquemedical: historiqueMedical
    };
  
    try {
      console.log(userObject);  
      const token = await register(userObject);
      localStorage.setItem("token", token);
      navigate("/auth/sign-in");  
    } catch (error) {
      console.error("Registration failed:", error);  
      setError(error.message); 
    }
  };
  

  return (
    <section className="m-8 flex flex-col lg:flex-row">
    <div className="w-full lg:w-4/5 h-full hidden lg:flex items-center justify-center mt-12">
    <img
      src="/img/Signup1.jpg"
      className="max-w-full max-h-full object-cover rounded-3xl"
      alt="Signup illustration"
    />
  </div>
  

      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center lg:pl-12">
        <div className="text-center">
          <img
            src="/img/favicon.png"
            alt="web site logo"
            className="w-24 h-24 mx-auto mb-4" 
          />
          <Typography variant="h2" className="font-bold mb-4 text-blue-900">Rejoignez-nous dès aujourd’hui</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal mb-8">Entrez vos informations pour vous inscrire.</Typography>
        </div>
        <form className="w-full max-w-md lg:max-w-xl" onSubmit={handleRegister}>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  size="lg"
                  label='Nom'
                  value={nom}
                  onChange={(e) => setNom(e.target.value)} 
                  className="mb-4"
                />
              </div>
              <div className="flex-1">
                <Input
                  size="lg"
                  label='Prenom'
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)} 
                  className="mb-4"
                />
              </div>
            </div>
            <Input
              size="lg"
              label='Votre email'
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              className="mb-4"
            />
            <Input
              type="password"
              size="lg"
              label='Password'
              value={password}
              onChange={handlePasswordChange} 
              error={!!passwordError}
              className="mb-4"
            />
            {passwordError && (
              <Typography variant="small" color="red" className="mb-4">{passwordError}</Typography>
            )}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  size="lg"
                  label='Telephone'
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)} 
                  className="mb-4"
                />
              </div>
              <div className="flex-1">
                <Input
                  size="lg"
                  label='CIN'
                  value={cin}
                  onChange={(e) => setCin(e.target.value)} 
                  className="mb-4"
                />
              </div>
            </div>
            <Input
              type="date"
              size="lg"
              label='Date de Naissance'
              value={dateNaissance}
              onChange={(e) => setDateNaissance(e.target.value)} 
              className="mb-4"
            />
            <Input
              size="lg"
              label='Adresse'
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)} 
              className="mb-4"
            />
            <Input
              size="lg"
              label='Historique Medical'
              value={historiqueMedical}
              onChange={(e) => setHistoriqueMedical(e.target.value)} 
              className="mb-4"
            />
            <Typography variant="small" className="mb-2 font-medium text-gray-600">
              Genre
            </Typography>
            <div className="flex items-center gap-6 mb-6">
              <label className="flex items-center space-x-2">
                <Radio
                  name="genre"
                  value="M"
                  checked={genre === "M"}
                  onChange={(e) => setGenre(e.target.value)}
                  color='blue-gray'
                />
                <Typography variant="small" color="blue-gray">Male</Typography>
              </label>
              <label className="flex items-center space-x-2">
                <Radio
                  name="genre"
                  value="F"
                  checked={genre === "F"}
                  onChange={(e) => setGenre(e.target.value)}
                  color='blue-gray'
                />
                <Typography variant="small" color="blue-gray">Female</Typography>
              </label>
            </div>
            <Button className="w-full bg-blue-900 text-white hover:bg-blue-800" type="submit">
              Inscrivez-vous maintenant
            </Button>
            <div className="space-y-4 mt-8">
              {error && <Typography variant="small" color="red">{error}</Typography>}
            </div>
            <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
              Vous avez déjà un compte ?
              <Link to="/auth/sign-in" className="text-blue-900 ml-1">Se connecter</Link>
            </Typography>
          </div>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
