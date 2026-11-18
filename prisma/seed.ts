import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existingCategories = await prisma.category.count();
  if (existingCategories > 0) {
    console.log("Database already seeded — skipping seed.");
    return;
  }

  console.log("Seeding HER ERA database...");

  // 1. Store Settings
  await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      instapayHandle: "herera@instapay",
      vodafoneCashNumber: "01000000000",
      whatsappNumber: "201000000000",
      shippingCairo: 60,
      shippingOther: 85,
      announcementAr: "شحن لجميع محافظات مصر • الدفع عند الاستلام أو إنستاباي أو فودافون كاش",
      announcementEn: "Shipping across all Egypt • COD, InstaPay & Vodafone Cash",
    },
  });

  // 2. Categories
  const categoriesData = [
    {
      slug: "dresses",
      nameAr: "سوت",
      nameEn: "Suits",
      descriptionAr: "فساتين وسوت شتوية وتريكو وكوردروي بتصميمات عصرية ومحتشمة",
      image: "/images/products/sunflower-dress-brown.jpg",
      sortOrder: 1,
    },
    {
      slug: "sets",
      nameAr: "طقم",
      nameEn: "Sets",
      descriptionAr: "طقم ٣ قطع من ٦٥ ل ٨٥ - أطقم سوت قطعتين و3 قطع بخامات مميزة",
      image: "https://res.cloudinary.com/me1qwpbw/image/upload/v1795027620/3450f9ea-1303-4713-a9a6-fbe25b0adb49.png",
      sortOrder: 2,
    },
    {
      slug: "outerwear",
      nameAr: "جاكيت",
      nameEn: "Jackets",
      descriptionAr: "جاكت كت جلد يلبس ل ٨٥ - جواكت جوخ وبومبر لإطلالة شتوية دافئة",
      image: "https://res.cloudinary.com/me1qwpbw/image/upload/v1795027723/87862f5a-bd27-419d-af74-567fb817ae4c.png",
      sortOrder: 3,
    },
    {
      slug: "knitwear",
      nameAr: "كارديجان",
      nameEn: "Cardigans",
      descriptionAr: "كارديجان شال جوخ من ٧٠ ل ٩٠ - كارديجان وتريكو بخامات ناعمة",
      image: "https://res.cloudinary.com/me1qwpbw/image/upload/v1795027767/2fb18e64-a1be-4bb1-989f-7ae3f9ae77b2.png",
      sortOrder: 4,
    },
    {
      slug: "jumpsuits",
      nameAr: "بلوزة",
      nameEn: "Blouses",
      descriptionAr: "بلوزة مشجرة من ٦٥ ل ٨٥ - بلوزات وتصميمات كاجوال عصرية",
      image: "https://res.cloudinary.com/me1qwpbw/image/upload/v1795027808/67a737ef-7517-47e1-b715-8bb57c8055fb.png",
      sortOrder: 5,
    },
    {
      slug: "pants",
      nameAr: "بنطلون",
      nameEn: "Pants",
      descriptionAr: "بناطيل وايد ليج مريحة وعملية للتنسيق اليومي",
      image: "/images/products/wide-leg-pants-black.jpg",
      sortOrder: 6,
    },
    {
      slug: "skirts",
      nameAr: "جيبة",
      nameEn: "Skirts",
      descriptionAr: "جيبة دبل كلوش من ٦٥ ل ٨٥ بتصميم واسع وانسيابي أنيق",
      image: "https://res.cloudinary.com/me1qwpbw/image/upload/v1795027680/8865f4a2-dc52-482b-90cb-58845ebcfd20.png",
      sortOrder: 7,
    },
  ];

  const catMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    catMap[cat.slug] = created.id;
  }

  // 3. Products (All 25 uploaded items)
  const productsData = [
    // --- DRESSES ---
    {
      slug: "sunflower-knit-maxi-dress",
      nameAr: "دريس تريكو ماكسي بنقشة عباد الشمس",
      nameEn: "Sunflower Knit Maxi Dress",
      descriptionAr: "دريس تريكو شتوي طويل بدون أكمام بنقشة زهور عباد الشمس الجريئة، خامة صوف تريكو ناعمة ودافئة، مثالي للتنسيق فوق قميص أبيض لإطلالة محجبات أنيقة.",
      descriptionEn: "Cozy sleeveless knit maxi dress featuring bold sunflower jacquard motifs. Soft warm knitwear ideal for layering over a crisp white shirt.",
      price: 1000,
      compareAtPrice: 1200,
      categoryId: catMap["dresses"],
      sizes: ["One Size", "M", "L", "XL"],
      colors: [
        { nameAr: "بني × بيج", nameEn: "Brown / Beige", hex: "#5B3A29", image: "/images/products/sunflower-dress-brown.jpg" },
        { nameAr: "أسود × بيج", nameEn: "Black / Beige", hex: "#1B1B1B", image: "/images/products/sunflower-dress-black.jpg" },
        { nameAr: "مستردة × أسود", nameEn: "Mustard / Black", hex: "#C88A2E", image: "/images/products/sunflower-dress-mustard.jpg" },
      ],
      images: [
        "/images/products/sunflower-dress-brown.jpg",
        "/images/products/sunflower-dress-black.jpg",
        "/images/products/sunflower-dress-mustard.jpg",
      ],
      badgeAr: "الأكثر مبيعاً",
      collectionName: "شتاء 2026",
      featured: true,
    },
    {
      slug: "corduroy-plaid-vest-dress",
      nameAr: "فستان كوردروي بياقة عريضة وفيست كاروهات",
      nameEn: "Corduroy Dress with Plaid Vest",
      descriptionAr: "فستان ميدي من قماش الكوردروي المضلع الفاخر مع ياقة بيتر بان عريضة وفيست كاروهات متصل بأزرار أمامية وتنورة واسعة مريحة.",
      descriptionEn: "Elegant ribbed corduroy midi dress featuring a wide Peter Pan collar and tailored plaid button vest with a flowing A-line skirt.",
      price: 1000,
      compareAtPrice: 1180,
      categoryId: catMap["dresses"],
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { nameAr: "بيج", nameEn: "Beige", hex: "#D6C5B0", image: "/images/products/corduroy-dress-beige.jpg" },
        { nameAr: "زيتي", nameEn: "Olive Green", hex: "#4D5942", image: "/images/products/corduroy-dress-olive.jpg" },
        { nameAr: "نبيتي", nameEn: "Burgundy", hex: "#6B1D2F", image: "/images/products/corduroy-dress-burgundy.jpg" },
      ],
      images: [
        "/images/products/corduroy-dress-beige.jpg",
        "/images/products/corduroy-dress-olive.jpg",
        "/images/products/corduroy-dress-burgundy.jpg",
      ],
      badgeAr: "وصل حديثاً",
      collectionName: "شتاء 2026",
      featured: true,
    },
    {
      slug: "ribbed-knit-plaid-skirt-dress",
      nameAr: "دريس تريكو مضلع أوف وايت مع جيب كاروهات",
      nameEn: "Ribbed Knit Dress & Plaid Skirt",
      descriptionAr: "إطلالة شتوية راقية مكونة من تونيك تريكو مضلع بلون أوف وايت بفتحة جانبية مع جيب كاروهات بني كلاسيكي.",
      descriptionEn: "Chic layered winter look featuring an off-white ribbed knit side-slit tunic paired with a classic brown plaid skirt.",
      price: 850,
      categoryId: catMap["dresses"],
      sizes: ["One Size", "M", "L", "XL"],
      colors: [
        { nameAr: "أوف وايت × كاروهات بني", nameEn: "Off-White / Plaid", hex: "#F5F1EA", image: "/images/products/ribbed-dress-plaid-skirt.jpg" },
      ],
      images: ["/images/products/ribbed-dress-plaid-skirt.jpg"],
      badgeAr: "وصل حديثاً",
      collectionName: "شتاء 2026",
      featured: false,
    },
    {
      slug: "corduroy-maxi-button-dress-brown",
      nameAr: "دريس كوردروي ماكسي بأزرار أمامية",
      nameEn: "Corduroy Button-Down Maxi Dress",
      descriptionAr: "دريس ماكسي محتشم من قماش القطيفة المضلعة (كوردروي) بأزرار أمامية بطول الفستان وقصّة واسعة انسيابية.",
      descriptionEn: "Modest full-length corduroy shirt dress with front button closure and a flattering flared silhouette.",
      price: 1100,
      categoryId: catMap["dresses"],
      sizes: ["M", "L", "XL", "XXL"],
      colors: [
        { nameAr: "بني كافيه", nameEn: "Mocha Brown", hex: "#6F5B4F", image: "/images/products/corduroy-maxi-brown.jpg" },
      ],
      images: ["/images/products/corduroy-maxi-brown.jpg"],
      collectionName: "شتاء 2026",
      featured: false,
    },
    {
      slug: "wool-maxi-button-dress-beige",
      nameAr: "دريس جوخ ماكسي بأزرار أمامية",
      nameEn: "Wool-Blend Button Maxi Dress",
      descriptionAr: "فستان ماكسي شتوي من الجوخ الناعم الدافئ بياقة قميص وأزرار أمامية كاملة، تصميم عملي وأنيق للمشوار اليومي.",
      descriptionEn: "Warm wool-blend maxi coat dress with classic collar and full front buttons for effortless modest elegance.",
      price: 1100,
      categoryId: catMap["dresses"],
      sizes: ["M", "L", "XL", "XXL"],
      colors: [
        { nameAr: "بيج رملي", nameEn: "Sand Beige", hex: "#D6C1A8", image: "/images/products/wool-maxi-beige.jpg" },
      ],
      images: ["/images/products/wool-maxi-beige.jpg"],
      collectionName: "شتاء 2026",
      featured: false,
    },

    // --- CASUAL SETS ---
    {
      slug: "rose-la-pink-sweat-set",
      nameAr: "سوت هودي بأكمام مطرزة ورد وبنطلون بينك",
      nameEn: "Rose Embroidered Hoodie & Pink Set",
      descriptionAr: "سوت كاجوال أنثوي مكون من هودي أوف وايت بتطريز ورود على الأكمام وشعار LA مع بنطلون وايد ليج بلون بينك ناعم.",
      descriptionEn: "Feminine two-piece set featuring a cream hoodie with rose-embroidered sleeves and soft pink wide-leg sweatpants.",
      price: 1100,
      compareAtPrice: 1290,
      categoryId: catMap["sets"],
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { nameAr: "أوف وايت × بينك", nameEn: "Cream / Pink", hex: "#E598AB", image: "/images/products/rose-la-pink-set.jpg" },
      ],
      images: ["/images/products/rose-la-pink-set.jpg"],
      badgeAr: "الأكثر طلباً",
      collectionName: "شتاء 2026",
      featured: true,
    },
    {
      slug: "denim-hooded-vest-wide-set",
      nameAr: "سوت جينز ثلجي فيست بهودي وبنطلون وايد ليج",
      nameEn: "Ice Blue Denim Vest & Pants Set",
      descriptionAr: "طقم قطعتين من الجينز الثلجي الخفيف المريح: فيست بغطاء رأس ورباط أبيض مع بنطلون وايد ليج بقصّة عصرية.",
      descriptionEn: "Two-piece light-wash denim set featuring a hooded sleeveless vest top and matching relaxed wide-leg trousers.",
      price: 1150,
      categoryId: catMap["sets"],
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { nameAr: "أزرق ثلجي", nameEn: "Ice Blue", hex: "#7CA5CE", image: "/images/products/denim-vest-set-blue.jpg" },
      ],
      images: ["/images/products/denim-vest-set-blue.jpg"],
      badgeAr: "وصل حديثاً",
      collectionName: "شتاء 2026",
      featured: true,
    },
    {
      slug: "acid-wash-charcoal-tracksuit",
      nameAr: "طقم هودي وبنطلون وايد ليج أسيد ووش",
      nameEn: "Charcoal Acid-Wash Tracksuit",
      descriptionAr: "طقم ميلتون ثقيل مبطن بقصة أوفر سايز ولون رمادي فحمي أسيد ووش عصري مع هودي بغطاء رأس وبنطلون وايد ليج.",
      descriptionEn: "Heavyweight fleece-lined oversized tracksuit in trendy charcoal acid-wash with kangaroo pocket hoodie and wide-leg pants.",
      price: 1100,
      categoryId: catMap["sets"],
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { nameAr: "رمادي فحمي", nameEn: "Charcoal", hex: "#4D5156", image: "/images/products/acid-wash-set-1.jpg" },
      ],
      images: [
        "/images/products/acid-wash-set-1.jpg",
        "/images/products/acid-wash-set-2.jpg",
        "/images/products/acid-wash-set-3.jpg",
      ],
      collectionName: "شتاء 2026",
      featured: true,
    },
    {
      slug: "cream-brown-stripe-set",
      nameAr: "سوت هودي وبنطلون أوف وايت × بني",
      nameEn: "Cream & Brown Striped Sweat Set",
      descriptionAr: "سوت ميلتون ناعم بلون أوف وايت مع هود وتفاصيل أساور وخطوط جانبية باللون البني الشوكولاتة.",
      descriptionEn: "Soft cream fleece tracksuit accented with chocolate brown hood, ribbed cuffs, and sporty side stripes.",
      price: 750,
      categoryId: catMap["sets"],
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { nameAr: "أوف وايت × بني", nameEn: "Cream / Brown", hex: "#EAE3D5", image: "/images/products/cream-brown-set.jpg" },
      ],
      images: ["/images/products/cream-brown-set.jpg"],
      badgeAr: "سعر مميز",
      collectionName: "شتاء 2026",
      featured: false,
    },
    {
      slug: "brown-gingham-layered-set",
      nameAr: "سوت سويت شيرت وبنطلون بطرف كاروهات أزرق",
      nameEn: "Brown Gingham-Hem Sweatshirt Set",
      descriptionAr: "سوت بني شوكولاتة من الميلتون الناعم مع طرف سفلي كاروهات أزرق وأبيض لإطلالة ليرز عصرية جاهزة.",
      descriptionEn: "Chocolate brown fleece sweatshirt and wide-leg pants set styled with a built-in blue gingham layered shirt hem.",
      price: 1000,
      categoryId: catMap["sets"],
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { nameAr: "بني × كاروهات أزرق", nameEn: "Brown / Blue", hex: "#4A3A35", image: "/images/products/brown-gingham-set.jpg" },
      ],
      images: ["/images/products/brown-gingham-set.jpg"],
      collectionName: "شتاء 2026",
      featured: false,
    },
    {
      slug: "sky-blue-3pc-striped-set",
      nameAr: "سوت 3 قطع بيبي بلو مع قطعة مقلمة",
      nameEn: "Sky Blue 3-Piece Tracksuit Set",
      descriptionAr: "سوت كامل 3 قطع بلون بيبي بلو هادئ: سويت شيرت مطبوع، بنطلون وايد ليج، وقطعة تريكو مقلمة تُربط على الخصر.",
      descriptionEn: "Complete 3-piece baby blue casual set including graphic sweatshirt, wide-leg sweatpants, and striped knit waist layer.",
      price: 1050,
      categoryId: catMap["sets"],
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { nameAr: "بيبي بلو", nameEn: "Sky Blue", hex: "#89B0DC", image: "/images/products/sky-blue-3pc-set.jpg" },
      ],
      images: ["/images/products/sky-blue-3pc-set.jpg"],
      badgeAr: "3 قطع",
      collectionName: "شتاء 2026",
      featured: false,
    },
    {
      slug: "burgundy-gold-trim-tracksuit",
      nameAr: "سوت نبيتي بسوستة وتطريز ذهبي",
      nameEn: "Burgundy Gold-Trim Zip Tracksuit",
      descriptionAr: "سوت ميلتون فاخر بلون نبيتي عميق مع جاكيت بسوستة وتفاصيل شريط ذهبي على الأكمام والخصر وبنطلون وايد ليج.",
      descriptionEn: "Luxe deep burgundy fleece zip-up tracksuit detailed with metallic gold-tone Greek trim and crest embroidery.",
      price: 1100,
      categoryId: catMap["sets"],
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { nameAr: "نبيتي × ذهبي", nameEn: "Burgundy / Gold", hex: "#521927", image: "/images/products/burgundy-gold-set.jpg" },
      ],
      images: ["/images/products/burgundy-gold-set.jpg"],
      collectionName: "شتاء 2026",
      featured: false,
    },
    {
      slug: "striped-sweatshirt-black-pants-set",
      nameAr: "سوت مقلم أبيض × أسود وبنطلون أسود",
      nameEn: "Striped Sweatshirt & Black Pants Set",
      descriptionAr: "طقم كاجوال عملي مكون من سويت شيرت مقلم أبيض في أسود بطبعة حمراء وبنطلون أسود وايد ليج مريح.",
      descriptionEn: "Effortless everyday set combining a monochrome striped graphic sweatshirt with relaxed black wide-leg sweatpants.",
      price: 1100,
      categoryId: catMap["sets"],
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { nameAr: "أبيض × أسود", nameEn: "Black / White", hex: "#222222", image: "/images/products/striped-black-set.jpg" },
      ],
      images: ["/images/products/striped-black-set.jpg"],
      collectionName: "شتاء 2026",
      featured: false,
    },
    {
      slug: "snake-print-knit-set",
      nameAr: "سوت تريكو بيج وبنطلون بنقشة سنيك",
      nameEn: "Beige & Snake-Print Knit Set",
      descriptionAr: "طقم تريكو ناعم وأنيق مكون من بلوفر بيج بجيب بنقشة سنيك وبنطلون وايد ليج كامل بنقشة سنيك بني.",
      descriptionEn: "Statement two-piece knit set pairing a beige sweater with a snake-print pocket and matching patterned wide-leg knit pants.",
      price: 1100,
      categoryId: catMap["sets"],
      sizes: ["One Size", "M", "L", "XL"],
      colors: [
        { nameAr: "بيج × بني سنيك", nameEn: "Beige / Snake", hex: "#C8B6A6", image: "/images/products/snake-knit-set.jpg" },
      ],
      images: ["/images/products/snake-knit-set.jpg"],
      collectionName: "شتاء 2026",
      featured: false,
    },
    {
      slug: "butter-yellow-striped-set",
      nameAr: "سوت جاكيت وبنطلون بخطوط جانبية (باتر يلو)",
      nameEn: "Butter Yellow Striped Tracksuit",
      descriptionAr: "سوت رياضي كاجوال بلون باتر يلو تريندي مع جاكيت بأزرار بيضاء وخطوط جانبية وبنطلون وايد ليج.",
      descriptionEn: "Trendy butter-yellow two-piece sporty set with contrast white side stripes, toggle buttons, and wide-leg trousers.",
      price: 1100,
      categoryId: catMap["sets"],
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { nameAr: "باتر يلو", nameEn: "Butter Yellow", hex: "#EFE4A8", image: "/images/products/butter-yellow-set.jpg" },
      ],
      images: ["/images/products/butter-yellow-set.jpg"],
      badgeAr: "تريندي",
      collectionName: "شتاء 2026",
      featured: true,
    },

    // --- OUTERWEAR ---
    {
      slug: "biker-wool-belt-jacket",
      nameAr: "جاكيت جوخ بايكر بحزام خصر",
      nameEn: "Belted Wool-Felt Biker Jacket",
      descriptionAr: "جاكيت جوخ قصير بتصميم بايكر أنيق مع ياقة عريضة، سوستة معدنية مائلة، جيب جانبي على الكم، وحزام خصر بإبزيم.",
      descriptionEn: "Cropped wool-felt moto jacket designed with wide lapels, asymmetrical silver zipper, sleeve pocket, and buckled waist belt.",
      price: 850,
      compareAtPrice: 1050,
      categoryId: catMap["outerwear"],
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { nameAr: "أسود", nameEn: "Black", hex: "#1A1A1A", image: "/images/products/biker-wool-jacket-black.jpg" },
        { nameAr: "نبيتي", nameEn: "Burgundy", hex: "#641727", image: "/images/products/biker-wool-jacket-burgundy.jpg" },
        { nameAr: "بني شوكولاتة", nameEn: "Brown", hex: "#4B2E1E", image: "/images/products/biker-wool-jacket-brown.jpg" },
      ],
      images: [
        "/images/products/biker-wool-jacket-black.jpg",
        "/images/products/biker-wool-jacket-burgundy.jpg",
        "/images/products/biker-wool-jacket-brown.jpg",
      ],
      badgeAr: "وصل حديثاً",
      collectionName: "شتاء 2026",
      featured: true,
    },
    {
      slug: "high-neck-wool-moto-jacket",
      nameAr: "جاكيت جوخ قصير برقبة عالية وحزام",
      nameEn: "High-Neck Wool-Felt Jacket",
      descriptionAr: "جاكيت جوخ شتوي دافئ برقبة عالية وسوستة علوية مع حزام سفلي قابل للتعديل، عملي وسهل التنسيق مع البناطيل الوايد ليج.",
      descriptionEn: "Warm wool-felt cropped jacket with a stand-up zip collar, shoulder tabs, and adjustable buckled hem.",
      price: 850,
      categoryId: catMap["outerwear"],
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { nameAr: "زيتي", nameEn: "Olive", hex: "#3B4631", image: "/images/products/wool-jacket-olive.jpg" },
        { nameAr: "نبيتي", nameEn: "Burgundy", hex: "#5D1A2B", image: "/images/products/wool-jacket-burgundy.jpg" },
        { nameAr: "كاميل", nameEn: "Camel", hex: "#B8976F", image: "/images/products/wool-jacket-camel.jpg" },
      ],
      images: [
        "/images/products/wool-jacket-olive.jpg",
        "/images/products/wool-jacket-burgundy.jpg",
        "/images/products/wool-jacket-camel.jpg",
      ],
      collectionName: "شتاء 2026",
      featured: true,
    },
    {
      slug: "paisley-jacquard-knit-cardigan",
      nameAr: "كارديجان تريكو طويل بنقشة بيزلي",
      nameEn: "Paisley Jacquard Knit Cardigan",
      descriptionAr: "كارديجان تريكو طويل مفتوح باللون الأسود مع نقشة بيزلي/باندانا باللونين الأزرق والأبيض، مثالي لإطلالة محجبات أنيقة.",
      descriptionEn: "Long open-front knit cardigan in black adorned with blue and white paisley jacquard patterns.",
      price: 800,
      categoryId: catMap["outerwear"],
      sizes: ["One Size", "M", "L", "XL"],
      colors: [
        { nameAr: "أسود × أزرق", nameEn: "Black / Blue", hex: "#1F242D", image: "/images/products/paisley-cardigan-black.jpg" },
      ],
      images: ["/images/products/paisley-cardigan-black.jpg"],
      collectionName: "شتاء 2026",
      featured: false,
    },
    {
      slug: "san-francisco-2in1-bomber-jacket",
      nameAr: "جاكيت بومبر 2 في 1 بغطاء رأس رمادي",
      nameEn: "2-in-1 Hooded Bomber Jacket",
      descriptionAr: "جاكيت بومبر أسود دبل فيس عملي جداً مع غطاء رأس ميلتون رمادي وتطريز خلفي مميز، يمنحك إطلالتين في قطعة واحدة.",
      descriptionEn: "Versatile 2-in-1 black bomber jacket with a cozy grey fleece hood and crisp back embroidery.",
      price: 750,
      categoryId: catMap["outerwear"],
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { nameAr: "أسود × رمادي", nameEn: "Black / Grey", hex: "#202124", image: "/images/products/bomber-jacket-black.jpg" },
      ],
      images: ["/images/products/bomber-jacket-black.jpg"],
      badgeAr: "2 في 1",
      collectionName: "شتاء 2026",
      featured: false,
    },
    {
      slug: "butterfly-plush-fleece-shacket",
      nameAr: "جاكيت فرو ناعم بهودي وأزرار بنقشة فراشات",
      nameEn: "Butterfly Plush Fleece Shacket",
      descriptionAr: "شاكيت شتوي دافئ جداً من الفرو الناعم بنقشة مربعات وفراشات بألوان البيج والأوف وايت مع هودي وأزرار أمامية.",
      descriptionEn: "Ultra-soft plush fleece hooded shacket with beige and cream butterfly checkerboard pattern and front button closure.",
      price: 650,
      categoryId: catMap["outerwear"],
      sizes: ["One Size", "M", "L", "XL"],
      colors: [
        { nameAr: "بيج × أوف وايت", nameEn: "Beige / Cream", hex: "#DEC7AC", image: "/images/products/butterfly-shacket-beige.jpg" },
      ],
      images: ["/images/products/butterfly-shacket-beige.jpg"],
      badgeAr: "سعر مميز",
      collectionName: "شتاء 2026",
      featured: false,
    },

    // --- KNITWEAR ---
    {
      slug: "denim-collar-knit-sweater",
      nameAr: "بلوفر تريكو بياقة جينز",
      nameEn: "Denim-Collar Knit Sweater",
      descriptionAr: "بلوفر تريكو شتوي ناعم بقصة مريحة مع ياقة قميص جينز مدمجة بأزرار معدنية، قطعة عملية وأنيقة للجامعة والخروجات.",
      descriptionEn: "Soft knit pullover featuring a built-in washed denim shirt collar with metal snap buttons.",
      price: 800,
      categoryId: catMap["knitwear"],
      sizes: ["One Size", "S", "M", "L"],
      colors: [
        { nameAr: "أوف وايت", nameEn: "Off-White", hex: "#F4F2ED", image: "/images/products/denim-collar-sweater-white.jpg" },
        { nameAr: "أسود", nameEn: "Black", hex: "#1B1D21", image: "/images/products/denim-collar-sweater-black.jpg" },
        { nameAr: "كحلي", nameEn: "Navy", hex: "#2F3E5E", image: "/images/products/denim-collar-sweater-navy.jpg" },
      ],
      images: [
        "/images/products/denim-collar-sweater-white.jpg",
        "/images/products/denim-collar-sweater-black.jpg",
        "/images/products/denim-collar-sweater-navy.jpg",
      ],
      badgeAr: "الأكثر مبيعاً",
      collectionName: "شتاء 2026",
      featured: true,
    },
    {
      slug: "polka-dot-denim-zip-sweater",
      nameAr: "بلوفر تريكو بيبي بلو منقط بياقة جينز",
      nameEn: "Polka-Dot Denim-Collar Sweater",
      descriptionAr: "بلوفر صوف ناعم بلون بيبي بلو مع نقط سوداء كلاسيكية وياقة جينز بسوستة نصفية أمامية.",
      descriptionEn: "Soft baby-blue knit sweater with black polka dots and a half-zip washed denim collar.",
      price: 750,
      categoryId: catMap["knitwear"],
      sizes: ["One Size", "S", "M", "L"],
      colors: [
        { nameAr: "بيبي بلو", nameEn: "Baby Blue", hex: "#A8C3D4", image: "/images/products/polka-dot-denim-sweater.jpg" },
      ],
      images: ["/images/products/polka-dot-denim-sweater.jpg"],
      collectionName: "شتاء 2026",
      featured: false,
    },
    {
      slug: "fair-isle-geometric-knit-sweater",
      nameAr: "بلوفر تريكو جاكار بنقشة هندسية",
      nameEn: "Fair Isle Geometric Knit Sweater",
      descriptionAr: "بلوفر شتوي دافئ بخامة صوف ناعمة ونقشة هندسية كلاسيكية بألوان البيج والأوف وايت الهادئة.",
      descriptionEn: "Cozy wool-blend crewneck sweater in a timeless beige and cream Fair Isle geometric knit pattern.",
      price: 750,
      categoryId: catMap["knitwear"],
      sizes: ["One Size", "M", "L", "XL"],
      colors: [
        { nameAr: "بيج × أوف وايت", nameEn: "Beige / Cream", hex: "#C7AE98", image: "/images/products/fair-isle-sweater-beige.jpg" },
      ],
      images: ["/images/products/fair-isle-sweater-beige.jpg"],
      collectionName: "شتاء 2026",
      featured: false,
    },

    // --- JUMPSUITS ---
    {
      slug: "chocolate-zip-wide-jumpsuit",
      nameAr: "جامبسوت وايد ليج بسوستة أمامية",
      nameEn: "Zip-Front Wide-Leg Jumpsuit",
      descriptionAr: "جامبسوت ميلتون ثقيل بلون بني شوكولاتة مع خصر محدد، سوستة أمامية عملية، وأرجل وايد ليج واسعة مريحة.",
      descriptionEn: "Sculpting chocolate-brown fleece jumpsuit with cinched waist, front zipper closure, and dramatic wide-leg fit.",
      price: 750,
      categoryId: catMap["jumpsuits"],
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { nameAr: "بني شوكولاتة", nameEn: "Chocolate Brown", hex: "#3A2C27", image: "/images/products/jumpsuit-brown.jpg" },
      ],
      images: ["/images/products/jumpsuit-brown.jpg"],
      badgeAr: "وصل حديثاً",
      collectionName: "شتاء 2026",
      featured: false,
    },

    // --- PANTS ---
    {
      slug: "high-waist-baggy-fleece-pants",
      nameAr: "بنطلون وايد ليج ميلتون بخصر عالي",
      nameEn: "High-Waist Baggy Fleece Pants",
      descriptionAr: "بنطلون باجي وايد ليج من الميلتون القطن الثقيل بخصر عالي مريح ورباط بأطراف معدنية، سهل التنسيق مع أي تيشيرت أو هودي.",
      descriptionEn: "Heavyweight black cotton-fleece baggy wide-leg sweatpants with high elasticated waist and metal-tipped drawstring.",
      price: 700,
      categoryId: catMap["pants"],
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { nameAr: "أسود", nameEn: "Black", hex: "#161618", image: "/images/products/wide-leg-pants-black.jpg" },
      ],
      images: ["/images/products/wide-leg-pants-black.jpg"],
      collectionName: "شتاء 2026",
      featured: false,
    },
  ];

  for (const prod of productsData) {
    await prisma.product.create({ data: prod });
  }

  console.log(`Seeded ${categoriesData.length} categories and ${productsData.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
