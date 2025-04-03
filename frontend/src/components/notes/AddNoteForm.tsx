import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { NoteFormData } from "../../types";
import { useLocation, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../api/NoteAPI";
import { toast } from "react-toastify";

export default function AddNoteForm() {

    const params = useParams()
    const location = useLocation()

    const queryParams= new URLSearchParams(location.search)

    const projectId = params.projectId!
    const taskId = queryParams.get('viewTask')!

    const initialValues: NoteFormData = {
        content: ''
    }

    const {register,handleSubmit,reset,formState:{errors}} = useForm({defaultValues:initialValues})

    const queryClient = useQueryClient()
    const {mutate} = useMutation({
        mutationFn: createNote,
        onError:(error)=>{
            toast.error(error.message)
        },
        onSuccess:(data)=>{
            toast.success(data)
            queryClient.invalidateQueries({queryKey:['task', taskId]})
        }
    })

    const handleAddNote =(formData:NoteFormData)=>{
        mutate({projectId,taskId,formData})
        reset()
    }
    return (
        <form
            onSubmit={handleSubmit(handleAddNote)}
            className="space-y-3"
            noValidate
        >
            <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="content">Create Note:</label>
                <input
                    id="content"
                    type="text"
                    placeholder="Content of the note"
                    className="w-full p-3 border border-gray-300 -mt-1 mb-0.5"
                    {...register('content', {
                        required: 'Content of the note required'
                    })}
                />
                {errors.content && (
                    <ErrorMessage>{errors.content.message}</ErrorMessage>
                )}
            </div>

            <input
                type="submit"
                value='Create Note'
                className=" bg-cyan-700 hover:bg-cyan-800 w-full p-2 text-white font-black cursor-pointer"
            />
        </form>
    )
}
