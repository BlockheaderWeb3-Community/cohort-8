import type { JSX } from "react";
interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({
  message,
}: ErrorMessageProps): JSX.Element {
  return <div className="py-4 text-center text-red-500">{message}</div>;
}
