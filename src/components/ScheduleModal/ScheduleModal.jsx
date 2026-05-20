// components/ScheduleModal/ScheduleModal.jsx
import { X, CalendarCheck } from "lucide-react";
import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";
import { ptBR } from "@daypicker/react/locale";
import "./ScheduleModal.css";

export function ScheduleModal({
  isOpen,
  onClose,
  onConfirm,
  selectedDate,
  onSelectDate,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-4 min-w-[450px]">
        <div className="flex items-center justify-between w-full">
          <span className="font-semibold text-dark-green text-lg">
            Agendar publicação
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          disabled={{ before: new Date() }}
          navLayout="around"
          animate
          locale={ptBR}
          classNames={{
            today: `font-bold`,
            selected: `bg-green border-green-500 text-white rounded-full`,
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
          className="w-full bg-green text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Confirmar agendamento
        </button>
      </div>
    </div>
  );
}
