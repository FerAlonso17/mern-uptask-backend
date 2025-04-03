import { useForm } from "react-hook-form"
import ErrorMessage from "../../components/ErrorMessage";
import { UpdateCurrentUserPasswordForm } from "../../types";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../api/ProfileAPI";
import { toast } from "react-toastify";

export default function ChangePasswordView() {
    const initialValues: UpdateCurrentUserPasswordForm = {
        current_password: '',
        password: '',
        password_confirmation: ''
    }

    const { register, handleSubmit, watch, formState: { errors },reset } = useForm({ defaultValues: initialValues })

    const { mutate } = useMutation({
        mutationFn: changePassword,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            toast.success(data)
            reset()
        }
    })

    const password = watch('password');

    const handleChangePassword = (formData: UpdateCurrentUserPasswordForm) => mutate(formData)

    return (
        <>
            <div className="mx-auto max-w-2xl">

                <h1 className="text-3xl font-black ">Change Password</h1>
                <p className="text-xl font-light text-gray-500 mt-3">Use this form to change your password</p>

                <form
                    onSubmit={handleSubmit(handleChangePassword)}
                    className=" mt-6 space-y-5 bg-white shadow-lg p-10 rounded-lg"
                    noValidate
                >
                    <div className="mb-5 space-y-3">
                        <label
                            className="text-sm uppercase font-bold"
                            htmlFor="current_password"
                        >Password Current</label>
                        <input
                            id="current_password"
                            type="password"
                            placeholder="Password current"
                            className="w-full p-3  border border-gray-200"
                            {...register("current_password", {
                                required: "Password current required",
                            })}
                        />
                        {errors.current_password && (
                            <ErrorMessage>{errors.current_password.message}</ErrorMessage>
                        )}
                    </div>

                    <div className="mb-5 space-y-3">
                        <label
                            className="text-sm uppercase font-bold"
                            htmlFor="password"
                        >New Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="New Password"
                            className="w-full p-3  border border-gray-200"
                            {...register("password", {
                                required: "New Password required",
                                minLength: {
                                    value: 8,
                                    message: 'The password must be at least 8 characters long'
                                }
                            })}
                        />
                        {errors.password && (
                            <ErrorMessage>{errors.password.message}</ErrorMessage>
                        )}
                    </div>
                    <div className="mb-5 space-y-3">
                        <label
                            htmlFor="password_confirmation"
                            className="text-sm uppercase font-bold"
                        >Repeat Password</label>

                        <input
                            id="password_confirmation"
                            type="password"
                            placeholder="Repeat Password"
                            className="w-full p-3  border border-gray-200"
                            {...register("password_confirmation", {
                                required: "Field required",
                                validate: value => value === password || 'The passwords are not same'
                            })}
                        />
                        {errors.password_confirmation && (
                            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
                        )}
                    </div>

                    <input
                        type="submit"
                        value='Change Password'
                        className="bg-cyan-700 w-full p-3 text-white uppercase font-bold hover:bg-cyan-800 cursor-pointer transition-colors"
                    />
                </form>
            </div>
        </>
    )
}
