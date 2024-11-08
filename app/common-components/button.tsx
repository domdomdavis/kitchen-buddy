type ButtonProps = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
};
export const Button = ({ text, onClick, disabled }: ButtonProps) => {
  return (
    <button
      className={`p-2 border-2 rounded-md mt-2 font-medium ${
        disabled ? "border-gray-300" : "border-green-300"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
