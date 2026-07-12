import { Product, Review } from "./types";

/* ============================================================
   CONFIGURAÇÃO RÁPIDA — LINKS DE CHECKOUT
   ============================================================
   Cada KIT tem seu próprio checkoutUrl. Cole o caminho do link
   que você criar no Shark Bot (só o final, ex: "/c/cortador-2un").
   Ele carrega DENTRO do site, via proxy (vite.config.ts em dev,
   server.prod.js em produção) — a cliente nunca sai da página.

   Kit sem link ainda → deixa "" que ele usa o checkoutUrl do
   produto como reserva.
   ============================================================ */
export const CONFIG = {
  LOJA: "Dona Encanta",
  SLOGAN: "Praticidade que apaixona",
};

export const HERO_PRODUCT: Product = {
  id: "cortador-12-em-1",
  name: "Cortador de Legumes Multifuncional 12 em 1",
  shortName: "Cortador 12 em 1",
  tagline: "Pique a cebola inteira SEM CHORAR, rale, fatie e corte em cubos em segundos — tudo cai direto no pote, sem sujar a bancada.",
  price: 79.9,
  originalPrice: 159.8,
  rating: 4.9,
  reviewsCount: 3412,
  badge: "ESCOLHA Nº1 DAS DONAS DE CASA",
  bullets: [
    "12 lâminas de aço inox: cubos, tiras, fatias, ralado fino e grosso",
    "Adeus lágrimas: pica a cebola inteira em 1 aperto, sem contato",
    "Pote coletor de 1,5L: corta e já guarda, bancada sempre limpa",
    "Protetor de dedos incluso — segurança total para usar todo dia",
    "Bônus: separador de gema e clara + escorredor embutido",
  ],
  images: [
    "/fotos/cortador-1.jpg",
    "/fotos/cortador-2.jpg",
    "/fotos/cortador-4.jpg",
    "/fotos/cortador-7.jpg",
    "/fotos/cortador-6.jpg",
    "/fotos/cortador-5.jpg",
    "/fotos/cortador-3.jpg",
  ],
  kits: [
    { id: "kit1", label: "1 unidade", qty: 1, price: 79.9, checkoutUrl: "/c/cortador-1un" },
    { id: "kit2", label: "2 unidades", sub: "1 sua + 1 para presentear", qty: 2, price: 129.9, badge: "MAIS ESCOLHIDO • ECONOMIZE R$ 30", checkoutUrl: "/c/cortador-2un" },
    { id: "kit3", label: "3 unidades", sub: "preço de atacado", qty: 3, price: 169.9, badge: "MELHOR PREÇO", checkoutUrl: "/c/cortador-3un" },
  ],
  checkoutUrl: "/c/cortador-1un",
};

export const PRODUCTS: Product[] = [
  {
    id: "organizador-giratorio",
    name: "Organizador Giratório 360° de Temperos",
    shortName: "Organizador Giratório 360°",
    tagline: "Todos os temperos na mão com um giro — sem revirar o armário.",
    price: 59.9,
    originalPrice: 119.8,
    rating: 4.8,
    reviewsCount: 1218,
    badge: "QUERIDINHO DA ORGANIZAÇÃO",
    bullets: [
      "Gira 360° suave — acha qualquer tempero em 2 segundos",
      "Acrílico cristal resistente, borda alta anti-queda",
      "Cabe no armário, bancada, geladeira e até banheiro",
    ],
    images: ["/fotos/organizador-1.jpg", "/fotos/organizador-2.jpg", "/fotos/organizador-3.jpg"],
    kits: [
      { id: "kit1", label: "1 unidade", qty: 1, price: 59.9, checkoutUrl: "/c/organizador-1un" },
      { id: "kit2", label: "2 unidades", sub: "armário + bancada", qty: 2, price: 99.9, badge: "ECONOMIZE R$ 20", checkoutUrl: "/c/organizador-2un" },
    ],
    checkoutUrl: "/c/organizador-1un",
  },
  {
    id: "potes-hermeticos",
    name: "Kit 5 Potes Herméticos de Vidro com Tampa de Bambu",
    shortName: "Kit 5 Potes Herméticos",
    tagline: "Despensa de revista e mantimentos frescos por 3x mais tempo.",
    price: 99.9,
    originalPrice: 199.8,
    rating: 4.9,
    reviewsCount: 2295,
    badge: "FAVORITO DA DESPENSA",
    bullets: [
      "Vedação 100% hermética — nada de carunchos ou umidade",
      "Vidro grosso + bambu ecológico: lindos fora do armário",
      "Empilháveis: dobram o espaço da sua prateleira",
    ],
    images: ["/fotos/potes-1.jpg", "/fotos/potes-2.jpg", "/fotos/potes-3.jpg"],
    kits: [
      { id: "kit1", label: "Kit 5 peças", qty: 1, price: 99.9, checkoutUrl: "/c/potes-5p-s" },
      { id: "kit2", label: "2 kits (10 peças)", sub: "despensa completa", qty: 2, price: 169.9, badge: "ECONOMIZE R$ 30", checkoutUrl: "/c/potes-10p-s" },
    ],
    checkoutUrl: "/c/potes-5p-s",
  },
  {
    id: "escorredor-retratil",
    name: "Escorredor Retrátil sobre a Pia em Inox",
    shortName: "Escorredor Retrátil",
    tagline: "Escorre louça, legumes e massas EM CIMA da pia — e some quando você guarda.",
    price: 69.9,
    originalPrice: 139.8,
    rating: 4.8,
    reviewsCount: 1156,
    badge: "SUCESSO DE VENDAS",
    bullets: [
      "Ajustável: serve em praticamente qualquer pia",
      "Inox reforçado: aguenta até 10kg sem vergar",
      "Pontas de silicone: não risca e não enferruja",
    ],
    images: ["/fotos/escorredor-1.jpg", "/fotos/escorredor-2.jpg", "/fotos/escorredor-3.jpg"],
    kits: [
      { id: "kit1", label: "1 unidade", qty: 1, price: 69.9, checkoutUrl: "/c/escorredor-1un" },
      { id: "kit2", label: "2 unidades", qty: 2, price: 119.9, badge: "ECONOMIZE R$ 20", checkoutUrl: "/c/escorredor-2un" },
    ],
    checkoutUrl: "/c/escorredor-1un",
  },
  {
    id: "mini-processador",
    name: "Mini Processador Elétrico Portátil USB",
    shortName: "Mini Processador USB",
    tagline: "Alho, cebola e temperos triturados em 5 segundos — sem cheiro na mão.",
    price: 49.9,
    originalPrice: 99.8,
    rating: 4.7,
    reviewsCount: 1524,
    badge: "SUCESSO VIRAL",
    bullets: [
      "1 clique e pronto: tritura em 5 segundos",
      "Recarrega no USB — mais de 40 usos por carga",
      "Mãos sem cheiro de alho nunca mais",
    ],
    images: ["/fotos/processador-1.jpg", "/fotos/processador-2.jpg", "/fotos/processador-3.jpg"],
    kits: [
      { id: "kit1", label: "1 unidade", qty: 1, price: 49.9, checkoutUrl: "/c/processador-1un" },
      { id: "kit2", label: "2 unidades", sub: "1 para dar de presente", qty: 2, price: 84.9, badge: "ECONOMIZE R$ 15", checkoutUrl: "/c/processador-2un" },
    ],
    checkoutUrl: "/c/processador-1un",
  },
];

export const ALL_PRODUCTS = [HERO_PRODUCT, ...PRODUCTS];

export const REVIEWS: Review[] = [
  {
    id: "r1",
    userName: "Helena Oliveira",
    city: "São Paulo/SP",
    rating: 5,
    comment: "Gente, que MARAVILHA! Pico toda a comida da semana em 15 minutos. Não choro mais com cebola e minha bancada fica limpa. Melhor compra do ano!",
    productName: "Cortador 12 em 1",
    date: "há 2 dias",
    verified: true,
  },
  {
    id: "r2",
    userName: "Sandra Regina",
    city: "Belo Horizonte/MG",
    rating: 5,
    comment: "Chegou em 5 dias, muito bem embalado. As lâminas são afiadas de verdade e o pote é grande. Já comprei outro pra minha mãe!",
    productName: "Cortador 12 em 1",
    date: "há 4 dias",
    verified: true,
  },
  {
    id: "r3",
    userName: "Maria Amélia",
    city: "Curitiba/PR",
    rating: 5,
    comment: "Os potes herméticos são lindos demais, minha despensa parece de revista. Vedação perfeita, nada de umidade no arroz.",
    productName: "Kit 5 Potes Herméticos",
    date: "há 1 semana",
    verified: true,
  },
  {
    id: "r4",
    userName: "Beatriz Lemos",
    city: "Rio de Janeiro/RJ",
    rating: 5,
    comment: "O organizador giratório mudou meu armário! Achava que era frescura, hoje não vivo sem. Super firme e bonito.",
    productName: "Organizador Giratório 360°",
    date: "há 1 semana",
    verified: true,
  },
  {
    id: "r5",
    userName: "Cláudia Ferreira",
    city: "Salvador/BA",
    rating: 5,
    comment: "Uso o mini processador todo santo dia pro alho. 5 segundos e tá pronto, sem cheiro na mão. Recomendo de olhos fechados!",
    productName: "Mini Processador USB",
    date: "há 3 dias",
    verified: true,
  },
  {
    id: "r6",
    userName: "Rosana Martins",
    city: "Fortaleza/CE",
    rating: 5,
    comment: "O escorredor retrátil salvou minha cozinha pequena. Uso na pia e depois guardo na gaveta. Perfeito!",
    productName: "Escorredor Retrátil",
    date: "há 5 dias",
    verified: true,
  },
];

/** Compras recentes para o aviso de prova social (nome, cidade, produto) */
export const RECENT_BUYERS = [
  { name: "Fernanda", city: "Belo Horizonte/MG", product: "Cortador 12 em 1", ago: "há 3 min" },
  { name: "Juliana", city: "Campinas/SP", product: "Kit 5 Potes Herméticos", ago: "há 7 min" },
  { name: "Patrícia", city: "Recife/PE", product: "Cortador 12 em 1 (2 un)", ago: "há 12 min" },
  { name: "Adriana", city: "Porto Alegre/RS", product: "Organizador Giratório 360°", ago: "há 18 min" },
  { name: "Vanessa", city: "Goiânia/GO", product: "Cortador 12 em 1", ago: "há 25 min" },
  { name: "Camila", city: "Niterói/RJ", product: "Mini Processador USB", ago: "há 31 min" },
];

export const STEPS = [
  { n: "1", t: "Escolha seu kit", s: "Selecione o tamanho ideal para a sua casa — quanto maior, mais você economiza." },
  { n: "2", t: "Pague em segundos", s: "Pix aprovado na hora ou cartão em até 3x sem juros. Ambiente 100% seguro." },
  { n: "3", t: "Receba em casa", s: "Enviamos em 24h com código de rastreio. Frete grátis para todo o Brasil." },
];

export const FAQ = [
  {
    q: "Quanto tempo demora para chegar?",
    a: "Enviamos em até 24h após a confirmação. O prazo médio é de 5 a 12 dias úteis para todo o Brasil, com código de rastreio enviado assim que o pedido sai do estoque.",
  },
  {
    q: "E se eu não gostar do produto?",
    a: "Você tem 7 dias após o recebimento para devolver e receber 100% do seu dinheiro de volta. Sem perguntas, sem burocracia.",
  },
  {
    q: "O pagamento é seguro?",
    a: "Sim! Pagamento via Pix ou cartão em ambiente 100% criptografado. Seus dados nunca são compartilhados.",
  },
  {
    q: "As lâminas são afiadas mesmo?",
    a: "Sim, aço inox de verdade. Por isso todo kit acompanha o protetor de dedos — segurança em primeiro lugar.",
  },
];
