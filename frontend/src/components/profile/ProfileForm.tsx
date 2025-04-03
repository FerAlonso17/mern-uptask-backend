import { useForm } from "react-hook-form"
import ErrorMessage from "../ErrorMessage"
import { User, UserProfileForm } from "../../types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProfile } from "../../api/ProfileAPI"
import { toast } from "react-toastify"

type ProfileFormProps = {
    data:User
}
export default function ProfileForm({ data }: ProfileFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<UserProfileForm>({ defaultValues: data })

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: updateProfile,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['user']})
        } 
    })

    const handleEditProfile = (formData: UserProfileForm) => mutate(formData)

    return (
        <>
            <div className="mx-auto max-w-2xl g">
                <h1 className="text-3xl font-black ">My profile</h1>
                <p className="text-xl font-light text-gray-500 mt-3">Here you can update your information</p>

                <form
                    onSubmit={handleSubmit(handleEditProfile)}
                    className=" mt-6 space-y-5 bg-white shadow-lg p-10 rounded-l"
                    noValidate
                >
                    <div className="mb-5 space-y-3">
                        <label
                            className="text-sm uppercase font-bold"
                            htmlFor="name"
                        >Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Your name"
                            className="w-full p-3  border border-gray-200"
                            {...register("name", {
                                required: "Name required",
                            })}
                        />
                        {errors.name && (
                            <ErrorMessage>{errors.name.message}</ErrorMessage>
                        )}
                    </div>

                    <div className="mb-5 space-y-3">
                        <label
                            className="text-sm uppercase font-bold"
                            htmlFor="password"
                        >E-mail</label>
                        <input
                            id="text"
                            type="email"
                            placeholder="Your Email"
                            className="w-full p-3  border border-gray-200"
                            {...register("email", {
                                required: "E-mail required",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "E-mail no valid",
                                },
                            })}
                        />
                        {errors.email && (
                            <ErrorMessage>{errors.email.message}</ErrorMessage>
                        )}
                    </div>
                    <input
                        type="submit"
                        value='Save changes'
                        className="bg-cyan-700 w-full p-3 text-white uppercase font-bold hover:bg-cyan-800 cursor-pointer transition-colors"
                    />
                </form>
            </div>
        </>
    )
}
