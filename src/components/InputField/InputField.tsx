import { forwardRef, type InputHTMLAttributes } from "react";

export const InputField = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function InputField(props, ref) {
    return (
      <input ref={ref} className="bg-white px-6 py-2.5 border border-dark-green text-base rounded-lg w-full" {...props} />
    );
  }
);
