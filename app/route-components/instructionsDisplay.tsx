export const InstructionsDisplay = ({ instructions }) => {
  return instructions.map((step, index) => (
    <p>
      {index + 1}. {step}
    </p>
  ));
};
