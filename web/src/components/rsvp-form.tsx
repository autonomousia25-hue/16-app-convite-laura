"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Esquema de validação com Zod
const formSchema = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  adultos: z.number().min(1, "Pelo menos 1 adulto"),
  criancas: z.number().min(0, "A quantidade não pode ser negativa"),
});

type FormValues = z.infer<typeof formSchema>;

export default function RsvpForm({ onSuccess }: { onSuccess: (nome: string, total: number) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adultos: 1,
      criancas: 0,
    },
  });

  const adultos = watch("adultos");
  const criancas = watch("criancas");

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Falha ao confirmar presença");
      }

      // Dispara confetes! 🎉
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbcfe8', '#f472b6', '#db2777', '#fdf2f8', '#ffd700']
      });

      toast.success("Presença confirmada com sucesso!");
      
      const totalPessoas = data.adultos + data.criancas;
      onSuccess(data.nome, totalPessoas);
      
    } catch (error) {
      toast.error("Ocorreu um erro ao confirmar a presença. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIncrement = (field: "adultos" | "criancas", current: number) => {
    setValue(field, current + 1);
  };

  const handleDecrement = (field: "adultos" | "criancas", current: number, min: number) => {
    if (current > min) {
      setValue(field, current - 1);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Nome */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Convidado Principal
        </label>
        <input
          {...register("nome")}
          type="text"
          placeholder="Ex: João da Silva"
          className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-pink-50/30 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
        />
        {errors.nome && (
          <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>
        )}
      </div>

      {/* Contadores */}
      <div className="grid grid-cols-2 gap-4">
        {/* Adultos */}
        <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100 flex flex-col items-center">
          <label className="block text-sm font-medium text-gray-700 mb-3">Adultos</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleDecrement("adultos", adultos, 1)}
              className="w-8 h-8 rounded-full bg-white text-pink-600 shadow flex items-center justify-center font-bold text-lg hover:bg-pink-100"
            >
              -
            </button>
            <span className="text-xl font-semibold w-6 text-center">{adultos}</span>
            <button
              type="button"
              onClick={() => handleIncrement("adultos", adultos)}
              className="w-8 h-8 rounded-full bg-white text-pink-600 shadow flex items-center justify-center font-bold text-lg hover:bg-pink-100"
            >
              +
            </button>
          </div>
        </div>

        {/* Crianças */}
        <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100 flex flex-col items-center">
          <label className="block text-sm font-medium text-gray-700 mb-3">Crianças</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleDecrement("criancas", criancas, 0)}
              className="w-8 h-8 rounded-full bg-white text-pink-600 shadow flex items-center justify-center font-bold text-lg hover:bg-pink-100"
            >
              -
            </button>
            <span className="text-xl font-semibold w-6 text-center">{criancas}</span>
            <button
              type="button"
              onClick={() => handleIncrement("criancas", criancas)}
              className="w-8 h-8 rounded-full bg-white text-pink-600 shadow flex items-center justify-center font-bold text-lg hover:bg-pink-100"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Orientação sobre o processo de confirmação */}
      <div className="bg-pink-50/60 border border-pink-100 rounded-xl p-3">
        <p className="text-xs text-center text-gray-500">
          Ao confirmar, a presença é registrada e o botão <strong>Confirmar</strong> fica bloqueado — não é possível confirmar duas vezes pelo mesmo aparelho. Depois de confirmar, use o botão <strong>Convite</strong> na barra abaixo para ver seu QR Code sempre que precisar.
        </p>
      </div>

      {/* Aviso de convite pessoal e intransferível */}
      <p className="text-xs text-center text-gray-400 italic">
        Este convite é pessoal e intransferível.
      </p>

      {/* Botão Enviar */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-pink-200 flex items-center justify-center disabled:opacity-70 mt-4"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar Confirmação"
        )}
      </button>
    </form>
  );
}
