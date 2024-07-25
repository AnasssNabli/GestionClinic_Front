import React, { useState } from 'react';
import {
  Card,
  Input,
  Button,
  Typography,
  Radio,
} from "@material-tailwind/react";
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
      setPasswordError("Password must contain at least one letter, one number, one special character, and be at least 8 characters long.");
    } else {
      setPasswordError("");
    }
  };

  const handleregister = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setPasswordError("Password must contain at least one letter, one number, one special character, and be at least 8 characters long.");
      return;
    }
    try {
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
      console.log(userObject);
      const token = await register(userObject);
      localStorage.setItem("token", token);
      navigate("/dashboard/home");
    } catch (error) {
      console.log("Registration failed:", error);
      setError(error.message); 
    }
  };

  return (
    <section className="m-8 flex">
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your details to register.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleregister}>
          <div className="mb-1 flex flex-col gap-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  size="lg"
                  label='Nom'
                  value={nom}
                  onChange={(e) => setNom(e.target.value)} 
                />
              </div>
              <div className="flex-1">
                <Input
                  size="lg"
                  label='Prenom'
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)} 
                />
              </div>
            </div>
            <Input
              size="lg"
              label='Your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
            <Input
              type="password"
              size="lg"
              label='Password'
              value={password}
              onChange={handlePasswordChange} 
              error={!!passwordError}
            />
            {passwordError && (
              <Typography variant="small" color="red">{passwordError}</Typography>
            )}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  size="lg"
                  label='Telephone'
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)} 
                />
              </div>
              <div className="flex-1">
                <Input
                  size="lg"
                  label='CIN'
                  value={cin}
                  onChange={(e) => setCin(e.target.value)} 
                />
              </div>
            </div>
            <Input
              type="date"
              size="lg"
              label='Date de Naissance'
              value={dateNaissance}
              onChange={(e) => setDateNaissance(e.target.value)} 
            />
            
            <Input
              size="lg"
              label='Adresse'
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)} 
            />
            <Input
              size="lg"
              label='Historique Medical'
              value={historiqueMedical}
              onChange={(e) => setHistoriqueMedical(e.target.value)} 
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Genre
            </Typography>
            <div className="flex gap-10">
              <Radio
                name="genre"
                label="Male"
                value="M"
                checked={genre === "M"}
                onChange={(e) => setGenre(e.target.value)}
              />
              <Radio
                name="genre"
                label="Female"
                value="F"
                checked={genre === "F"}
                onChange={(e) => setGenre(e.target.value)}
              />
            </div>
          </div>
          
          <Button className="mt-6" fullWidth type="submit">
            Register Now
          </Button>

          <div className="space-y-4 mt-8">
            {error && <Typography variant="small" color="red">{error}</Typography>}
          </div>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Already have an account?
            <Link to="/auth/sign-in" className="text-gray-900 ml-1">Sign in</Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
