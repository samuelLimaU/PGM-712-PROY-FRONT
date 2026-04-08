import { useState } from "react";
import { useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Checkbox from "../../components/form/input/Checkbox";
import Button from "../../components/ui/button/Button";
import GridShape from "../../components/common/GridShape";
import { loginService } from "../../services/authService";
import { registerService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

type Mode = "signin" | "signup";

interface AuthPageProps {
  initialMode?: Mode;
}

export default function AuthPage({ initialMode = "signin" }: AuthPageProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [animating, setAnimating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    nombre: "", apellido: "", email: "", telefono: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const switchMode = (next: Mode) => {
    if (animating || mode === next) return;
    setAnimating(true);
    setError("");
    setTimeout(() => {
      setMode(next);
      setAnimating(false);
    }, 500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginService(loginForm.email, loginForm.password);
      login(data);
      navigate("/");
    } catch {
      setError("Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isChecked) {
      setError("Debés aceptar los términos y condiciones");
      return;
    }
    setLoading(true);
    try {
      await registerService(registerForm);
      switchMode("signin");
    } catch {
      setError("Error al registrar. Verificá los datos.");
    } finally {
      setLoading(false);
    }
  };

  const isSignIn = mode === "signin";

  // Clases de animación
  const formClasses = `
    absolute inset-y-0 w-1/2 flex flex-col justify-center px-10 bg-white dark:bg-gray-900
    transition-all duration-500 ease-in-out
    ${isSignIn
      ? animating ? "left-0 translate-x-full opacity-0" : "left-0 translate-x-0 opacity-100"
      : animating ? "left-0 translate-x-0 opacity-0" : "left-1/2 translate-x-0 opacity-100"
    }
  `;

  const greenClasses = `
    absolute inset-y-0 w-1/2 flex flex-col items-center justify-center gap-5
    transition-all duration-500 ease-in-out
    ${isSignIn
      ? animating ? "left-1/2 -translate-x-full opacity-0" : "left-1/2 translate-x-0 opacity-100"
      : animating ? "left-1/2 translate-x-0 opacity-0" : "left-0 translate-x-0 opacity-100"
    }
  `;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white dark:bg-gray-900">

      {/* Panel formulario */}
      <div className={formClasses}>
        <div className="w-full max-w-sm mx-auto">

          {isSignIn ? (
            <>
              <div className="mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90">
                  Iniciar sesión
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ingresá tu email y contraseña para continuar
                </p>
              </div>
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <Label>Email <span className="text-error-500">*</span></Label>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Contraseña <span className="text-error-500">*</span></Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Tu contraseña"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword
                        ? <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                        : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      }
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="text-sm text-gray-700 dark:text-gray-400">
                      Mantenerme conectado
                    </span>
                  </div>
                </div>
                {error && <p className="text-sm text-error-500">{error}</p>}
                <Button className="w-full !bg-green-500 !border-green-500 hover:!bg-green-400" size="sm" disabled={loading}>
                  {loading ? "Ingresando..." : "Ingresar"}
                </Button>
              </form>
              <p className="mt-6 text-sm text-center text-gray-500 dark:text-gray-400 lg:hidden">
                ¿No tienés cuenta?{" "}
                <button onClick={() => switchMode("signup")} className="text-green-500 hover:text-green-400">
                  Registrate
                </button>
              </p>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90">
                  Registrarse
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Completá tus datos para crear tu cuenta
                </p>
              </div>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre <span className="text-error-500">*</span></Label>
                    <Input
                      type="text"
                      placeholder="Tu nombre"
                      value={registerForm.nombre}
                      onChange={(e) => setRegisterForm({ ...registerForm, nombre: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Apellido <span className="text-error-500">*</span></Label>
                    <Input
                      type="text"
                      placeholder="Tu apellido"
                      value={registerForm.apellido}
                      onChange={(e) => setRegisterForm({ ...registerForm, apellido: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Email <span className="text-error-500">*</span></Label>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Teléfono <span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    placeholder="Tu teléfono"
                    value={registerForm.telefono}
                    onChange={(e) => setRegisterForm({ ...registerForm, telefono: e.target.value })}
                  />
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tu contraseña tendra este foramto!{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      APELLIDO + TELÉFONO
                    </span>
                    . Ej: <span className="font-mono">PEREZ77712345</span>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox className="mt-0.5" checked={isChecked} onChange={setIsChecked} />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Acepto los{" "}
                    <span className="text-gray-800 dark:text-white/90">Términos y Condiciones</span>
                    {" "}y la{" "}
                    <span className="text-gray-800 dark:text-white/90">Política de Privacidad</span>
                  </p>
                </div>
                {error && <p className="text-sm text-error-500">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-sm font-medium text-white rounded-lg bg-green-500 hover:bg-green-400 disabled:opacity-60 transition-colors"
                >
                  {loading ? "Registrando..." : "Crear cuenta"}
                </button>
              </form>
              <p className="mt-6 text-sm text-center text-gray-500 dark:text-gray-400 lg:hidden">
                ¿Ya tienés cuenta?{" "}
                <button onClick={() => switchMode("signin")} className="text-green-500 hover:text-green-400">
                  Iniciá sesión
                </button>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Panel verde */}
      <div className={greenClasses} style={{ background: "#1B5A26" }}>
        <GridShape />
        <div className="relative z-10 flex flex-col items-center gap-5 px-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold text-white">
              {isSignIn ? "¡Bienvenido!" : "¡Ya tienés cuenta!"}
            </h2>
            <p className="text-sm text-white/70 max-w-[200px]">
              {isSignIn
                ? "¿No tienés cuenta? Registrate y empiezá hoy."
                : "Iniciá sesión para continuar desde donde dejaste."}
            </p>
          </div>
          <button
            onClick={() => switchMode(isSignIn ? "signup" : "signin")}
            className="px-6 py-2.5 text-sm font-medium text-white rounded-lg border border-white/50 hover:bg-white/10 transition-colors"
          >
            {isSignIn ? "Registrarse" : "Iniciar sesión"}
          </button>
        </div>
      </div>

    </div>
  );
}