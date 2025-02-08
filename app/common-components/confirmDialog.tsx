import { Fetcher } from "@remix-run/react";
import { SetStateAction } from "react";
import { InventoryType } from "~/helpers/types";
import { LoadingSpinner } from "./loadingSpinner";

type ConfirmDialogProps = {
  removeItem: (item: InventoryType, addingToShoppingList: boolean) => void;
  selectedItem: InventoryType;
  setOpenModal: React.Dispatch<SetStateAction<boolean>>;
};

export const ConfirmDialog = ({
  removeItem,
  selectedItem,
  setOpenModal,
}: ConfirmDialogProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 confirm-dialog backdrop-blur">
      <div className="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
        <div className="bg-white rounded-lg md:max-w-fit md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative shadow-lg">
          <div className="md:flex items-center">
            <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
              <p className="font-medium mt-2">
                Would you like to add{" "}
                <span className="text-emerald-700">{selectedItem.item}</span> to
                the shopping list?
              </p>
            </div>
          </div>
          <div className="text-center mt-4 md:flex">
            <button
              id="confirm-delete-btn"
              className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-fuchsia-200 text-fuchsia-700 rounded-lg font-semibold text-sm md:ml-2"
              onClick={() => {
                setOpenModal(false);
                removeItem(selectedItem, true);
              }}
            >
              Yes, add to shopping list.
            </button>
            <button
              id="confirm-delete-btn"
              className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-cyan-200 text-cyan-700 rounded-lg font-semibold text-sm mt-4 md:mt-0 md:ml-2"
              onClick={() => {
                setOpenModal(false);
                removeItem(selectedItem, false);
              }}
            >
              No, just remove from inventory.
            </button>
            <button
              id="confirm-cancel-btn"
              className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4 md:mt-0 md:ml-2"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
