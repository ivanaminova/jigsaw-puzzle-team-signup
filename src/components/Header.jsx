function Header() {
  return (
    <div className="flex flex-row font-bold justify-center m-12">
      <img className="absolute top-0 left-1 h-40 w-40 items-start" src="./vibes-co-logo.png" />
      <div className="flex flex-row items-center gap-3 text-4xl text-center">
        <p>We are </p>
        <img className="h-6" src="./HPE_logo_blk_pos_rgb.png" />
        <p>Day: Jigsaw Puzzle Team Sign-Up</p>
      </div>
    </div>
  );
}

export default Header;
