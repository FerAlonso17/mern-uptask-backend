import type { ConfirmToken, NewPasswordFormType } from "../../types";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { updatePasswordWithToken } from "../../api/AuthAPI";
import { toast } from "react-toastify";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { useRef, useState } from "react";


export default function NewPasswordForm({ token }: { token: ConfirmToken['token'] }) {

    const [passwordVisible, setPasswordVisible] = useState(false)
    const [iconVisible, setIconVisible] = useState(false)
    const [passwordConfirmationVisible, setPasswordConfirmationVisible] = useState(false)
    const [iconConfirmationVisible, setIconConfirmationVisible] = useState(false)
    const iconRef = useRef<HTMLButtonElement | null>(null)

    const navigate = useNavigate()
    const initialValues: NewPasswordFormType = {
        password: '',
        password_confirmation: '',
    }
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: initialValues });


    const { mutate } = useMutation({
        mutationFn: updatePasswordWithToken,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
            navigate('/auth/login')
        }
    })

    const handleNewPassword = (formData: NewPasswordFormType) => {
        const data = {
            formData,
            token
        }
        mutate(data)
    }

    const password = watch('password');

    return (
        <>
            <form
                onSubmit={handleSubmit(handleNewPassword)}
                className="space-y-5 p-8 bg-white mt-8"
                noValidate
            >

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
                                minLength: {
                                    value: 8,
                                    message: 'El Password debe ser mínimo de 8 caracteres'
                                },
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

                <div className="flex flex-col gap-5">
                    <label
                        className="font-normal text-2xl"
                    >Repetir Password</label>

                    <div
                        className="relative"
                        onBlur={(e) => {
                            if (!iconRef.current || e.relatedTarget !== iconRef.current) {
                                setIconConfirmationVisible(false);
                            }
                        }}
                    >
                        <input
                            id="password_confirmation"
                            type={passwordConfirmationVisible ? 'text' : 'password'}
                            placeholder="Repite Password de Registro"
                            className="w-full p-3  border-gray-300 border"
                            onFocus={() => { setIconConfirmationVisible(true) }}

                            {...register("password_confirmation", {
                                required: "Repetir Password es obligatorio",
                                validate: value => value === password || 'Los Passwords no son iguales',
                                onBlur: (e) => {
                                    if (!iconRef.current || e.relatedTarget !== iconRef.current) {
                                        setIconConfirmationVisible(false);
                                    }
                                }
                            })}
                        />
                        {iconConfirmationVisible && (
                            <button
                                ref={iconRef}
                                type="button"
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                                onClick={() => { setPasswordConfirmationVisible(!passwordConfirmationVisible) }}
                            >
                                {passwordConfirmationVisible ? (
                                    <EyeIcon className="h-5 w-5" />
                                ) : (
                                    <EyeSlashIcon className="h-5 w-5" />
                                )}
                            </button>
                        )}
                    </div>

                    {errors.password_confirmation && (
                        <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
                    )}
                </div>

                <input
                    type="submit"
                    value='Establecer Password'
                    className="bg-cyan-700 hover:bg-cyan-800 w-full p-3  text-white font-black  text-xl cursor-pointer"
                />
            </form>
        </>
    )
}
