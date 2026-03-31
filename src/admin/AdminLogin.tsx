import { useState } from "react";
import adminCredentials from "../data/admin.json";
import { writeStorage } from "../utils/storage";

type AdminLoginProps = {
  onSuccess: () => void;
};

const AUTH_KEY = "lourdestecocina:admin:auth";

export const AdminLogin = ({ onSuccess }: AdminLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      username === adminCredentials.username &&
      password === adminCredentials.password
    ) {
      writeStorage(AUTH_KEY, true);
      onSuccess();
      return;
    }
    setError("Usuario o contraseña incorrectos.");
  };

  return (
    <div className="mx-auto max-w-md rounded-ui border border-black/10 bg-white p-6">
      <h1 className="text-2xl font-semibold text-primary">Ingreso admin</h1>
      <p className="text-sm text-muted">Acceso simple para editar el menú.</p>
      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
          placeholder="Usuario"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error && <p className="text-xs text-accent">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};
