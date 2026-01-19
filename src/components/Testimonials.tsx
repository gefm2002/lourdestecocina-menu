const testimonials = [
  {
    quote: "La comida llega caliente y con porciones generosas. Se nota lo casero.",
    name: "Paula G.",
  },
  {
    quote: "El menú del día siempre salva. Pastel de papa y ensaladas top.",
    name: "Rodrigo M.",
  },
  {
    quote: "La atención por WhatsApp es rápida y clara, súper recomendado.",
    name: "Luz F.",
  },
  {
    quote: "Las tartas son riquísimas y están bien rellenas.",
    name: "Nico A.",
  },
  {
    quote: "Todo prolijo, buen precio y sabor de cocina de barrio.",
    name: "Carla S.",
  },
  {
    quote: "Pedí veggie y me encantó. Fresco y abundante.",
    name: "Marina D.",
  },
];

export const Testimonials = () => {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-primary">Lo que dicen quienes piden</h2>
        <p className="text-sm text-muted">Opiniones reales de vecinos de Caballito.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item) => (
          <div key={item.quote} className="rounded-ui border border-black/10 bg-white p-4">
            <p className="text-sm text-primary">“{item.quote}”</p>
            <p className="mt-3 text-xs font-semibold text-muted">{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
