export const site = {
  name: "The Long Island Cleanout Company",
  tagline: "We clean it out. You move forward.",
  email: "longislandcleanoutcompany@gmail.com",
  phoneDisplay: "(631) 923-6641",
  phoneHref: "tel:+16319236641",
  smsHref: "sms:+16319236641",
  serviceArea: "Nassau and Suffolk County, NY",
  cityState: "Long Island, NY",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/quote", label: "Quote" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact#contact-details", label: "Contact" },
];

export const services = [
  {
    id: "junk-removal",
    icon: "01",
    title: "Junk Removal",
    description: "Appliances, furniture, renovation debris, garage clutter, and one-off pickups.",
    bullets: ["Residential and light commercial", "Fast same-day estimates", "Photo-based quoting"],
  },
  {
    id: "property-cleanouts",
    icon: "02",
    title: "Property Cleanouts",
    description: "Basements, attics, estates, rental turnovers, evictions, and pre-sale cleanouts.",
    bullets: ["Sequential 3-step workflow", "Organized crew handling", "Detailed status tracking"],
  },
  {
    id: "hauling",
    icon: "03",
    title: "Hauling",
    description: "Need something moved off-site or hauled away? We keep the lift, load, and disposal simple.",
    bullets: ["Bulky items and bulk loads", "Clean finish and sweep-up", "Upfront communication"],
  },
];

export const steps = [
  {
    num: 1,
    title: "Request",
    description: "Submit the form with your address, service type, preferred date, and photos.",
  },
  {
    num: 2,
    title: "Quote",
    description: "Review a clear estimate with notes, timing, and next steps before the crew rolls.",
  },
  {
    num: 3,
    title: "Complete",
    description: "The team hauls, cleans, and closes the job out with an easy payment handoff.",
  },
];

export const galleryCards = [
  {
    title: "Garage cleanout",
    description: "A packed wood-paneled garage cleared down to open, usable floor.",
    image: "/assets/gallery/garage-cleanout.png",
  },
  {
    title: "Carport & patio cleanout",
    description: "Old furniture, coolers, and clutter hauled off for a clean, open carport.",
    image: "/assets/gallery/carport-cleanout.png",
  },
  {
    title: "Side yard cleanout",
    description: "A junk-filled walkway reopened end to end in a single visit.",
    image: "/assets/gallery/side-yard-cleanout.png",
  },
  {
    title: "Garage & storage cleanout",
    description: "Bins, tools, and stacked boxes removed for a fully reset garage.",
    image: "/assets/gallery/garage-storage-cleanout.png",
  },
];

export const testimonials = [
  "Showed up on time, communicated clearly, and left the place spotless.",
  "The quote process was simple and the crew handled a tough cleanout with care.",
  "Exactly the kind of local service that makes a stressful day easier.",
];

export const servicePills = ["Nassau County", "Suffolk County", "Home cleanouts", "Rental turnovers"];

export const adminSeedLeads = [
  {
    id: "LC-1042",
    createdAt: "2026-08-11T12:00:00.000Z",
    name: "Maria R.",
    phone: "(516) 555-0142",
    email: "maria@example.com",
    address: "Hempstead, NY",
    serviceType: "Property Cleanout",
    preferredDate: "2026-08-15",
    notes: "Basement and garage cleanout.",
    photoCount: 2,
    status: "new",
  },
  {
    id: "LC-1041",
    createdAt: "2026-08-10T12:00:00.000Z",
    name: "James K.",
    phone: "(631) 555-0199",
    email: "james@example.com",
    address: "Patchogue, NY",
    serviceType: "Junk Removal",
    preferredDate: "2026-08-13",
    notes: "Couch, mattress, and appliances.",
    photoCount: 3,
    status: "quoted",
  },
];

export const invoices = [
  {
    id: "INV-2001",
    leadId: "LC-1041",
    total: 640,
    status: "unpaid",
    paymentLinkUrl: "#",
    lineItems: [
      { description: "2-man junk removal crew", amount: 420 },
      { description: "Disposal fee", amount: 120 },
      { description: "Mileage", amount: 100 },
    ],
  },
];
