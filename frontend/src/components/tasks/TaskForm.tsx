import { FieldErrors, UseFormRegister } from "react-hook-form"
import ErrorMessage from "../ErrorMessage";
import { TaskFormData } from "../../types";

type TaskFormProps = {
    errors: FieldErrors<TaskFormData>
    register: UseFormRegister<TaskFormData>
}

export default function TaskForm({errors, register} : TaskFormProps) {
    return (
        <>
            <div className="flex flex-col gap-0.5">
                <label
                    className="font-normal text-lg "
                    htmlFor="name"
                >Name of task:</label>
                <input
                    id="name"
                    type="text"
                    placeholder="Name of task"
                    className="w-full p-3  border-gray-300 border"
                    {...register("name", {
                        required: "Field required",
                    })}
                />
                {errors.name && (
                    <ErrorMessage>{errors.name.message}</ErrorMessage>
                )}
            </div>

            <div className="flex flex-col gap-0.5">
                <label
                    className="font-normal text-lg"
                    htmlFor="description"
                >Description of task:</label>
                <textarea
                    id="description"
                    placeholder="Description of task"
                    className="w-full p-3  border-gray-300 border"
                    {...register("description", {
                        required: "Field required"
                    })}
                />
                {errors.description && (
                    <ErrorMessage>{errors.description.message}</ErrorMessage>
                )}
            </div>
        </>
    )
}
