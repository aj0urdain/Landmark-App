// src/lib/agentsConfig.ts

export const agentsConfig = [
  { name: "Raoul Holderhead", phone: "0413 860 304" },
  { name: "Shaun Venables", phone: "0411 860 865" },
  { name: "Jamie Perlinger", phone: "0413 860 315" },
  { name: "Natalie Couper", phone: "0413 856 983" },
  { name: "Beau Coulter", phone: "0413 839 898" },
  { name: "Zomart He", phone: "0488 220 830" },
  { name: "Matthew Wright", phone: "0458 290 588" },
  { name: "Justin Kramersh", phone: "0460 349 605" },
  { name: "Rick Jacobson", phone: "0413 830 083" },
  { name: "David Napoleone", phone: "0417 308 067" },
  { name: "Sam Mercuri", phone: "0413 830 709" },
  { name: "James Bergman", phone: "0413 830 707" },
  { name: "Romanor Falconer", phone: "0413 830 808" },
  { name: "Mark Foster", phone: "0475 454 431" },
  { name: "Adam Thomas", phone: "0418 998 971" },
  { name: "Andrew Havig", phone: "0478 010 990" },
  { name: "Craig Chapman", phone: "0427 110 132" },
  { name: "Neville Smith", phone: "0400 068 205" },
  { name: "Michael Hooper", phone: "0488 332 682" },
  { name: "Tom Lawrence", phone: "0428 626 117" },
  { name: "Jack Donoghue", phone: "0450 345 554" },
  { name: "Fin Hume", phone: "0488 008 975" },
  { name: "Josh Scapolan", phone: "0484 229 829" },
  { name: "Darren Beehag", phone: "0411 226 223" },
  { name: "Yosh Mendis", phone: "0434 413 188" },
  { name: "Geoff Sinclair", phone: "0451 462 759" },
  { name: "Michael Vanstone", phone: "0403 580 528" },
  { name: "Kieran Bourke", phone: "0417 418 007" },
  { name: "Rhys Parker", phone: "0451 101 042" },
  { name: "Flynn McFall", phone: "0481 187 191" },
  { name: "John Ingui", phone: "0486 011 406" },
  { name: "Luke Easton", phone: "0472 546 001" },
  { name: "Sam Mulcahy", phone: "0499 558 968" },
  { name: "Dean Venturato", phone: "0412 840 222" },
  { name: "Graeme Watson", phone: "0419 717 171" },
  { name: "Rob Selid", phone: "0412 198 294" },
  { name: "Andrew McKerracher", phone: "0411 611 919" },
  { name: "Chris Carcione", phone: "0415 393 082" },
  { name: "Guy Randell", phone: "0430 272 999" },
  { name: "Steve Burke", phone: "0428 434 464" },
  { name: "James Baker", phone: "0421 863 040" },
  // Add more agents if needed
];

export const getAgentConfig = (name: string) => {
  return (
    agentsConfig.find((agent) => agent.name === name) || {
      name: "Unknown",
      phone: "",
    }
  );
};
