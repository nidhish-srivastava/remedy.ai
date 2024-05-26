import { cn } from "../../utils/helpers";

export default function Button({
  disabled = false,
  className,
  type = "button",
  children,
  onClick,
  ...restProps
} ) {
  let defaultClassName = cn(
    `font-medium cursor-pointer bg-primary text-white ${disabled && " opacity-70 cursor-none "}`,
  );

  return (
    <button
    type={type}
      className={
      cn(defaultClassName, className)
      }
      disabled={disabled}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </button>
  );
}
