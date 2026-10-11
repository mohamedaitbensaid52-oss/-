import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  ShieldCheck,
  Phone,
  PackageCheck
} from 'lucide-react';
import { FoundItem, ClaimRequest } from './types';
import walletImg from './assets/images/found_leather_wallet_1791743482191.jpg';
import keysImg from './assets/images/found_car_keys_1791743494206.jpg';
import phoneImg from './assets/images/found_smartphone_1791743504846.jpg';
import glassesImg from './assets/images/found_eyeglasses_1791743514865.jpg';
import backpackImg from './assets/images/found_backpack_1791743525151.jpg';

const STORAGE_KEY = 'amana_morocco_items_v1';

const MOROCCAN_CITIES = [
  'الكل',
  'الدار البيضاء',
  'الرباط',
  'مراكش',
  'طنجة',
  'فاس',
  'أكادير',
  'مكناس',
  'وجدة',
  'القنيطرة',
  'تطوان',
  'آسفي',
  'الجديدة',
  'بني ملال',
  'الناظور'
];

const CATEGORIES = [
  'الكل',
  'بزطام ووثائق',
  'تيليفون وإلكترونيات',
  'سوارت',
  'نظاظر وساعات',
  'صيكان وحقائب',
  'مجوهرات وأغراض شخصية',
  'أخرى'
];

const PRESET_IMAGES = [
  {
    label: 'بزطام / وثائق',
    url: walletImg
  },
  {
    label: 'سوارت طوموبيل / دار',
    url: keysImg
  },
  {
    label: 'تيليفون / إلكترونيات',
    url: phoneImg
  },
  {
    label: 'نظاظر / أكسسوارات',
    url: glassesImg
  },
  {
    label: 'صاك / حقيبة',
    url: backpackImg
  }
];

const INITIAL_SEED_ITEMS: FoundItem[] = [
  {
    id: 'item-101',
    type: 'found',
    title: 'بزطام جلدي قهوي ديال الرجال',
    category: 'بزطام ووثائق',
    city: 'الدار البيضاء',
    neighborhood: 'المعاريف - حدا توين سنتر',
    dateFound: '2026-10-11',
    publicDescription: 'لقيت هاد البزطام طايح حدا محطة الطرامواي فالمعاريف مع الصباح. فيه وراق شخصية وبطاقات بنكية ومبلغ مالي. مخبي التفاصيل باش نعرف مولاه الحقيقي.',
    imageUrl: walletImg,
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
    imageUrl: keysImg,
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
    imageUrl: phoneImg,
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
    imageUrl: glassesImg,
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
    imageUrl: backpackImg,
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

function normalizeImageUrl(url: string): string {
  if (url.includes('found_leather_wallet')) return walletImg;
  if (url.includes('found_car_keys')) return keysImg;
  if (url.includes('found_smartphone')) return phoneImg;
  if (url.includes('found_eyeglasses')) return glassesImg;
  if (url.includes('found_backpack')) return backpackImg;
  return url;
}

function loadLocalItems(): FoundItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: FoundItem[] = JSON.parse(saved);
      return parsed.map((item) => ({
        ...item,
        imageUrl: normalizeImageUrl(item.imageUrl)
      }));
    }
  } catch {
    // ignore storage errors
  }
  return INITIAL_SEED_ITEMS;
}

function saveLocalItems(items: FoundItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
}

export default function App() {
  const [items, setItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCity, setSelectedCity] = useState<string>('الكل');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [selectedType, setSelectedType] = useState<'all' | 'found' | 'lost'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active modals / drawers
  const [activeItem, setActiveItem] = useState<FoundItem | null>(null);
  const [activeTabInDrawer, setActiveTabInDrawer] = useState<'claim' | 'verify_chat'>('claim');
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [roleView, setRoleView] = useState<'claimant' | 'finder'>('claimant');

  // Post Modal state
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
  const [postType, setPostType] = useState<'found' | 'lost'>('found');
  const [postTitle, setPostTitle] = useState<string>('');
  const [postCategory, setPostCategory] = useState<string>('بزطام ووثائق');
  const [postCity, setPostCity] = useState<string>('الدار البيضاء');
  const [postNeighborhood, setPostNeighborhood] = useState<string>('');
  const [postDate, setPostDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [postDescription, setPostDescription] = useState<string>('');
  const [postImageUrl, setPostImageUrl] = useState<string>(walletImg);
  const [postFinderName, setPostFinderName] = useState<string>('');
  const [postFinderPhone, setPostFinderPhone] = useState<string>('');
  const [postQuestions, setPostQuestions] = useState<string[]>([
    'شنو هي العلامة المميزة أو التفاصيل اللي ما بايناش فالتصويرة؟',
    'شنو كان لداخل بالضبط أو فين طاحت ليك؟'
  ]);
  const [submittingPost, setSubmittingPost] = useState<boolean>(false);

  // Claim Form state inside drawer
  const [claimantName, setClaimantName] = useState<string>('');
  const [claimantPhone, setClaimantPhone] = useState<string>('');
  const [claimAnswers, setClaimAnswers] = useState<string[]>([]);
  const [claimExtraSpecs, setClaimExtraSpecs] = useState<string>('');
  const [submittingClaim, setSubmittingClaim] = useState<boolean>(false);
  const [claimSuccessBanner, setClaimSuccessBanner] = useState<string | null>(null);

  // Chat Input inside drawer
  const [chatInput, setChatInput] = useState<string>('');
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);

  // Image broken fallback state tracker
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      setLoading(true);
      const res = await fetch('/api/items');
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error('use_local_fallback');
      }
      const data: FoundItem[] = await res.json();
      const normalized = data.map((it) => ({
        ...it,
        imageUrl: normalizeImageUrl(it.imageUrl)
      }));
      setItems(normalized);
      saveLocalItems(normalized);
      setError(null);
    } catch {
      // Seamless fallback for static hosts like Vercel
      const localData = loadLocalItems();
      setItems(localData);
      saveLocalItems(localData);
      setError(null);
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCity = selectedCity === 'الكل' || item.city === selectedCity;
      const matchesCat = selectedCategory === 'الكل' || item.category === selectedCategory;
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.neighborhood.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.publicDescription.toLowerCase().includes(q);
      return matchesCity && matchesCat && matchesType && matchesQuery;
    });
  }, [items, selectedCity, selectedCategory, selectedType, searchQuery]);

  const stats = useMemo(() => {
    const totalFound = items.filter((i) => i.type === 'found').length;
    const totalVerifying = items.reduce((acc, i) => acc + i.claims.length, 0);
    const totalReturned = items.filter((i) => i.status === 'returned').length;
    return { totalFound, totalVerifying, totalReturned };
  }, [items]);

  function openItemDrawer(item: FoundItem, defaultTab?: 'claim' | 'verify_chat') {
    setActiveItem(item);
    setClaimAnswers(item.verificationQuestions.map(() => ''));
    setClaimExtraSpecs('');
    setClaimSuccessBanner(null);

    if (defaultTab) {
      setActiveTabInDrawer(defaultTab);
    } else if (item.claims.length > 0) {
      setActiveTabInDrawer('verify_chat');
    } else {
      setActiveTabInDrawer('claim');
    }

    if (item.claims.length > 0) {
      setSelectedClaimId(item.claims[0].id);
    } else {
      setSelectedClaimId(null);
    }
  }

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!postTitle.trim() || !postFinderName.trim()) return;

    const payload = {
      type: postType,
      title: postTitle.trim(),
      category: postCategory,
      city: postCity,
      neighborhood: postNeighborhood.trim() || 'وسط المدينة',
      dateFound: postDate,
      publicDescription: postDescription.trim(),
      imageUrl: postImageUrl,
      finderName: postFinderName.trim(),
      finderPhone: postFinderPhone.trim() || '0600-000000',
      verificationQuestions: postQuestions.filter((q) => q.trim().length > 0)
    };

    try {
      setSubmittingPost(true);
      let created: FoundItem | null = null;

      try {
        const res = await fetch('/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const apiItem: FoundItem = await res.json();
          created = {
            ...apiItem,
            imageUrl: normalizeImageUrl(apiItem.imageUrl)
          };
        }
      } catch {
        // Fallback to client storage on static Vercel deployment
      }

      if (!created) {
        created = {
          id: `item-${Date.now()}`,
          ...payload,
          verificationQuestions:
            payload.verificationQuestions.length > 0
              ? payload.verificationQuestions
              : ['شنو هي العلامة المميزة أو المواصفات الدقيقة ديال هاد الحاجة؟'],
          status: 'available',
          createdAt: new Date().toISOString(),
          claims: []
        };
      }

      const updatedList = [created, ...items];
      setItems(updatedList);
      saveLocalItems(updatedList);
      setIsPostModalOpen(false);
      setPostTitle('');
      setPostNeighborhood('');
      setPostDescription('');
      setPostQuestions([
        'شنو هي العلامة المميزة أو التفاصيل اللي ما بايناش فالتصويرة؟',
        'شنو كان لداخل بالضبط أو فين طاحت ليك؟'
      ]);
      openItemDrawer(created, 'claim');
    } finally {
      setSubmittingPost(false);
    }
  }

  async function handleSubmitClaim(e: React.FormEvent) {
    e.preventDefault();
    if (!activeItem || !claimantName.trim() || !claimantPhone.trim()) return;

    try {
      setSubmittingClaim(true);
      let updatedItem: FoundItem | null = null;
      let createdClaim: ClaimRequest | null = null;

      try {
        const res = await fetch(`/api/items/${activeItem.id}/claims`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            claimantName,
            claimantCity: activeItem.city,
            claimantContact: claimantPhone,
            answers: claimAnswers,
            extraSpecs: claimExtraSpecs
          })
        });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data: { item: FoundItem; claim: ClaimRequest } = await res.json();
          updatedItem = {
            ...data.item,
            imageUrl: normalizeImageUrl(data.item.imageUrl)
          };
          createdClaim = data.claim;
        }
      } catch {
        // Static fallback
      }

      if (!updatedItem || !createdClaim) {
        createdClaim = {
          id: `claim-${Date.now()}`,
          itemId: activeItem.id,
          claimantName: claimantName.trim(),
          claimantCity: activeItem.city,
          claimantContact: claimantPhone.trim(),
          answers: claimAnswers,
          extraSpecs: claimExtraSpecs.trim(),
          status: 'pending',
          createdAt: new Date().toISOString(),
          messages: [
            {
              id: `msg-${Date.now()}`,
              senderRole: 'claimant',
              senderName: claimantName.trim(),
              text: claimExtraSpecs.trim()
                ? `السلام عليكم، هادي راها ديالي. جاوبت على الأسئلة ديال المواصفات، وهادي تفاصيل إضافية: ${claimExtraSpecs.trim()}`
                : 'السلام عليكم، هادي راها ديالي وراني جاوبت على الأسئلة ديال المواصفات باش تتأكد.',
              timestamp: new Date().toLocaleTimeString('ar-MA', {
                hour: '2-digit',
                minute: '2-digit'
              })
            }
          ]
        };

        updatedItem = {
          ...activeItem,
          status: activeItem.status === 'available' ? 'verifying' : activeItem.status,
          claims: [createdClaim, ...activeItem.claims]
        };
      }

      const nextItems = items.map((it) => (it.id === updatedItem!.id ? updatedItem! : it));
      setItems(nextItems);
      saveLocalItems(nextItems);
      setActiveItem(updatedItem);
      setSelectedClaimId(createdClaim.id);
      setActiveTabInDrawer('verify_chat');
      setClaimSuccessBanner('تم إرسال الأجوبة ديالك على المواصفات! تقدر دابا تزيد تهضر فالشات باش تأكد ليه التفاصيل.');
      setClaimantName('');
      setClaimantPhone('');
    } finally {
      setSubmittingClaim(false);
    }
  }

  async function handleSendChatMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!activeItem || !selectedClaimId || !chatInput.trim()) return;

    const currentClaim = activeItem.claims.find((c) => c.id === selectedClaimId);
    if (!currentClaim) return;

    try {
      setSendingMessage(true);
      let updatedItem: FoundItem | null = null;

      try {
        const res = await fetch(`/api/items/${activeItem.id}/claims/${selectedClaimId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            senderRole: roleView,
            senderName: roleView === 'finder' ? activeItem.finderName : currentClaim.claimantName,
            text: chatInput
          })
        });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data: { item: FoundItem; claim: ClaimRequest } = await res.json();
          updatedItem = {
            ...data.item,
            imageUrl: normalizeImageUrl(data.item.imageUrl)
          };
        }
      } catch {
        // Static fallback
      }

      if (!updatedItem) {
        const newMsg = {
          id: `msg-${Date.now()}`,
          senderRole: roleView,
          senderName: roleView === 'finder' ? activeItem.finderName : currentClaim.claimantName,
          text: chatInput.trim(),
          timestamp: new Date().toLocaleTimeString('ar-MA', {
            hour: '2-digit',
            minute: '2-digit'
          })
        };

        updatedItem = {
          ...activeItem,
          claims: activeItem.claims.map((c) =>
            c.id === selectedClaimId ? { ...c, messages: [...c.messages, newMsg] } : c
          )
        };
      }

      const nextItems = items.map((it) => (it.id === updatedItem!.id ? updatedItem! : it));
      setItems(nextItems);
      saveLocalItems(nextItems);
      setActiveItem(updatedItem);
      setChatInput('');
    } finally {
      setSendingMessage(false);
    }
  }

  async function handleUpdateClaimStatus(claimId: string, status: 'approved' | 'rejected') {
    if (!activeItem) return;

    let updatedItem: FoundItem | null = null;

    try {
      const res = await fetch(`/api/items/${activeItem.id}/claims/${claimId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data: { item: FoundItem; claim: ClaimRequest } = await res.json();
        updatedItem = {
          ...data.item,
          imageUrl: normalizeImageUrl(data.item.imageUrl)
        };
      }
    } catch {
      // Static fallback
    }

    if (!updatedItem) {
      updatedItem = {
        ...activeItem,
        status: status === 'approved' ? 'returned' : activeItem.status,
        claims: activeItem.claims.map((c) => {
          if (c.id !== claimId) return c;
          const updatedMessages =
            status === 'approved'
              ? [
                  ...c.messages,
                  {
                    id: `msg-${Date.now()}`,
                    senderRole: 'finder' as const,
                    senderName: activeItem.finderName,
                    text: `تم التأكد من المواصفات بنجاح! مرحبا خويا/ختي ${c.claimantName}، تقدر تعيط ليا فـ ${activeItem.finderPhone} باش نتلاقاو ونسلمك الأمانة ديالك.`,
                    timestamp: new Date().toLocaleTimeString('ar-MA', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  }
                ]
              : c.messages;
          return { ...c, status, messages: updatedMessages };
        })
      };
    }

    const nextItems = items.map((it) => (it.id === updatedItem!.id ? updatedItem! : it));
    setItems(nextItems);
    saveLocalItems(nextItems);
    setActiveItem(updatedItem);
  }

  function handleCustomImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPostImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  const activeClaim = useMemo(() => {
    if (!activeItem || !selectedClaimId) return null;
    return activeItem.claims.find((c) => c.id === selectedClaimId) || null;
  }, [activeItem, selectedClaimId]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Top Bar Contract: 3 exact zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-6 py-4">
        <div className="max-w-[1320px] mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="text-xl font-bold tracking-tight text-black font-display whitespace-nowrap shrink-0"
          >
            أمانة المغرب
          </a>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
            <a
              href="#items-grid"
              onClick={() => setSelectedType('all')}
              className="hover:text-black hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              تصفح الإعلانات
            </a>
            <a
              href="#items-grid"
              onClick={() => setSelectedType('found')}
              className="hover:text-black hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              حوايج تْلقاو فزنقة
            </a>
            <a
              href="#items-grid"
              onClick={() => setSelectedType('lost')}
              className="hover:text-black hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              حوايج ضايعين
            </a>
            <a
              href="#how-it-works"
              className="hover:text-black hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              نظام التحقق بالمواصفات
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => {
                setPostType('found');
                setIsPostModalOpen(true);
              }}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-black rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              + حط حاجة لقيتيها
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="top" className="flex-1">
        {/* Section 1: Hero & City Search Command Center */}
        <section className="border-b border-neutral-200 bg-white">
          <div className="max-w-[1320px] mx-auto px-6 py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              {/* Right Column (RTL): Editorial Headline & Search */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-neutral-500 tracking-wide">
                    منصة المواطنة والأمانة فجميع المدن المغربية
                  </p>
                  <h1
                    className="font-display font-bold text-black leading-[1.2] tracking-tight"
                    style={{ fontSize: 'clamp(2rem, 3.6vw, 3.25rem)', textWrap: 'balance' }}
                  >
                    لقيتي شي حاجة فزنقة؟ حطها هنا، وتأكد من مولها الحقيقي بالمواصفات.
                  </h1>
                  <p className="text-base text-neutral-600 leading-relaxed max-w-2xl">
                    سواء لقيتي بزطام، تيليفون، ولا سوارت فالمدينة ديالك، حط إعلان بلا ما تبين كلشي. ملي يتواصل معاك اللي ضاعت ليه، سولو على المواصفات الدقيقة باش ترجع الأمانة لمولاها بكل ثقة.
                  </p>
                </div>

                {/* Search & City Filter Bar */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* Search input */}
                    <div className="sm:col-span-6 relative">
                      <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="قلب على بزطام، آيفون، المعاريف، أكدال..."
                        className="w-full pr-10 pl-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black"
                      />
                    </div>

                    {/* City selector */}
                    <div className="sm:col-span-4 relative">
                      <MapPin className="w-4 h-4 text-black absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full pr-10 pl-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm font-medium text-black focus:outline-none focus:border-black cursor-pointer"
                      >
                        {MOROCCAN_CITIES.map((city) => (
                          <option key={city} value={city}>
                            {city === 'الكل' ? 'جميع المدن المغربية' : city}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quick CTA */}
                    <div className="sm:col-span-2">
                      <a
                        href="#items-grid"
                        className="w-full h-full flex items-center justify-center px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0"
                      >
                        بحث
                      </a>
                    </div>
                  </div>

                  {/* Quick City Buttons */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <span className="text-xs text-neutral-500 whitespace-nowrap shrink-0 ml-1">
                      المدن الأكثر بحثاً:
                    </span>
                    {['الكل', 'الدار البيضاء', 'الرباط', 'مراكش', 'طنجة', 'فاس', 'أكادير'].map((city) => (
                      <button
                        key={city}
                        onClick={() => setSelectedCity(city)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          selectedCity === city
                            ? 'bg-black text-white'
                            : 'bg-white text-neutral-700 border border-neutral-300 hover:border-black hover:text-black'
                        }`}
                      >
                        {city === 'الكل' ? 'كل المدن' : city}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Left Column (RTL): Pure Black & White Featured Verification Card */}
              <div className="lg:col-span-5 flex">
                <div className="w-full bg-black text-white rounded-2xl p-6 flex flex-col justify-between border border-black">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span>نظام التحقق الذكي بالمواصفات</span>
                      <span>حماية من انتحال الملكية</span>
                    </div>
                    <h2 className="text-xl font-bold font-display text-white leading-snug">
                      كيفاش كتضمن بلي اللي تواصل معاك هو مول الحاجة بصح؟
                    </h2>
                    <p className="text-sm text-neutral-300 leading-relaxed">
                      فاش كتحط شي حاجة لقيتيها، كتزيد معاها أسئلة على مواصفات مخبية (مثلاً: شنو وسط البزطام؟ شنو الخلفية ديال التيليفون؟). أي واحد فالمدينة ديالك كيدخل يجاوب، وكتقدر تسولو مباشرة فالشات قبل ما تعطيه رقمك وتلاقاو.
                    </p>
                  </div>

                  {/* Interactive preview example */}
                  <div className="my-6 bg-neutral-900 rounded-xl p-4 border border-neutral-800 space-y-3">
                    <div className="text-xs text-white font-semibold">
                      مثال حي ديال سؤال التحقق قبل التسليم:
                    </div>
                    <p className="text-xs text-neutral-300">
                      «لقيت ساروت طوموبيل فـ أكدال. شنو مكتوب فالميدالية النحاسية اللي لاصقة فيه؟»
                    </p>
                    <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                      <span>المواصفات كتبقى سرية بينك وبين اللي كيطالب</span>
                      <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        setPostType('found');
                        setIsPostModalOpen(true);
                      }}
                      className="flex-1 py-2.5 px-4 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      لقيت شي حاجة بغيت نحطها
                    </button>
                    <button
                      onClick={() => {
                        setPostType('lost');
                        setIsPostModalOpen(true);
                      }}
                      className="py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg border border-neutral-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      ضاعت ليا حاجة
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-Width Metrics Strip Below Hero Split */}
            <div className="mt-10 pt-8 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-baseline justify-between sm:justify-start sm:gap-4">
                <span className="text-2xl font-bold font-mono-num text-black">
                  {stats.totalFound}
                </span>
                <span className="text-xs text-neutral-600">
                  إعلانات ديال حوايج تلقاو فالشارع هاد الأسبوع
                </span>
              </div>
              <div className="flex items-baseline justify-between sm:justify-start sm:gap-4">
                <span className="text-2xl font-bold font-mono-num text-black">
                  {stats.totalVerifying}
                </span>
                <span className="text-xs text-neutral-600">
                  محادثات تحقق من المواصفات جارية دابا
                </span>
              </div>
              <div className="flex items-baseline justify-between sm:justify-start sm:gap-4">
                <span className="text-2xl font-bold font-mono-num text-black">
                  {stats.totalReturned}
                </span>
                <span className="text-xs text-neutral-600">
                  أمانات رجعات لماليها بعد التأكد من المواصفات
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Main Catalog & Interactive Filter Toolbar */}
        <section id="items-grid" className="max-w-[1320px] mx-auto px-6 py-12">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-neutral-200">
            <div>
              <h2 className="text-2xl font-bold font-display text-black">
                الإعلانات فمدينتك ({filteredItems.length})
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                كليكي على أي غرض باش تجاوب على أسئلة المواصفات أو تواصل مع مول الإعلان
              </p>
            </div>

            {/* Interactive Segmented Type Control */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 p-1 bg-neutral-100 border border-neutral-200 rounded-lg">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedType === 'all'
                      ? 'bg-black text-white'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setSelectedType('found')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedType === 'found'
                      ? 'bg-black text-white'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  حوايج تلقاو فزنقة
                </button>
                <button
                  onClick={() => setSelectedType('lost')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedType === 'lost'
                      ? 'bg-black text-white'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  حوايج ضايعين
                </button>
              </div>

              {/* Category Select */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3.5 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-medium text-black focus:outline-none focus:border-black cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'الكل' ? 'جميع الأصناف' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Error state if any */}
          {error && (
            <div className="my-6 p-4 bg-neutral-100 border border-black rounded-xl flex items-center justify-between text-sm text-black">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-xs font-semibold underline cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          )}

          {/* Loading / Empty / 3-Column Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white border border-neutral-200 rounded-xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] bg-neutral-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-neutral-100 rounded w-1/2" />
                    <div className="h-5 bg-neutral-100 rounded w-3/4" />
                    <div className="h-4 bg-neutral-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="my-12 bg-white border border-neutral-200 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
              <p className="text-base font-semibold text-black">
                ما كاين حتى إعلان مطابق لهاد البحث فهاد الساعة
              </p>
              <p className="text-sm text-neutral-500">
                جرب تبدل المدينة أو الصنف، أو حط إعلان جديد إلى لقيتي ولا ضاعت ليك شي حاجة.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSelectedCity('الكل');
                    setSelectedCategory('الكل');
                    setSelectedType('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 text-xs font-medium text-black bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-lg transition-colors cursor-pointer"
                >
                  إعادة ضبط الفلاتر
                </button>
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-black hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                >
                  + نشر إعلان جديد
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  onClick={() => openItemDrawer(item)}
                  className="group bg-white border border-neutral-200 hover:border-black rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-150 hover:-translate-y-0.5 cursor-pointer"
                >
                  <div>
                    {/* 4:3 Image Container with Zero-Broken-Image Fallback */}
                    <div className="aspect-[4/3] w-full bg-neutral-100 relative overflow-hidden border-b border-neutral-200">
                      {!brokenImages[item.id] ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setBrokenImages((prev) => ({ ...prev, [item.id]: true }))
                          }
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 text-neutral-600 p-6 text-center">
                          <PackageCheck className="w-8 h-8 mb-2 text-black" />
                          <span className="text-xs font-medium">{item.title}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Body — Zero-Pill Discipline: Unboxed metadata with · separators */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center flex-wrap gap-1.5 text-xs text-neutral-500">
                        <span className="font-semibold text-black">{item.city}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.neighborhood}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.category}</span>
                      </div>

                      <h3 className="text-base font-bold font-display text-black group-hover:underline underline-offset-4 transition-colors line-clamp-1">
                        {item.title}
                      </h3>

                      <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                        {item.publicDescription}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-3.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-600">
                      <span>
                        {item.type === 'found' ? `لقاه: ${item.finderName}` : `كيقلب عليه: ${item.finderName}`}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num">{item.dateFound}</span>
                    </div>

                    <div className="font-semibold text-black flex items-center gap-1 whitespace-nowrap shrink-0">
                      {item.status === 'returned' ? (
                        <span className="underline">رجعات لمولاها ✓</span>
                      ) : item.claims.length > 0 ? (
                        <span>{item.claims.length} طلبات تحقق ←</span>
                      ) : (
                        <span>تواصل وعطي المواصفات ←</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Section 3: How Verification Works (Editorial 3-Step Guide) */}
        <section id="how-it-works" className="bg-neutral-50 border-t border-neutral-200 py-16">
          <div className="max-w-[1320px] mx-auto px-6">
            <div className="max-w-2xl space-y-2 mb-10">
              <h2 className="text-2xl font-bold font-display text-black">
                كيفاش كيخدم الموقع باش ترجع الأمانة لمولاها؟
              </h2>
              <p className="text-sm text-neutral-600">
                ثلاثة ديال المراحل بسيطة كتخلي أي واحد فمدينتك يلقى حاجتو بلا ما يطمع فيها شي حد آخر.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 pt-4 border-t border-black">
                <div className="text-sm font-bold font-mono-num text-black">01.</div>
                <h3 className="text-base font-bold font-display text-black">
                  نشر الحاجة اللي لقيتيها فزنقة بلا ما تكشف كلشي
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  حط تصويرة عامة والحي اللي لقيتيها فيه فمدينتك، وخلي شي مواصفات سرية (بحال شحال ديال الفلوس، أو شنو مكتوب فالوثائق، أو لون البوشيط الدخلاني).
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-black">
                <div className="text-sm font-bold font-mono-num text-black">02.</div>
                <h3 className="text-base font-bold font-display text-black">
                  اللي ضاعت ليه كيدخل يجاوب على أسئلة المواصفات
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  ملي كيدخل ولد مدينتك ويقلب، كيكليكي على «هادي ديالي» وكيجاوب على الأسئلة اللي حطيتي، وكيزيد يكتب ليك العلامات المميزة اللي كيعرفها غير هو.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-black">
                <div className="text-sm font-bold font-mono-num text-black">03.</div>
                <h3 className="text-base font-bold font-display text-black">
                  سولو فالشات وتأكد عاد تلاقاو
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  كتقرا الأجوبة ديالو وتقدر تزيد تسولو مباشرة فالمحادثة ديال الموقع. غير تتأكد بلي هو مول الأمانة، كتوافق على الطلب وكيطلع ليه رقمك باش يتسلمها.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="bg-white border-t border-neutral-200 py-8 px-6 text-xs text-neutral-500">
        <div className="max-w-[1320px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-black font-medium">
            أمانة المغرب — مبادرة مجتمعية للمفقودات والموجودات فجميع المدن المغربية
          </div>
          <div className="flex items-center gap-6">
            <a href="#top" className="hover:text-black transition-colors">
              الرئيسية
            </a>
            <a href="#items-grid" className="hover:text-black transition-colors">
              الإعلانات
            </a>
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="hover:text-black transition-colors cursor-pointer"
            >
              إضافة إعلان
            </button>
          </div>
        </div>
      </footer>

      {/* Slide-Over Detail & Specification Verification Drawer */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex justify-start bg-black/60 backdrop-blur-xs"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col justify-between border-l border-neutral-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Drawer Header */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span className="font-semibold text-black">{activeItem.city}</span>
                <span aria-hidden="true">·</span>
                <span>{activeItem.neighborhood}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-num">{activeItem.dateFound}</span>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="px-3 py-1.5 text-xs font-semibold text-black hover:bg-neutral-200 bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              >
                إغلاق ✕
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6 flex-1">
              {/* Item Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                <div className="sm:col-span-5 aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                  {!brokenImages[activeItem.id] ? (
                    <img
                      src={activeItem.imageUrl}
                      alt={activeItem.title}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setBrokenImages((prev) => ({ ...prev, [activeItem.id]: true }))
                      }
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500">
                      {activeItem.title}
                    </div>
                  )}
                </div>

                <div className="sm:col-span-7 space-y-3">
                  <div className="text-xs font-semibold text-neutral-500">
                    {activeItem.type === 'found' ? 'غرض معثور عليه فزنقة' : 'غرض ضايع كيقلب عليه مولاه'}
                  </div>
                  <h2 className="text-xl font-bold font-display text-black">
                    {activeItem.title}
                  </h2>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {activeItem.publicDescription}
                  </p>
                  <div className="pt-2 flex items-center gap-3 text-xs text-neutral-500 border-t border-neutral-200">
                    <span>مول الإعلان: <strong className="text-black">{activeItem.finderName}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>
                      الحالة:{' '}
                      <strong className="text-black">
                        {activeItem.status === 'returned'
                          ? 'تم تسليم الأمانة لمولاها'
                          : activeItem.status === 'verifying'
                          ? 'جاري التحقق من المواصفات'
                          : 'متاح للتحقق'}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs inside Drawer */}
              <div className="flex items-center gap-2 p-1 bg-neutral-100 border border-neutral-200 rounded-xl">
                <button
                  onClick={() => setActiveTabInDrawer('claim')}
                  className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTabInDrawer === 'claim'
                      ? 'bg-black text-white'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  1. هادي ديالي (جاوب على المواصفات)
                </button>
                <button
                  onClick={() => setActiveTabInDrawer('verify_chat')}
                  className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTabInDrawer === 'verify_chat'
                      ? 'bg-black text-white'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  2. محادثة التحقق والأسئلة ({activeItem.claims.length})
                </button>
              </div>

              {/* Tab 1: Submit Answers to Finder's Specification Questions */}
              {activeTabInDrawer === 'claim' && (
                <form onSubmit={handleSubmitClaim} className="space-y-5 bg-neutral-50 p-5 rounded-xl border border-neutral-200">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold font-display text-black">
                      إثبات الملكية عن طريق المواصفات
                    </h3>
                    <p className="text-xs text-neutral-600">
                      {activeItem.finderName} حط هاد الأسئلة باش يتأكد بلي نتا هو مول الحاجة قبل ما يتلاقى معاك:
                    </p>
                  </div>

                  {/* Dynamic Questions from Finder */}
                  <div className="space-y-4">
                    {activeItem.verificationQuestions.map((question, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <label className="block text-xs font-semibold text-black">
                          سؤال {idx + 1}: {question}
                        </label>
                        <input
                          type="text"
                          required
                          value={claimAnswers[idx] || ''}
                          onChange={(e) => {
                            const updated = [...claimAnswers];
                            updated[idx] = e.target.value;
                            setClaimAnswers(updated);
                          }}
                          placeholder="كتب الجواب الدقيق هنا..."
                          className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-black">
                      واش كاينة شي أمارة أو مواصفات أخرى بغيتي تزيدها؟
                    </label>
                    <textarea
                      rows={2}
                      value={claimExtraSpecs}
                      onChange={(e) => setClaimExtraSpecs(e.target.value)}
                      placeholder="مثلاً: فيها واحد الخدشة صغيرة من اللور، أو طاحت ليا مع ديك الساعة..."
                      className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-200">
                    <div>
                      <label className="block text-xs font-semibold text-black mb-1">
                        السمية ديالك الكاملة *
                      </label>
                      <input
                        type="text"
                        required
                        value={claimantName}
                        onChange={(e) => setClaimantName(e.target.value)}
                        placeholder="مثلاً: أمين التازي"
                        className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-black mb-1">
                        رقم التيليفون ديالك للتواصل *
                      </label>
                      <input
                        type="text"
                        required
                        value={claimantPhone}
                        onChange={(e) => setClaimantPhone(e.target.value)}
                        placeholder="06XXXXXXXX"
                        className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingClaim}
                    className="w-full py-3 px-4 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    {submittingClaim ? 'جاري الإرسال...' : 'صيفط المواصفات وبدا المحادثة مع اللي لقاها'}
                  </button>
                </form>
              )}

              {/* Tab 2: Verification Q&A & Live Chat between Finder and Claimant */}
              {activeTabInDrawer === 'verify_chat' && (
                <div className="space-y-5">
                  {claimSuccessBanner && (
                    <div className="p-3.5 bg-neutral-100 border border-black rounded-xl text-xs font-medium text-black">
                      {claimSuccessBanner}
                    </div>
                  )}

                  {activeItem.claims.length === 0 ? (
                    <div className="p-8 bg-neutral-50 border border-neutral-200 rounded-xl text-center space-y-3">
                      <p className="text-sm font-semibold text-black">
                        باقي حتى واحد ما صيفط مواصفات لهاد الحاجة
                      </p>
                      <p className="text-xs text-neutral-600">
                        إلى كانت هاد الحاجة ديالك، جاوب على أسئلة المواصفات فالتبويب الأول باش تفتح محادثة مع {activeItem.finderName}.
                      </p>
                      <button
                        onClick={() => setActiveTabInDrawer('claim')}
                        className="px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        جاوب على المواصفات دابا
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Switch between multiple claimants if more than 1 */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 overflow-x-auto">
                          <span className="text-xs text-neutral-500">طلبات التحقق:</span>
                          {activeItem.claims.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => setSelectedClaimId(c.id)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                                selectedClaimId === c.id
                                  ? 'bg-black text-white border-black'
                                  : 'bg-white text-black border-neutral-300'
                              }`}
                            >
                              {c.claimantName}
                            </button>
                          ))}
                        </div>

                        {/* Role switcher */}
                        <div className="flex items-center gap-1 bg-neutral-100 border border-neutral-200 p-1 rounded-lg text-xs">
                          <button
                            onClick={() => setRoleView('finder')}
                            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                              roleView === 'finder'
                                ? 'bg-black text-white'
                                : 'text-neutral-600 hover:text-black'
                            }`}
                          >
                            وضع اللي لقا الحاجة ({activeItem.finderName})
                          </button>
                          <button
                            onClick={() => setRoleView('claimant')}
                            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                              roleView === 'claimant'
                                ? 'bg-black text-white'
                                : 'text-neutral-600 hover:text-black'
                            }`}
                          >
                            وضع مول الحاجة
                          </button>
                        </div>
                      </div>

                      {activeClaim && (
                        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 space-y-5">
                          {/* Claimant's submitted answers sheet */}
                          <div className="bg-white border border-neutral-200 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
                              <div>
                                <span className="text-xs font-bold text-black">
                                  الأجوبة اللي صيفط {activeClaim.claimantName}
                                </span>
                                <span className="text-xs text-neutral-500 mr-2">
                                  ({activeClaim.claimantCity})
                                </span>
                              </div>
                              <span className="text-xs font-semibold text-black">
                                {activeClaim.status === 'approved'
                                  ? 'تمت المصادقة على المواصفات ✓'
                                  : activeClaim.status === 'rejected'
                                  ? 'المواصفات غير مطابقة ✕'
                                  : 'في انتظار التأكيد'}
                              </span>
                            </div>

                            <div className="space-y-2.5 text-xs">
                              {activeItem.verificationQuestions.map((q, i) => (
                                <div key={i} className="space-y-0.5">
                                  <div className="text-neutral-500">س: {q}</div>
                                  <div className="font-semibold text-black">
                                    ج: {activeClaim.answers[i] || '—'}
                                  </div>
                                </div>
                              ))}
                              {activeClaim.extraSpecs && (
                                <div className="pt-2 border-t border-neutral-200">
                                  <span className="text-neutral-500">مواصفات إضافية: </span>
                                  <span className="font-semibold text-black">
                                    {activeClaim.extraSpecs}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Finder Verification Decision Controls */}
                            <div className="pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
                              {activeClaim.status === 'approved' ? (
                                <div className="w-full p-3 bg-black text-white rounded-lg text-xs flex items-center justify-between">
                                  <span>
                                    تم التأكد! رقم التيليفون للتسليم المباشر:{' '}
                                    <strong className="font-mono-num underline">{activeItem.finderPhone}</strong> /{' '}
                                    <strong className="font-mono-num underline">{activeClaim.claimantContact}</strong>
                                  </span>
                                  <Phone className="w-4 h-4 text-white" />
                                </div>
                              ) : (
                                <>
                                  <span className="text-xs text-neutral-600">
                                    واش المواصفات صحيحة؟ تقدر تزيد تسولو فالشات لتحت أو تصادق على الطلب:
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        handleUpdateClaimStatus(activeClaim.id, 'approved')
                                      }
                                      className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                                    >
                                      ✓ المواصفات صحيحة (كشف الرقم)
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleUpdateClaimStatus(activeClaim.id, 'rejected')
                                      }
                                      className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-black border border-neutral-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                                    >
                                      غير مطابقة ✕
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Conversation Messages */}
                          <div className="space-y-3">
                            <div className="text-xs font-semibold text-black">
                              المحادثة المباشرة للتحقق من التفاصيل:
                            </div>

                            <div className="space-y-2.5 max-h-64 overflow-y-auto p-1">
                              {activeClaim.messages.map((m) => {
                                const isFinder = m.senderRole === 'finder';
                                return (
                                  <div
                                    key={m.id}
                                    className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
                                      isFinder
                                        ? 'bg-black text-white border-black mr-6'
                                        : 'bg-white text-black border-neutral-300 ml-6'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-1 opacity-75 text-[11px]">
                                      <span className="font-semibold">
                                        {m.senderName} ({isFinder ? 'اللي لقا الحاجة' : 'المطالب بالحاجة'})
                                      </span>
                                      <span className="font-mono-num">{m.timestamp}</span>
                                    </div>
                                    <p>{m.text}</p>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Chat Input Form */}
                            <form onSubmit={handleSendChatMessage} className="flex gap-2 pt-2">
                              <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder={
                                  roleView === 'finder'
                                    ? 'سولو على شي تفصيل آخر فالحاجة باش تتأكد (مثلاً: أشمن لون...)...'
                                    : 'جاوب مول الإعلان على المواصفات اللي سولك عليها...'
                                }
                                className="flex-1 px-3.5 py-2.5 bg-white border border-neutral-300 rounded-lg text-xs text-black focus:outline-none focus:border-black"
                              />
                              <button
                                type="submit"
                                disabled={sendingMessage}
                                className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                              >
                                إرسال
                              </button>
                            </form>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Post Found / Lost Item Modal */}
      {isPostModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
          onClick={() => setIsPostModalOpen(false)}
        >
          <div
            className="bg-white border border-neutral-300 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-xl my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div>
                <h2 className="text-lg font-bold font-display text-black">
                  حط إعلان جديد فمدينتك
                </h2>
                <p className="text-xs text-neutral-500">
                  حدد الأسئلة ديال المواصفات اللي غادي تسولهم لأي واحد تواصل معاك
                </p>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="px-3 py-1 text-xs font-semibold text-black bg-neutral-100 hover:bg-neutral-200 rounded-lg cursor-pointer"
              >
                إغلاق ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 border border-neutral-200 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPostType('found')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    postType === 'found'
                      ? 'bg-black text-white'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  لقيت حاجة فزنقة
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('lost')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    postType === 'lost'
                      ? 'bg-black text-white'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  ضاعت ليا حاجة
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-black mb-1">
                    شنو هي الحاجة؟ *
                  </label>
                  <input
                    type="text"
                    required
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="مثلاً: بزطام قهوي، ساروت طوموبيل..."
                    className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-black mb-1">
                    الصنف
                  </label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                  >
                    {CATEGORIES.filter((c) => c !== 'الكل').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-black mb-1">
                    المدينة *
                  </label>
                  <select
                    value={postCity}
                    onChange={(e) => setPostCity(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                  >
                    {MOROCCAN_CITIES.filter((c) => c !== 'الكل').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-black mb-1">
                    الحي أو البلاصة بالضبط *
                  </label>
                  <input
                    type="text"
                    required
                    value={postNeighborhood}
                    onChange={(e) => setPostNeighborhood(e.target.value)}
                    placeholder="مثلاً: المعاريف، باب دكالة..."
                    className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-black mb-1">
                    التاريخ
                  </label>
                  <input
                    type="date"
                    value={postDate}
                    onChange={(e) => setPostDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-mono-num text-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-black mb-1">
                  وصف عام (بلا ما تذكر التفاصيل السرية اللي غتسول عليها)
                </label>
                <textarea
                  rows={2}
                  required
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                  placeholder="وصف فين لقيتيها وكيفاش يقدر مولاها يعرفها..."
                  className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                />
              </div>

              {/* Image selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-black">
                  اختار تصويرة تقريبية أو تيليشارجي تصويرة من عندك
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setPostImageUrl(preset.url)}
                      className={`px-3 py-1.5 text-xs rounded-lg border whitespace-nowrap shrink-0 cursor-pointer ${
                        postImageUrl === preset.url
                          ? 'bg-black text-white border-black'
                          : 'bg-neutral-50 text-black border-neutral-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                  <label className="px-3 py-1.5 text-xs rounded-lg border border-dashed border-neutral-400 text-black hover:bg-neutral-100 cursor-pointer whitespace-nowrap shrink-0">
                    + رفع صورة من جهازك
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Verification Questions Builder */}
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-black">
                    أسئلة التحقق من المواصفات (غادي يجاوب عليها اللي تواصل معاك)
                  </label>
                  <button
                    type="button"
                    onClick={() => setPostQuestions((prev) => [...prev, ''])}
                    className="text-xs font-semibold text-black underline cursor-pointer"
                  >
                    + زيد سؤال آخر
                  </button>
                </div>

                {postQuestions.map((q, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={q}
                      onChange={(e) => {
                        const copy = [...postQuestions];
                        copy[idx] = e.target.value;
                        setPostQuestions(copy);
                      }}
                      placeholder={`سؤال المواصفات رقم ${idx + 1}...`}
                      className="flex-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs text-black focus:outline-none focus:border-black"
                    />
                    {postQuestions.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setPostQuestions((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="text-xs text-black underline px-2 py-1 hover:bg-neutral-200 rounded cursor-pointer"
                      >
                        حذف
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Finder Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-black mb-1">
                    السمية ديالك *
                  </label>
                  <input
                    type="text"
                    required
                    value={postFinderName}
                    onChange={(e) => setPostFinderName(e.target.value)}
                    placeholder="مثلاً: محمد آيت بن سعيد"
                    className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black mb-1">
                    رقم التيليفون (ما كيطلعش حتى توافق على المواصفات) *
                  </label>
                  <input
                    type="text"
                    required
                    value={postFinderPhone}
                    onChange={(e) => setPostFinderPhone(e.target.value)}
                    placeholder="06XXXXXXXX"
                    className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-medium text-black bg-neutral-100 hover:bg-neutral-200 rounded-lg cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submittingPost}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-black hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                >
                  {submittingPost ? 'جاري النشر...' : 'نشر الإعلان فالموقع'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
