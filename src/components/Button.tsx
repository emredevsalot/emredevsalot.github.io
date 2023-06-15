type ButtonProps = {
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  width?: "w-fit" | "w-full";
};

const Button = ({ children, onClick, width = "w-fit" }: ButtonProps) => {
  return (
    <button
      className={`rounded px-4 py-2 text-primary outline outline-primary transition-transform enabled:hover:scale-105 ${width}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
