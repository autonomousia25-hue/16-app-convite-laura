"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, CheckCircle, Ticket, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import RsvpForm from "@/components/rsvp-form";

const TICKET_STORAGE_KEY = "laura-rsvp-ticket";

export default function Home() {
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [ticketData, setTicketData] = useState<{nome: string, total: number} | null>(null);

  const mapsUrl = "https://maps.app.goo.gl/YwcbAPazK91mBJGM9";

  useEffect(() => {
    const saved = localStorage.getItem(TICKET_STORAGE_KEY);
    if (saved) {
      setTicketData(JSON.parse(saved));
    }
  }, []);

  return (
    <main className="w-full h-dvh flex flex-col relative max-w-md mx-auto shadow-2xl bg-white overflow-hidden">
      {/* Imagem do Convite como Hero — ocupa todo o espaço acima da navbar */}
      <div className="relative w-full flex-1 min-h-0 bg-[#fff5f8]">
        <Image
          src="/convite.jpg"
          alt="Convite Aniversário da Laura"
          fill
          sizes="(max-width: 448px) 100vw, 448px"
          className="object-contain"
          priority
        />
      </div>

      {/* Navbar — logo abaixo da imagem, sem espaço sobrando */}
      <div
        className="shrink-0 px-3 pt-2 bg-white/70 backdrop-blur-lg border-t border-pink-100/60 z-40"
        style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
      >
        <div className="flex gap-2">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Acessar localização"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 active:scale-95 transition-all shadow-lg shadow-pink-300"
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">Local</span>
          </a>
          <button
            onClick={() => setIsRsvpOpen(true)}
            disabled={!!ticketData}
            aria-label="Confirmar presença"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full hover:opacity-90 active:scale-95 transition-all shadow-md shadow-pink-200 disabled:opacity-40 disabled:pointer-events-none"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="text-[10px] font-bold leading-none uppercase tracking-wide">
              {ticketData ? "Confirmado" : "Confirmar"}
            </span>
          </button>
          <button
            onClick={() => setIsTicketOpen(true)}
            disabled={!ticketData}
            aria-label="Ver convite"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            <Ticket className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">Convite</span>
          </button>
        </div>
      </div>

      {/* Modal/Bottom Sheet do formulário RSVP */}
      {isRsvpOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex flex-col justify-end max-w-md mx-auto backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif text-pink-600">Confirme sua Presença</h2>
              <button 
                onClick={() => setIsRsvpOpen(false)}
                className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <RsvpForm
              onSuccess={(nome, total) => {
                const ticket = { nome, total };
                localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(ticket));
                setTicketData(ticket);
                setIsRsvpOpen(false); // fecha o form
                setIsTicketOpen(true); // abre o ingresso
              }}
            />
          </div>
        </div>
      )}

      {/* Modal do Ticket (Ingresso Vip) */}
      {isTicketOpen && ticketData && (
        <div className="fixed inset-0 bg-pink-50 z-[60] flex items-center justify-center p-6 max-w-md mx-auto animate-in zoom-in duration-500">
          <div className="bg-white w-full rounded-3xl shadow-2xl overflow-hidden border-2 border-pink-200">
            <div className="bg-gradient-to-r from-pink-400 to-pink-500 p-6 text-center text-white relative">
              <h2 className="text-3xl font-serif mb-1">Acesso VIP</h2>
              <p className="text-pink-100 font-medium tracking-widest uppercase text-xs">O 1º aninho da Laura</p>

              <button
                onClick={() => setIsTicketOpen(false)}
                className="absolute top-4 right-4 p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 flex flex-col items-center">
               <div className="w-full mb-6 pb-6 border-b border-dashed border-gray-300 text-center">
                  <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider">Convidado Principal</p>
                  <p className="text-2xl font-bold text-gray-800 leading-tight">{ticketData.nome}</p>
                  
                  <div className="mt-4 flex justify-center gap-8">
                     <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">Total</p>
                        <p className="text-lg font-semibold text-pink-600">{ticketData.total} {ticketData.total === 1 ? 'Pessoa' : 'Pessoas'}</p>
                     </div>
                     <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">Data</p>
                        <p className="text-lg font-semibold text-pink-600">08/08</p>
                     </div>
                  </div>
               </div>

               <p className="text-gray-500 text-sm mb-4 text-center">Apresente este ingresso na entrada (tire um print! 📸)</p>
               
               <div className="p-4 bg-white rounded-xl shadow-inner border border-gray-100 mb-6 flex justify-center">
                  <QRCodeSVG
                    value={mapsUrl}
                    size={150}
                    level="H"
                    marginSize={4}
                    fgColor="#000000"
                  />
               </div>

               <p className="text-xs text-center text-gray-400 italic mb-1">O QR Code dá acesso à localização do endereço do evento.</p>
               <p className="text-xs text-center text-gray-400 italic">Convite pessoal e intransferível.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
