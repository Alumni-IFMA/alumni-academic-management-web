// components/ScheduleModal/ScheduleModal.jsx
import { X, CalendarCheck } from "lucide-react";
import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";

export function ScheduleModal({ isOpen, onClose, onConfirm, selectedDate, onSelectDate }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-4 min-w-[340px]">
        <div className="flex items-center justify-between w-full">
          <span className="font-semibold text-dark-green text-lg">Agendar publicação</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          disabled={{ before: new Date() }}
          classNames={{
            root: "font-poppins",
            months: "flex flex-col",
            month: "space-y-3",
            caption: "flex justify-center items-center relative",
            caption_label: "text-dark-green font-semibold text-base capitalize",
            nav: "flex items-center gap-2",
            nav_button: "text-dark-green hover:opacity-70 transition-opacity cursor-pointer",
            nav_button_previous: "absolute left-0",
            nav_button_next: "absolute right-0",
            table: "w-full border-collapse",
            head_row: "flex",
            head_cell: "text-gray-400 text-xs font-medium w-9 text-center",
            row: "flex w-full mt-1",
            cell: "w-9 h-9 text-center text-sm relative",
            day: "w-9 h-9 rounded-full hover:bg-gray-100 transition-colors cursor-pointer font-medium",
            day_selected: "bg-dark-green text-white hover:bg-dark-green rounded-full",
            day_today: "text-blue-500 font-bold",
            day_disabled: "text-gray-300 cursor-not-allowed hover:bg-transparent",
            day_outside: "text-gray-300",
          }}
        />

        {selectedDate && (
          <div className="flex items-center gap-2 text-sm text-dark-green font-medium bg-green-50 px-4 py-2 rounded-lg w-full justify-center">
            <CalendarCheck size={16} />
            <span>
              Publicar em{" "}
              {selectedDate.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        )}

        <button
          onClick={onConfirm}
          disabled={!selectedDate}
          className="w-full bg-dark-green text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Confirmar agendamento
        </button>
      </div>
    </div>
  );
}