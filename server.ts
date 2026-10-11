import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'data', 'items.json');

interface ChatMessage {
  id: string;
  senderRole: 'finder' | 'claimant';
  senderName: string;
  text: string;
  timestamp: string;
}

interface ClaimRequest {
  id: string;
  itemId: string;
  claimantName: string;
  claimantCity: string;
  claimantContact: string;
  answers: string[];
  extraSpecs: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  messages: ChatMessage[];
}

interface FoundItem {
  id: string;
  type: 'found' | 'lost';
  title: string;
  category: string;
  city: string;
  neighborhood: string;
  dateFound: string;
  publicDescription: string;
  imageUrl: string;
  finderName: string;
  finderPhone: string;
  verificationQuestions: string[];
  secretHintNote?: string;
  status: 'available' | 'verifying' | 'returned';
  createdAt: string;
  claims: ClaimRequest[];
}

const INITIAL_ITEMS: FoundItem[] = [
  {
    id: 'item-101',
    type: 'found',
    title: 'بزطام جلدي قهوي ديال الرجال',
    category: 'بزطام ووثائق',
    city: 'الدار البيضاء',
    neighborhood: 'المعاريف - حدا توين سنتر',
    dateFound: '2026-10-11',
    publicDescription: 'لقيت هاد البزطام طايح حدا محطة الطرامواي فالمعاريف مع الصباح. فيه وراق شخصية وبطاقات بنكية ومبلغ مالي. مخبي التفاصيل باش نعرف مولاه الحقيقي.',
    imageUrl: '/src/assets/images/found_leather_wallet_1791743482191.jpg',
    finderName: 'ياسين العلمي',
    finderPhone: '0661-482910',
    verificationQuestions: [
      'شنو السمية والكنية اللي مكتوبة فبطاقة التعريف الوطنية (CIN)؟',
      'أشمن بنكة ديالها البطاقة البنكية اللي لداخل وشحال تقريبا ديال الفلوس كاينين؟',
      'كاينة واحد التصويرة صغيرة فالجيب الدخلاني، ديال من؟'
    ],
    status: 'verifying',
    createdAt: '2026-10-11T08:30:00Z',
    claims: [
      {
        id: 'claim-201',
        itemId: 'item-101',
        claimantName: 'عمر بنجلون',
        claimantCity: 'الدار البيضاء',
        claimantContact: '0672-991044',
        answers: [
          'عمر بنجلون، رقم البطاقة كيبدا بـ BK',
          'بطاقة ديال التجاري وفا بنك وفيه تقريبا 450 درهم',
          'تصويرة ديال الواليد الله يرحمو بالبيض والكحل'
        ],
        extraSpecs: 'البزطام فيه واحد الجرحة صغيرة من التحت فالقنت اليسري.',
        status: 'pending',
        createdAt: '2026-10-11T10:15:00Z',
        messages: [
          {
            id: 'msg-1',
            senderRole: 'claimant',
            senderName: 'عمر بنجلون',
            text: 'السلام خويا ياسين، الله يرحم ليك الوالدين راه البزطام طاح ليا هاد الصباح وأنا غادي للخدمة، راني جاوبت على الأسئلة كاملة.',
            timestamp: '10:15'
          },
          {
            id: 'msg-2',
            senderRole: 'finder',
            senderName: 'ياسين العلمي',
            text: 'وعليكم السلام خويا عمر، المواصفات اللي عطيتي صحيحة 100%! غير أكد ليا عافاك واش كاينة شي ورقة ديال الضو ولا فاكتورة مطوية لداخل باش نكونو هانيين؟',
            timestamp: '10:22'
          }
        ]
      }
    ]
  },
  {
    id: 'item-102',
    type: 'found',
    title: 'سوارت ديال الطوموبيل مع ميدالية جلدية',
    category: 'سوارت',
    city: 'الرباط',
    neighborhood: 'أكدال - شارع فال ولد عمير',
    dateFound: '2026-10-10',
    publicDescription: 'لقيت هاد الساروت ديال الطوموبيل فوق الطبلة ديال قهوة فـ أكدال. الساروت معاه علاق نحاسي وميدالية مكتوبة فيها جملة.',
    imageUrl: '/src/assets/images/found_car_keys_1791743494206.jpg',
    finderName: 'سلمى التازي',
    finderPhone: '0655-821039',
    verificationQuestions: [
      'أشمن قهوة بالضبط فين نسيتي الساروت وفوق أشمن طبلة؟',
      'شنو مكتوب فديك الحديدة النحاسية الصغيرة اللي مع الساروت؟',
      'واش الساروت فيه شي ساروت آخر صغير ديال الدار ولا بوحدو؟'
    ],
    status: 'available',
    createdAt: '2026-10-10T18:45:00Z',
    claims: []
  },
  {
    id: 'item-103',
    type: 'found',
    title: 'تيليفون آيفون بـ بوشيط خضرا (زيتي)',
    category: 'تيليفون وإلكترونيات',
    city: 'مراكش',
    neighborhood: 'كيليز - حدا بلاصا بلاصا',
    dateFound: '2026-10-11',
    publicDescription: 'تلقى هاد التيليفون طايح فالجردة اللي حدا بلاصا فكيليز. التيليفون طافي بالشحن دبا ولكن شعلتو وعرفت الخلفية ديالو.',
    imageUrl: '/src/assets/images/found_smartphone_1791743504846.jpg',
    finderName: 'المهدي برادة',
    finderPhone: '0619-330492',
    verificationQuestions: [
      'شنو هي التصويرة اللي داير فـ الفوند ديكران (خلفية الشاشة المسدودة)؟',
      'أشمن شركة اتصالات ديالها لاكارت سيم (SIM) اللي فيه؟',
      'شنو الموديل بالضبط ديال التيليفون؟'
    ],
    status: 'available',
    createdAt: '2026-10-11T09:10:00Z',
    claims: []
  },
  {
    id: 'item-104',
    type: 'found',
    title: 'نظاظر ديال الشوف بالبوشيط ديالهم',
    category: 'نظاظر وساعات',
    city: 'طنجة',
    neighborhood: 'الكورنيش - مالاباطا',
    dateFound: '2026-10-09',
    publicDescription: 'لقيت هاد النظاظر ديال الطبيب فالبوشيط ديالهم ديال الثوب محطوطين فوق الكرسي ديال الكورنيش.',
    imageUrl: '/src/assets/images/found_eyeglasses_1791743514865.jpg',
    finderName: 'رشيد الريسوني',
    finderPhone: '0668-120987',
    verificationQuestions: [
      'شنو الماركة اللي مكتوبة لداخل فـ الرجل ديال النظاظر؟',
      'واش كاين شي زيف ديال المسح لداخل فالبوشيط وأشمن لون؟'
    ],
    status: 'available',
    createdAt: '2026-10-09T17:20:00Z',
    claims: []
  },
  {
    id: 'item-105',
    type: 'found',
    title: 'صاك أدو (حقيبة ظهر) كحل ديال الخدمة',
    category: 'صيكان وحقائب',
    city: 'فاس',
    neighborhood: 'طريق إيموزار - حدا الجامعة',
    dateFound: '2026-10-08',
    publicDescription: 'لقينا هاد الصاك منسي فـ طاكسي صغير ففاس. مول الطاكسي خلاه عندي فالمحل باش إلى قلب عليه مولاه ياخذو.',
    imageUrl: '/src/assets/images/found_backpack_1791743525151.jpg',
    finderName: 'الحاج عبد اللطيف',
    finderPhone: '0662-774120',
    verificationQuestions: [
      'شنو الحوايج أو الدفاتر اللي كاينين لداخل فالصاك؟',
      'شنو السمية اللي مكتوبة فـ الدفتر الكبير اللي فالجيب الوسطاني؟'
    ],
    status: 'returned',
    createdAt: '2026-10-08T14:00:00Z',
    claims: []
  }
];

function ensureDataFile(): FoundItem[] {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_ITEMS, null, 2), 'utf-8');
    return INITIAL_ITEMS;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return INITIAL_ITEMS;
  }
}

function saveDataFile(items: FoundItem[]) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '5mb' }));

  app.get('/api/items', (_req, res) => {
    const items = ensureDataFile();
    res.json(items);
  });

  app.post('/api/items', (req, res) => {
    const items = ensureDataFile();
    const {
      type = 'found',
      title,
      category,
      city,
      neighborhood,
      dateFound,
      publicDescription,
      imageUrl,
      finderName,
      finderPhone,
      verificationQuestions
    } = req.body;

    if (!title || !city || !finderName) {
      res.status(400).json({ error: 'عافاك عمر جميع المعلومات الضرورية.' });
      return;
    }

    const newItem: FoundItem = {
      id: `item-${Date.now()}`,
      type,
      title: String(title).trim(),
      category: String(category || 'أخرى').trim(),
      city: String(city).trim(),
      neighborhood: String(neighborhood || 'وسط المدينة').trim(),
      dateFound: String(dateFound || new Date().toISOString().split('T')[0]),
      publicDescription: String(publicDescription || '').trim(),
      imageUrl: String(imageUrl || '/src/assets/images/found_leather_wallet_1791743482191.jpg'),
      finderName: String(finderName).trim(),
      finderPhone: String(finderPhone || '0600-000000').trim(),
      verificationQuestions: Array.isArray(verificationQuestions) && verificationQuestions.length > 0
        ? verificationQuestions.filter((q: string) => q.trim().length > 0)
        : ['شنو هي العلامة المميزة أو المواصفات الدقيقة ديال هاد الحاجة؟'],
      status: 'available',
      createdAt: new Date().toISOString(),
      claims: []
    };

    items.unshift(newItem);
    saveDataFile(items);
    res.status(201).json(newItem);
  });

  app.post('/api/items/:id/claims', (req, res) => {
    const items = ensureDataFile();
    const item = items.find(i => i.id === req.params.id);
    if (!item) {
      res.status(404).json({ error: 'الإعلان ما لقيناهش.' });
      return;
    }

    const { claimantName, claimantCity, claimantContact, answers, extraSpecs } = req.body;
    if (!claimantName || !claimantContact) {
      res.status(400).json({ error: 'السمية ورقم التيليفون ضروريين للتواصل.' });
      return;
    }

    const newClaim: ClaimRequest = {
      id: `claim-${Date.now()}`,
      itemId: item.id,
      claimantName: String(claimantName).trim(),
      claimantCity: String(claimantCity || item.city).trim(),
      claimantContact: String(claimantContact).trim(),
      answers: Array.isArray(answers) ? answers.map(String) : [],
      extraSpecs: String(extraSpecs || '').trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderRole: 'claimant',
          senderName: String(claimantName).trim(),
          text: extraSpecs
            ? `السلام عليكم، هادي راها ديالي. جاوبت على الأسئلة ديال المواصفات، وهادي تفاصيل إضافية: ${extraSpecs}`
            : 'السلام عليكم، هادي راها ديالي وراني جاوبت على الأسئلة ديال المواصفات باش تتأكد.',
          timestamp: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    item.claims.unshift(newClaim);
    if (item.status === 'available') {
      item.status = 'verifying';
    }
    saveDataFile(items);
    res.status(201).json({ item, claim: newClaim });
  });

  app.post('/api/items/:id/claims/:claimId/messages', (req, res) => {
    const items = ensureDataFile();
    const item = items.find(i => i.id === req.params.id);
    if (!item) {
      res.status(404).json({ error: 'الإعلان غير موجود.' });
      return;
    }
    const claim = item.claims.find(c => c.id === req.params.claimId);
    if (!claim) {
      res.status(404).json({ error: 'طلب التحقق غير موجود.' });
      return;
    }

    const { senderRole, senderName, text } = req.body;
    if (!text || !String(text).trim()) {
      res.status(400).json({ error: 'الرسالة خاوية.' });
      return;
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderRole: senderRole === 'finder' ? 'finder' : 'claimant',
      senderName: String(senderName || (senderRole === 'finder' ? item.finderName : claim.claimantName)),
      text: String(text).trim(),
      timestamp: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' })
    };

    claim.messages.push(newMsg);
    saveDataFile(items);
    res.status(201).json({ item, claim });
  });

  app.patch('/api/items/:id/claims/:claimId/status', (req, res) => {
    const items = ensureDataFile();
    const item = items.find(i => i.id === req.params.id);
    if (!item) {
      res.status(404).json({ error: 'الإعلان غير موجود.' });
      return;
    }
    const claim = item.claims.find(c => c.id === req.params.claimId);
    if (!claim) {
      res.status(404).json({ error: 'طلب التحقق غير موجود.' });
      return;
    }

    const { status } = req.body;
    if (status === 'approved' || status === 'rejected' || status === 'pending') {
      claim.status = status;
      if (status === 'approved') {
        item.status = 'returned';
        claim.messages.push({
          id: `msg-${Date.now()}`,
          senderRole: 'finder',
          senderName: item.finderName,
          text: `تم التأكد من المواصفات بنجاح! مرحبا خويا/ختي ${claim.claimantName}، تقدر تعيط ليا فـ ${item.finderPhone} باش نتلاقاو ونسلمك الأمانة ديالك.`,
          timestamp: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' })
        });
      }
      saveDataFile(items);
    }

    res.json({ item, claim });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
