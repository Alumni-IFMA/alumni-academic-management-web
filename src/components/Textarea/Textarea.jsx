// components/Textarea/Textarea.jsx
export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`bg-white px-6 py-4 border border-dark-green text-lg rounded-lg w-full resize-none ${className}`}
      {...props}
    />
  );
}