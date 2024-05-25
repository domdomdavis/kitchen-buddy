type InstructionsDisplayProps = {
  instructions: string[] | undefined;
};

export const InstructionsDisplay = ({
  instructions,
}: InstructionsDisplayProps) => {
  return instructions?.map((step, index) => (
    <div className="" key={index}>
      <span className="font-semibold text-xl">{index + 1}. </span>
      <span className="text-lg">{step}</span>
    </div>
  ));
};
