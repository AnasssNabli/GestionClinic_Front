import { Input, Button, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/services/loginservice";
export function SignIn() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await login(email, password);
      localStorage.setItem("token", token);
      navigate("/dashboard/home");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 lg:w-2/5 flex flex-col items-center">
        <div className="text-center mb-8">
          <img
            src="/img/favicon.png"
            alt="web site logo"
            className="w-24 h-24 mx-auto mb-4" 
          />
          <Typography variant="h2" className="font-bold mb-4 text-blue-900">Se connecter</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Entrer votre email et mot de passe pour se connecter</Typography>
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-6">
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
              Votre email :
            </Typography>
            <Input
              size="lg"
              placeholder="nom@mail.com"
              className="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
              Votre mot de passe :
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className="w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <Typography variant="small" color="red" className="mb-4 text-center">
              {error}
            </Typography>
          )}
          <Button type="submit" className="w-full mt-6 bg-blue-900 text-white hover:bg-blue-800">
           Se connecter
          </Button>

          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Vous n’êtes pas inscrit ? 
            <Link to="/auth/sign-up" className="text-blue-900 ml-1">Créer un compte</Link>
          </Typography>
        </form>
      </div>
      <div className="hidden lg:block lg:w-2/5 m-2">
        <img
          src="/img/login.png"
          alt="medecin logo"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
    </section>
  );
}
export default SignIn;
