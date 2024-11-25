import { cn } from "@/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const Logo = ({ className, ...props }: LogoProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-white", className)}
      {...props}
    >
      <path
        d="M25.3333 10.6667C27.5425 10.6667 29.3333 8.87589 29.3333 6.66667C29.3333 4.45744 27.5425 2.66667 25.3333 2.66667C23.1241 2.66667 21.3333 4.45744 21.3333 6.66667C21.3333 8.87589 23.1241 10.6667 25.3333 10.6667Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.6667 2.66667H12C8.68629 2.66667 6 5.35296 6 8.66667V24C6 27.3137 8.68629 30 12 30H20C23.3137 30 26 27.3137 26 24V17.3333"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 12V20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 16H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
