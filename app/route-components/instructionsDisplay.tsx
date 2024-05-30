import { Dispatch, SetStateAction } from "react";

type InstructionsDisplayProps = {
  instructions: string[];
  editMode: boolean;
  setInstructions: Dispatch<SetStateAction<string[]>>;
  updateInstructions: () => void;
};

export const InstructionsDisplay = ({
  instructions,
  editMode,
  setInstructions,
  updateInstructions,
}: InstructionsDisplayProps) => {
  return instructions.map((step, index) => {
    if (!editMode) {
      return (
        <div
          className="mb-4 border-2 border-fuchsia-200 rounded-md p-8"
          key={index}
        >
          <span className="font-semibold text-xl">{index + 1}. </span>
          <span className="text-lg">{step}</span>
        </div>
      );
    } else {
      return (
        <div className="m-2 flex w-full" key={index}>
          <span className="text-xl mr-4 mt-2 font-semibold">{index + 1}.</span>
          <span className="w-full">
            <textarea
              value={step}
              onChange={(e) => {
                instructions.splice(index, 1, e.target.value);
                setInstructions([...instructions]);
              }}
              className="border-2 p-2 border-blue-400 rounded-md w-full mt-2"
              rows={5}
              onBlur={(e) => {
                instructions.splice(index, 1, e.target.value);
              }}
            />
          </span>
          <span className="flex items-center ml-4">
            <button
              className=""
              onClick={() => {
                instructions.splice(index, 1);
                updateInstructions();
              }}
            >
              remove
            </button>
          </span>
        </div>
      );
    }
  });
};
