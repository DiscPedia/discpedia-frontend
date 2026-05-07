interface Props {
  coverAlt: string;
}

const AlbumHero = ({ coverAlt }: Props) => {
  return (
    <section className="relative w-full h-70 bg-linear-to-b from-[#DCD0F1] to-[#F4F1FA] flex items-center justify-center">
      <div className="w-37.5 h-37.5 rounded-2xl bg-[#D8C7A9] shadow-xl flex items-center justify-center">
        <div className="w-21.5 h-21.5 rounded-lg bg-white/70" aria-label={coverAlt} />
      </div>
    </section>
  );
};

export default AlbumHero;
