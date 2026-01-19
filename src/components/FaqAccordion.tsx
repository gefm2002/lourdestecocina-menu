import { useState } from "react";

const faqs = [
  {
    question: "¿Cuál es el horario de atención?",
    answer: "Lunes a sábado de 11 a 15 y de 17 a 22 hs.",
  },
  {
    question: "¿Tienen retiro en el local?",
    answer: "Sí, podés retirar por Yerbal 5, Caballito.",
  },
  {
    question: "¿Hacen envíos?",
    answer: "Consultanos por WhatsApp y te confirmamos disponibilidad.",
  },
  {
    question: "¿Qué medios de pago aceptan?",
    answer: "Consultanos por WhatsApp y te contamos las opciones.",
  },
  {
    question: "¿Las porciones son individuales?",
    answer: "Las porciones son abundantes, ideales para un almuerzo completo.",
  },
  {
    question: "¿Tienen menú veggie?",
    answer: "Sí, tenemos opciones veggie y secciones especiales.",
  },
  {
    question: "¿El menú cambia todos los días?",
    answer: "Sí, los platos del día pueden variar. Consultanos por WhatsApp.",
  },
  {
    question: "¿Hacen pedidos grandes para eventos?",
    answer: "Claro, escribinos por WhatsApp para coordinar.",
  },
];

export const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-primary">Preguntas frecuentes</h2>
        <p className="text-sm text-muted">Respondemos lo más consultado.</p>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.question} className="rounded-ui border border-black/10 bg-white">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-primary"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{faq.question}</span>
                <span className="text-lg">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-sm text-muted">{faq.answer}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
