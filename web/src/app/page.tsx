"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, CheckCircle, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import RsvpForm from "@/components/rsvp-form";

export default function Home() {
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [ticketData, setTicketData] = useState<{nome: string, total: number} | null>(null);

  const mapsUrl = "https://maps.app.goo.gl/YwcbAPazK91mBJGM9";

  return (
    <main className="min-h-screen relative pb-24 max-w-md mx-auto shadow-2xl bg-white overflow-hidden">
      {/* Imagem do Convite como Hero */}
      <div className="relative w-full aspect-[2/3]">
        <Image
          src="/convite.jpg"
          alt="Convite Aniversário da Laura"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Espaço em branco no final */}
      <div className="h-8"></div>

      {/* Navbar Fixa no Rodapé */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-pink-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 max-w-md mx-auto">
        <div className="flex gap-3">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center py-3 px-2 bg-pink-50 text-pink-700 rounded-2xl hover:bg-pink-100 transition-colors"
          >
            <MapPin className="w-5 h-5 mb-1" />
            <span className="text-xs font-semibold uppercase tracking-wider text-center">Local</span>
          </a>
          <button
            onClick={() => setIsRsvpOpen(true)}
            className="flex-[2] flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-pink-200"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Confirmar</span>
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
                setTicketData({nome, total});
                setIsRsvpOpen(false); // fecha o form
              }} 
            />
          </div>
        </div>
      )}

      {/* Modal do Ticket (Ingresso Vip) */}
      {ticketData && (
        <div className="fixed inset-0 bg-pink-50 z-[60] flex items-center justify-center p-6 max-w-md mx-auto animate-in zoom-in duration-500">
          <div className="bg-white w-full rounded-3xl shadow-2xl overflow-hidden border-2 border-pink-200">
            <div className="bg-gradient-to-r from-pink-400 to-pink-500 p-6 text-center text-white relative">
              <h2 className="text-3xl font-serif mb-1">Acesso VIP</h2>
              <p className="text-pink-100 font-medium tracking-widest uppercase text-xs">O 1º aninho da Laura</p>
              
              <button 
                onClick={() => setTicketData(null)}
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
                    fgColor="#db2777" // pink-600
                  />
               </div>

               <p className="text-xs text-center text-gray-400 italic">O QR Code aponta para o endereço do evento.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
