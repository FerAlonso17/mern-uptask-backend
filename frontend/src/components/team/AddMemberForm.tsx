import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import ErrorMessage from "../ErrorMessage";
import { TeamMemberForm } from "../../types";
import { findUserByEmail } from "../../api/TeamAPI";
import SearchResult from "./SearchResult";

export default function AddMemberForm() {
    const initialValues: TeamMemberForm = {
        email: ''
    }
    const params = useParams()
    const projectId = params.projectId!

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues })

    const mutation = useMutation({
        mutationFn: findUserByEmail
    })

    const handleSearchUser = async (formData: TeamMemberForm) => {
        const data = {projectId,formData}
        mutation.mutate(data)
    }

    const resetData =()=>{//Para reiniciar el formulario y la mutacion
        reset()
        mutation.reset()
    }

    return (
        <>

            <form
                className="mt-5 space-y-5"
                onSubmit={handleSubmit(handleSearchUser)}
                noValidate
            >

                <div className="flex flex-col gap-2">
                    <label
                        className="font-normal text-md"
                        htmlFor="name"
                    >User email:</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Email of the user to add"
                        className="w-full p-3 -mt-2 border-gray-300 border"
                        {...register("email", {
                            required: "Email required",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Email no valid",
                            },
                        })}
                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>

                <input
                    type="submit"
                    className=" bg-cyan-700 hover:bg-cyan-800 w-full p-1.5 -mt-1.5 text-white font-black text-lg cursor-pointer"
                    value='Search user'
                />
            </form>
            <div className="mt-10">
                {mutation.isPending && <p className="text-center">Loading...</p>}
                {mutation.error && <p className="text-center">{mutation.error.message}</p>}
                {mutation.data && <SearchResult user={mutation.data} reset={resetData}/>}
            </div>
        </>
    )
}