import Index from "../../container/Index";

interface ButtonProps {
  className?: string;
  children: React.ReactNode;
  primary?: string;
  secondary?: string;
  usersecondary?: string;
  onClick?: () => void;
}

export default function Button({
  className,
  children,
  primary,
  secondary,
  usersecondary,
  onClick,
  ...otherProps
}: ButtonProps) {
  let buttonClassName = "btn";

  if (primary) {
    buttonClassName += " btn-primary";
  } else if (secondary) {
    buttonClassName += " btn-secondary";
  } else if (usersecondary) {
    buttonClassName += " btn-border-secondary";
  }

  // Append the provided className, if any
  if (className) {
    buttonClassName += ` ${className}`;
  }

  return (
    children && (
      <Index.Box className="common-btn-details">
        <Index.Button className={buttonClassName} onClick={onClick} {...otherProps}>
          {children}
        </Index.Button>
      </Index.Box>
    )
  );
}
