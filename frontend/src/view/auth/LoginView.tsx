import { useForm } from "react-hook-form";
import { UserLoginForm } from "../../types";
import ErrorMessage from "../../components/ErrorMessage";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authenticateUser } from "../../api/AuthAPI";
import { useRef, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";

export default function LoginView() {

  const [passwordVisible, setPasswordVisible] = useState(false)
  const [iconVisible, setIconVisible] = useState(false)
  const iconRef = useRef<HTMLButtonElement | null>(null)

  const navigate = useNavigate()

  const initialValues: UserLoginForm = {
    email: '',
    password: '',
  }
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

  const { mutate } = useMutation({
    mutationFn: authenticateUser,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      navigate('/')
    }
  })

  const handleLogin = (formData: UserLoginForm) => mutate(formData)

  return (
    <>
      <h1 className="text-4xl font-black text-white">Iniciar Sesión</h1>
      <p className="text-2xl font-light text-white mt-4">
        Comienza a planear tus proyectos {''}
        <span className=" text-cyan-500 font-bold"> iniciando sesión en este formulario</span>
      </p>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-5 p-8 bg-white mt-1"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl"
          >Email</label>

          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3  border-gray-300 border"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl"
          >Password</label>

          <div
            className="relative"
            onBlur={(e) => {
              if (!iconRef.current || e.relatedTarget !== iconRef.current) {
                setIconVisible(false);
              }
            }}
          >
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password de Registro"
              className="w-full p-3  border-gray-300 border"
              onFocus={() => { setIconVisible(true) }}

              {...register("password", {
                required: "El Password es obligatorio",
                onBlur: (e) => {
                  if (!iconRef.current || e.relatedTarget !== iconRef.current) {
                    setIconVisible(false);
                  }
                }
              })}
            />
            {iconVisible && (
              <button
                ref={iconRef}
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                onClick={() => { setPasswordVisible(!passwordVisible) }}
              // onMouseDown={() => setPasswordVisible(true)}
              // onMouseUp={() => setPasswordVisible(false)}
              // onMouseLeave={() => setPasswordVisible(false)}
              >
                {passwordVisible ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value='Iniciar Sesión'
          className="bg-cyan-700 hover:bg-cyan-800 w-full p-3  text-white font-black  text-xl cursor-pointer"
        />
      </form>
      <nav className="mt-6 flex flex-col space-y-2">
        <Link
          to={'/auth/register'}
          className="text-center text-gray-300 font-normal"
        >¿No tienes cuenta? Crear Una</Link>

        <Link
          to={'/auth/forgot-password'}
          className="text-center text-gray-300 font-normal"
        >¿Olvidaste tu contraseña? Reestablecer</Link>
      </nav>
    </>
  )
}
