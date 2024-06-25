import { PrismaClient } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { DeleteIcon } from "~/common-components/svg/deleteIcon";
import { EditIcon } from "~/common-components/svg/editIcon";
import { NoteType } from "~/helpers/types";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const user = await getUser(request);
  const prisma = new PrismaClient();
  const form = await request.formData();
  const note = form.get("note")?.toString();
  if (note && user) {
    const newNote = await prisma.recipeNote.create({
      data: {
        user_id: user.id,
        body: note,
      },
    });
    return newNote;
  }
}

export const loader = async ({ request }: { request: Request }) => {
  const user = await getUser(request);

  const notes = await db.recipeNote.findMany({
    where: {
      user_id: user?.id,
    },
  });
  return { notes, user };
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

export default function RecipeNotepad() {
  const { notes, user } = useLoaderData<LoaderType>();
  const fetcher = useFetcher();
  const [recipeNote, setRecipeNote] = useState("");
  const [selectedNote, setSelectedNote] = useState<NoteType | null>(null);

  const removeNote = (note: NoteType) => {
    fetcher.submit(
      { formData: note },
      {
        method: "POST",
        action: "/removeNote",
        encType: "application/json",
      }
    );
  };

  const saveEditNote = (note: NoteType) => {
    const formData = {
      id: note.id,
      body: note.body,
    };
    fetcher.submit(
      { formData },
      { method: "POST", action: "/editNote", encType: "application/json" }
    );
  };
  const sortedNotes = notes.sort((a, b) => {
    const dateCreated1 = new Date(a.date_created);
    const dateCreated2 = new Date(b.date_created);
    return dateCreated2.getTime() - dateCreated1.getTime();
  });

  return (
    <div className="">
      <h1 className="text-center w-full text-4xl font-semibold my-4">
        Recipe Notepad
      </h1>

      <div className="lg:flex justify-center">
        <div className="lg:w-1/2 mx-8">
          <h2 className="text-xl font-medium">Notes</h2>
          <div className="w-full border-2 rounded-md">
            {sortedNotes.map((note, index) => {
              const dateCreated = new Date(note.date_created).toDateString();
              const dateUpdated = new Date(note.date_updated).toLocaleString();
              const noteSelected = selectedNote?.id === note.id;
              return (
                <div key={index}>
                  <div className="flex justify-between p-2">
                    <p className="font-medium">{dateCreated}</p>
                    <p>Last Updated: {dateUpdated}</p>
                  </div>
                  <div className={`border-b-2 flex justify-between pb-2`}>
                    <textarea
                      className={`${
                        noteSelected
                          ? "h-64 border-2 border-emerald-300 rounded-md"
                          : "h-36"
                      } w-full bg-white p-2`}
                      defaultValue={note.body}
                      disabled={!noteSelected}
                      onBlur={(e) => {
                        if (e.target.value !== note.body) {
                          const newNote = {
                            id: note.id,
                            body: e.target.value,
                            user_id: user?.id ?? "",
                          };
                          saveEditNote(newNote);
                        }
                        setSelectedNote(null);
                      }}
                    />
                    <div className="flex flex-col mx-2">
                      <button
                        className={`border-2 p-2 border-sky-400 rounded-md mb-2 ${
                          noteSelected && "bg-emerald-200"
                        }`}
                        onClick={() => setSelectedNote(note)}
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="border-2 p-2 border-red-500 rounded-md"
                        onClick={() => {
                          removeNote(note);
                        }}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:w-1/4 mx-8">
          <label className="text-xl font-medium">Add Note</label>
          <form method="POST" className="w-full">
            <textarea
              id="note"
              name="note"
              rows={24}
              cols={8}
              className=" w-full p-4 border-2 border-violet-300 rounded-md"
              value={recipeNote}
              onChange={(e) => setRecipeNote(e.target.value)}
            />
            <button
              className={`p-4 ${
                recipeNote.length
                  ? "bg-gradient-to-r from-sky-300 to-green-300 border-2 border-sky-300"
                  : "bg-gray-300"
              } rounded-md font-semibold text-xl`}
              disabled={!recipeNote.length}
              type="submit"
            >
              Save Note
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
