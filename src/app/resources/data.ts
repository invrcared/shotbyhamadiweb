export interface ResourceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  urls: string[];
}

/**
 * External resource categories.
 *
 * To add a new category:
 *   1. Add a new object to the array below.
 *   2. Give it a unique `id`, a `name`, an `icon` (emoji), a short `description`,
 *      and an array of `urls`.
 *
 * To add a destination to an existing category:
 *   1. Find the category by its `name` or `id`.
 *   2. Append the full URL string to its `urls` array.
 */
export const resourceCategories: ResourceCategory[] = [
  {
    id: "desyncub",
    name: "DesyncUB",
    icon: "⚡",
    description: "Available DesyncUB destinations",
    urls: [
      "https://ixl.lat/",
    ],
  },
  {
    id: "nebula",
    name: "Nebula",
    icon: "🌌",
    description: "Available Nebula destinations",
    urls: [
      "https://nebulaunblocking.vercel.app",
      "https://studentlearning.vercel.app",
      "https://youwannaknowwhatelseismassive.vercel.app",
      "https://a7k3m9p2xq9z1b6n4c8th2j7s5v0ldq8w1e.vercel.app",
      "https://bloooket.vercel.app",
      "https://educationalresourcesforchildren.vercel.app",
      "https://028e4fh0wi8ehvf.vercel.app",
    ],
  },
  {
    id: "hydro-network",
    name: "Hydro Network",
    icon: "💧",
    description: "Available Hydro Network destinations",
    urls: [
      "https://beige-carpet.b-cdn.net/",
      "https://status-flora.b-cdn.net/",
      "https://web.purestereo.com/",
      "https://staging.countyohio.com/",
      "https://system.pilotrights.com/",
      "https://portal.gd1code.com/",
      "https://store.mega-link.cl/",
      "https://account.dugm.net/",
      "https://about.getwellnessconnect.com/",
      "https://account.centrodiagnosticogenetico.com/",
      "https://rentcom.jorgelisbaoantunes.com.br/os",
    ],
  },
  {
    id: "fern",
    name: "Fern",
    icon: "🌿",
    description: "Available Fern destinations",
    urls: [
      "https://onelastlink.s3.amazonaws.com/index.html",
    ],
  },
  {
    id: "nexora",
    name: "Nexora",
    icon: "🔷",
    description: "Available Nexora destinations",
    urls: [
      "https://chemistry2cool.b-cdn.net/",
      "https://educationalcodinglabfork12.b-cdn.net/",
      "https://howtouselinewize.b-cdn.net/",
      "https://api-edu-toolkit.b-cdn.net/",
      "https://helpforgoguardianai.b-cdn.net/",
    ],
  },
  {
    id: "bunnies-lat",
    name: "Bunnies.lat",
    icon: "🐇",
    description: "Available Bunnies.lat destinations",
    urls: [
      "https://bunnies.lat/",
    ],
  },
  {
    id: "lucide",
    name: "Lucide",
    icon: "✦",
    description: "Available Lucide destinations",
    urls: [
      "https://iamspiderman.b-cdn.net/",
      "https://cdn.jsdelivr.net/gh/unblockedgamesupreme-cmd/svg@main/index.svg",
      "https://gcore.jsdelivr.net/gh/unblockedgamesupreme-cmd/svg@main/index.svg",
      "https://quantil.jsdelivr.net/gh/unblockedgamesupreme-cmd/svg@main/index.svg",
      "https://fastly.jsdelivr.net/gh/unblockedgamesupreme-cmd/svg@main/index.svg",
      "https://jsdelivr.b-cdn.net/gh/unblockedgamesupreme-cmd/svg@main/index.svg",
      "https://originfastly.jsdelivr.net/gh/unblockedgamesupreme-cmd/svg@main/index.svg",
      "https://gcore.jsdelivr.net/gh/lucideproxy/svg@latest/index.svg",
      "https://fastly.jsdelivr.net/gh/lucideproxy/svg@latest/index.svg",
      "https://testingcf.jsdelivr.net/gh/lucideproxy/svg@latest/index.svg",
      "https://cdn.jsdelivr.net/gh/lucideproxy/svg@latest/index.svg",
      "https://gcore.jsdelivr.net/npm/@lucideproxy/svg@latest/index.svg",
      "https://cdn.jsdelivr.net/npm/@lucideproxy/svg@latest/index.svg",
      "https://southsideent.com/",
      "https://floorheatingonline.com/",
      "https://gladiestore.com/",
      "https://thumbwickcandles.com/",
      "https://storage.googleapis.com/lucidemath/index.html",
      "https://s3.amazonaws.com/lucidetutoring/index.html",
      "https://lucidetutoring.s3.amazonaws.com/index.html",
      "https://andrewdavidsonphotography.com/",
      "https://a.caan.edu/",
      "https://cdn.jsdelivr.net/gh/lucideproxy/svg@main/index.svg",
      "https://kellycushingphotography.com/",
    ],
  },
  {
    id: "figure",
    name: "Figure",
    icon: "🎭",
    description: "Available Figure destinations",
    urls: [
      "https://figurestand.workerlo.workers.dev/",
      "https://figurecc.cine-softwares.workers.dev/",
    ],
  },
  {
    id: "opium-best",
    name: "Opium Best",
    icon: "🎯",
    description: "Available Opium Best destinations",
    urls: [
      "https://opium.best/",
    ],
  },
];
