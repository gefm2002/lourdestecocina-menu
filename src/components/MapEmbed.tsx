type MapEmbedProps = {
  query: string;
};

export const MapEmbed = ({ query }: MapEmbedProps) => {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  return (
    <div className="overflow-hidden rounded-ui border border-black/10">
      <iframe
        title="Mapa Manducar"
        src={src}
        className="h-72 w-full"
        loading="lazy"
      />
    </div>
  );
};
