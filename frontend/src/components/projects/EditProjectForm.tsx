import { Link, useNavigate } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import { Project, ProjectFormData } from "../../types";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "../../api/ProjectAPI";
import { toast } from "react-toastify";

type EditProjectFormProps = {
    data: ProjectFormData
    projectId: Project['_id']
}

export default function EditProjectForm({data, projectId} : EditProjectFormProps) {

    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: {
        projectName: data.projectName,
        clientName: data.clientName,
        description: data.description,
    }})

    const queryClient = useQueryClient()
    const {mutate} = useMutation({
        mutationFn: updateProject,
        onError: (error)=>{
            toast.error(error.message)
        },
        onSuccess:(data)=>{
            queryClient.invalidateQueries({queryKey:['projects']})
            queryClient.invalidateQueries({queryKey:['editProject',projectId]})
            toast.success(data)
            navigate('/')
        }
    })

    const handleForm =(formData:ProjectFormData)=>{
        const data = {
            formData,
            projectId
        }
        mutate(data)
    }

    return (
        <>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-black">Edit Project</h1>
                <p className="text-xl font-light text-gray-500 mt-3">Fill out the following form to edit the project</p>

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
                        value='Save changes'
                        className=" bg-cyan-700 hover:bg-cyan-800 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
                    />
                </form>
            </div>
        </>
    )
}
