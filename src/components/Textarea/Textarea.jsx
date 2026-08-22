// components/Textarea/Textarea.jsx
import { forwardRef } from "react";

export const Textarea = forwardRef(function Textarea({ className = "", ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={`bg-white px-6 py-4 border border-dark-green text-lg rounded-lg w-full resize-none ${className}`}
      {...props}
    />
  );
});