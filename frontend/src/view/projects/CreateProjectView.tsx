import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ProjectFormData } from "../../types";
import { createProject } from "../../api/ProjectAPI";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import ProjectForm from "../../components/projects/ProjectForm";


export default function CreateProjectView() {

    const navigate = useNavigate()
    const initialValues: ProjectFormData = {
        projectName: '',
        clientName: '',
        description: '',
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const { mutate } = useMutation({
        mutationFn: createProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            navigate('/')
        }
    })
    const handleForm = async (formData: ProjectFormData) => mutate(formData)

    return (
        <>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-black">Create project</h1>
                <p className="text-xl font-light text-gray-500 mt-3">Fill out the following form to create a project</p>

                <nav className="my-5 ">
                    <Link
                        className=" bg-cyan-600 hover:bg-cyan-700 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                        to='/'
                    >Return to projects</Link>
                </nav>

                <form
                    className="mt-6 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate //para que no realize accion de html
                >
                    <ProjectForm
                        register={register}
                        errors={errors}
                    />
                    <input
                        type="submit"
                        value='Create project'
                        className=" bg-cyan-700 hover:bg-cyan-800 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
                    />
                </form>
            </div>
        </>
    )
}
