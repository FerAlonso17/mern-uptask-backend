import { Task } from "../../types";
import AddNoteForm from "./AddNoteForm";
import NoteDetail from "./NoteDetail";

type NotesPanelProps = {
    notes: Task['notes']
}

export default function NotesPanel({notes}:NotesPanelProps) {
    return (
        <>
        <AddNoteForm />

        <div className="divide-y divide-gray-100 mt-7">
            {notes.length ? (
                <>
                    <p className="font-bold text-2xl text-slate-600 my-3">Notes:</p>
                    {notes.map(note => <NoteDetail key={note._id} note={note} />)}
                </>
            ) : <p className="text-gray-500 text-center pt-3">There aren't notes</p>}
        </div>

    </>
    )
}
