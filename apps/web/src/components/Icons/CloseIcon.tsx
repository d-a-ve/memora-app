import { IconPropsType } from "../../myTypes";

export default function CloseIcon({ width, height }: IconPropsType) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.75827 11.2426L6.0009 6M6.0009 6L11.2435 0.75736M6.0009 6L0.75827 0.75736M6.0009 6L11.2435 11.2426"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
