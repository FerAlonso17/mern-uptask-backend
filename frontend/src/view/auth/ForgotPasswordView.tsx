import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ForgotPasswordForm } from "../../types";
import ErrorMessage from "../../components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { forgotPassword } from "../../api/AuthAPI";

export default function ForgotPasswordView() {

    const initialValues: ForgotPasswordForm = {
        email: ''
    }
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: forgotPassword,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
        }
    })

    const handleForgotPassword = (formData: ForgotPasswordForm) => mutate(formData)


    return (
        <>
            <h1 className="text-4xl font-black text-white">Reestablecer Password</h1>
            <p className="text-2xl font-light text-white mt-4">
                ¿Olvidaste tu password? coloca tu email {''}
                <span className=" text-cyan-500 font-bold"> y reestable tu password</span>
            </p>

            <form
                onSubmit={handleSubmit(handleForgotPassword)}
                className="space-y-5 p-8 mt-3 bg-white"
                noValidate
            >
                <div className="flex flex-col gap-5">
                    <label
                        className="font-normal text-2xl"
                        htmlFor="email"
                    >Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email de Registro"
                        className="w-full p-3  border-gray-300 border"
                        {...register("email", {
                            required: "El Email de registro es obligatorio",
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

                <input
                    type="submit"
                    value='Enviar Instrucciones'
                    className="bg-cyan-700 hover:bg-cyan-800 w-full p-3  text-white font-black  text-xl cursor-pointer"
                />
            </form>

            <nav className="mt-6 flex flex-col space-y-2">
                <Link
                    to='/auth/login'
                    className="text-center text-gray-300 font-normal"
                >
                    ¿Ya tienes cuenta? Iniciar Sesión
                </Link>

                <Link
                    to='/auth/register'
                    className="text-center text-gray-300 font-normal"
                >
                    ¿No tienes cuenta? Crea una
                </Link>
            </nav>
        </>
    )
}
