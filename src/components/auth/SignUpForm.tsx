import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { registerService } from "../../services/authService";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isChecked) {
      setError("Debés aceptar los términos y condiciones");
      return;
    }

    setLoading(true);
    try {
      await registerService(form);
      navigate("/signin"); // redirigir al login tras registrarse
    } catch (err) {
      setError("Error al registrar. Verificá los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Registrarse
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Completá tus datos para crear tu cuenta
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <Label>Nombre <span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    name="nombre"
                    placeholder="Tu nombre"
                    value={form.nombre}
                    onChange={handleChange}
                  />
                </div>
                <div className="sm:col-span-1">
                  <Label>Apellido <span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    name="apellido"
                    placeholder="Tu apellido"
                    value={form.apellido}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Label>Email <span className="text-error-500">*</span></Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Tu email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Teléfono <span className="text-error-500">*</span></Label>
                <Input
                  type="text"
                  name="telefono"
                  placeholder="Tu teléfono"
                  value={form.telefono}
                  onChange={handleChange}
                />
              </div>

              {/* Contraseña informativa — se genera automáticamente */}
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  🔐 Tu contraseña se generará automáticamente como{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    APELLIDO + TELÉFONO
                  </span>
                  . Ejemplo: <span className="font-mono">PEREZ77712345</span>
                </p>
              </div>

              {error && (
                <p className="text-sm text-error-500">{error}</p>
              )}

              <div className="flex items-center gap-3">
                <Checkbox
                  className="w-5 h-5"
                  checked={isChecked}
                  onChange={setIsChecked}
                />
                <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                  Acepto los{" "}
                  <span className="text-gray-800 dark:text-white/90">
                    Términos y Condiciones
                  </span>{" "}
                  y la{" "}
                  <span className="text-gray-800 dark:text-white">
                    Política de Privacidad
                  </span>
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-60"
                >
                  {loading ? "Registrando..." : "Crear cuenta"}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              ¿Ya tenés cuenta?{" "}
              <Link to="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                Iniciá sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}