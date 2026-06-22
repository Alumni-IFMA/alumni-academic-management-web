import { forwardRef } from "react";

export const InputField = forwardRef(function InputField(props, ref) {
    return (
        <input ref={ref} className="bg-white px-6 py-4 border border-dark-green text-lg rounded-lg w-full" {...props} />
    );
});