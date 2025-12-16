import React, { useState, useEffect, useRef } from 'react';
import { 
  Plane, 
  Backpack, 
  Map, 
  Utensils, 
  AlertTriangle, 
  CheckCircle2, 
  Circle, 
  Thermometer, 
  ShoppingBag, 
  Copy, 
  Check,
  ChevronDown,
  ChevronUp,
  Snowflake,
  Wind,
  ShieldAlert,
  Home,
  Navigation,
  Flame,
  PartyPopper,
  CalendarDays,
  MapPin,
  Moon,
  Sun,
  Phone,
  Image as ImageIcon,
  Coins,
  Bus,
  Train,
  Car,
  Footprints,
  Smartphone,
  Camera,
  HelpCircle,
  X,
  Share,
  Menu
} from 'lucide-react';

// --- Data Structures ---

// Updated Rates (Approximate for Late 2025 / Current trends)
const currencyConfig = {
  TWD: { rate: 1, label: "TWD (台幣)", color: "text-slate-300" },
  CNY: { rate: 0.222, label: "CNY (人民幣)", color: "text-emerald-400" }, 
  EUR: { rate: 0.029, label: "EUR (歐元)", color: "text-blue-400" },    
  ISK: { rate: 4.35, label: "ISK (冰島克朗)", color: "text-purple-400" }   
};

const packingList = [
  {
    category: "隨身背包 (Carry-On)",
    note: "👮‍♂️ 座艙長監修：絕對不能託運",
    icon: <Backpack className="w-5 h-5" />,
    items: [
      { name: "護照 + 台胞證", spec: "正本", reason: "⚠️ 生死關鍵。沒台胞證進不了上海，護照效期需>6個月。" },
      { name: "英文保險證明", spec: "紙本 1 份", reason: "海關抽查用 (含申根醫療、不便險、突發疾病)。" },
      { name: "行動電源", spec: "1-2 顆", reason: "⚠️ 嚴禁託運。必須有清晰標示 (如10000mAh)，否則上海沒收。" },
      { name: "現金 (歐元)", spec: "約 €200", reason: "換小面額 (5/10/20歐)，應付歐洲投幣廁所、市集小吃。" },
      { name: "信用卡", spec: "2-3 張", reason: "務必開通「4位數預借現金密碼 (PIN Code)」 (歐洲機器買票用)。" },
      { name: "原子筆", spec: "1 支", reason: "填寫入境卡用 (飛機上空姐很忙，自己帶最快)。" },
      { name: "保溫瓶 (空)", spec: "1 支", reason: "過安檢後裝水。冰島冷水是頂級冰河水 (熱水有硫磺味不能喝)。" },
      { name: "含糖零食", spec: "軟糖/巧克力", reason: "解救低血糖，或是荷蘭「飛行」後的解毒劑。" },
      { name: "保濕小物", spec: "<100ml", reason: "護唇膏、小罐乳液、人工淚液。機艙和冰島極乾。" },
      { name: "手機掛繩", spec: "1 條", reason: "⚠️ 獨旅必備。防搶、防手滑掉進冰河/雪地/藍湖裡。" },
    ]
  },
  {
    category: "衣物與穿搭 (託運行李)",
    note: "🧢 導遊監修：16天冬旅，洋蔥式穿法",
    icon: <Snowflake className="w-5 h-5" />,
    items: [
      { name: "發熱衣", spec: "4-5 件", reason: "Uniqlo Ultra Warm 等級。貼身穿，這是保暖地基。" },
      { name: "中層刷毛/毛衣", spec: "3 件", reason: "1件 Fleece 刷毛(冰島活動用) + 2件好看毛衣(城市拍照用)。" },
      { name: "輕羽絨背心", spec: "1 件", reason: "神物！穿在發熱衣跟外套中間，核心保暖最強。" },
      { name: "Gore-Tex 外套", spec: "1 件", reason: "必須防風+防水+有帽子。這是你在冰島擋風雪的龜殼。" },
      { name: "發熱褲 (Legging)", spec: "3-4 件", reason: "穿在褲子裡面。絕對不要讓皮膚直接接觸外褲。" },
      { name: "防水防風外褲", spec: "1 件", reason: "冰島必備！薄的防水材質。套在最外面，去瀑布/冰川才不會濕冷致死。" },
      { name: "羊毛襪", spec: "4-5 雙", reason: "如 Smartwool。厚底、保暖、穿多天不臭。拋棄一般棉襪。" },
      { name: "高筒防水靴", spec: "1 雙", reason: "Gore-Tex 防水 + 高筒保護腳踝。冰島路滑必備。" },
      { name: "室內拖鞋", spec: "1 雙", reason: "飛機上換穿、歐洲飯店通常不提供拖鞋。" },
      { name: "毛帽/圍脖/手套", spec: "各 1-2 組", reason: "帽子要蓋耳、圍脖遮口鼻、手套要防水且可觸控手機。" },
      { name: "免洗內褲", spec: "15 件", reason: "穿完即丟，減輕回程行李重量裝戰利品。" },
      { name: "泳衣+泳帽", spec: "1 組", reason: "藍湖溫泉用。帶防水袋裝濕泳衣。" },
    ]
  },
  {
    category: "生活與飲食 (Essentials)",
    note: "🛠️ 工具人監修：解決生活不便",
    icon: <Utensils className="w-5 h-5" />,
    items: [
      { name: "簡易冰爪", spec: "1 副", reason: "迪卡儂有賣。套在鞋底，冰島地面結冰是溜冰場，保命防摔。" },
      { name: "歐規轉接頭", spec: "2 個", reason: "雙圓孔 (Type C/F)。荷蘭冰島通用。帶2個以防搞丟。" },
      { name: "潤髮乳", spec: "大罐", reason: "藍湖救星。下水前厚塗頭髮綁起來，防止頭髮變鋼絲。" },
      { name: "牙刷牙膏", spec: "1 組", reason: "歐洲飯店不提供。上海轉機飯店可能有，但自備最穩。" },
      { name: "環保購物袋", spec: "1 個", reason: "歐洲超市塑膠袋要錢。" },
      { name: "泡麵 (無肉)", spec: "3-4 包", reason: "海鮮或素食口味。避開牛肉豬肉以免過海關麻煩。宵夜救星。" },
      { name: "康寶濃湯", spec: "數包", reason: "冰島想喝熱湯時，用熱水沖開超幸福。" },
      { name: "暖暖包", spec: "10 包", reason: "貼式。手機太冷會關機，貼一個在手機背面有奇效。" },
    ]
  }
];

const usefulApps = [
  { name: "9292", desc: "荷蘭交通神器，整合火車/公車/電車即時時刻表。", icon: <Train className="w-4 h-4"/> },
  { name: "NS", desc: "荷蘭國鐵 App，查火車班次與月台變更最準。", icon: <Train className="w-4 h-4"/> },
  { name: "Vedur", desc: "冰島氣象局官方 App，極光與風暴警報必看。", icon: <Wind className="w-4 h-4"/> },
  { name: "Road.is (Faerð & Veður)", desc: "冰島路況 App，即時顯示封路與結冰狀況。", icon: <Map className="w-4 h-4"/> },
  { name: "112 Iceland", desc: "冰島緊急救援 App，可一鍵發送 GPS 定位給搜救隊。", icon: <ShieldAlert className="w-4 h-4"/> },
  { name: "Aurora", desc: "極光預測 App，設定通知以免睡過頭錯過極光。", icon: <Moon className="w-4 h-4"/> }
];

const itineraryDays = [
  {
    day: "Day 0",
    date: "Preparation",
    title: "出發前必做",
    color: "border-yellow-500 bg-slate-800",
    activeColor: "bg-yellow-600",
    weather: { temp: "N/A", cond: "檢查清單", aurora: null },
    events: [
      {
        time: "Anytime", loc: "Home", title: "文件與預約檢查",
        action: [
          { text: "保險購買：申根險 (>3萬歐元) + 海外突發 + 不便險" },
          { text: "門票預約：Rijksmuseum (12/22)、Blue Lagoon" },
          { text: "車票預約：Flybus (12/23 機場-藍湖-市區 & 1/1 凌晨04:30)" },
          { text: "App 下載：9292 (荷蘭交通)、Vedur (冰島天氣)、112 Iceland" },
          { text: "App 設定：Alipay 綁定完成、下載高德地圖 (上海用)" }
        ],
        tip: "請務必將所有紙本文件影印一份備份，與正本分開放。"
      }
    ]
  },
  {
    day: "Day 1",
    date: "12/20 (Sat)",
    title: "台北出發",
    color: "border-red-500 bg-slate-800",
    activeColor: "bg-red-600",
    weather: { temp: "20°C", cond: "舒適", aurora: null },
    events: [
      { 
        time: "15:40", loc: "TPE 桃園機場", title: "東航報到", 
        action: [
          { text: "找東航櫃檯報到" },
          { text: "證件：護照+台胞證 (正本)" },
          { text: "託運：告知行李掛到上海 (PVG) 並領出" },
          { text: "檢查：隨身背包確認無打火機/刀剪" }
        ], 
        dialogue: { en: "I need to pick up my luggage in Shanghai (PVG) for an overnight stay. Please do not check it through to Amsterdam.", cn: "我要在上海入境過夜，請幫我把行李掛到上海浦東 (PVG) 就好，不要直掛阿姆斯特丹。" }
      },
      { 
        time: "20:25", loc: "PVG 上海浦東", title: "上海入境 & 入住", 
        action: [
          { text: "走「港澳台」通道入境" },
          { text: "領取託運行李" },
          { text: "支付：買水/打車用支付寶" },
          { text: "聯絡飯店接駁車 (如家精選)", nav: "如家精選酒店上海浦東機場東站店" }
        ], 
        stay: "如家精選酒店 (浦東機場東站店)", stayPhone: "+86-13301676819" 
      }
    ]
  },
  {
    day: "Day 2",
    date: "12/21 (Sun)",
    title: "飛往荷蘭",
    color: "border-orange-500 bg-slate-800",
    activeColor: "bg-orange-600",
    weather: { temp: "6°C", cond: "陰雨", aurora: null },
    events: [
      { 
        time: "09:30", loc: "PVG 上海浦東", title: "上海安檢 & 登機", 
        action: [
          { text: "重新託運 (掛到 AMS)" },
          { text: "安檢：雨傘/電腦/行動電源全拿出來" }
        ], 
        dialogue: { en: "These are travel bottles, less than 100ml each.", cn: "這些是旅行分裝瓶，容量都小於 100ml。" }
      },
      { 
        time: "17:45", loc: "AMS 史基浦機場", title: "抵達阿姆斯特丹", 
        action: [
          { text: "海關：主動出示護照、回程機票、住宿單" },
          { text: "方案A：搭 NS Sprinter 火車到 Lelylaan", icon: <Train className="w-4 h-4"/> },
          { text: "轉乘：Tram 1 (往 Muiderpoort) 到 Eerste Constantijn Huygensstraat", nav: "Eerste Constantijn Huygensstraat", icon: <Train className="w-4 h-4"/> },
          { text: "方案B：搭 Bus 397 直達 Leidseplein (萊頓廣場)", nav: "Leidseplein", icon: <Bus className="w-4 h-4"/> }
        ], 
        tip: "荷蘭交通支援 OVpay：直接使用 Contactless 信用卡 (Visa/Master) 上下車刷卡即可，不需買交通卡。",
        dialogue: { en: "Q: Purpose? A: Tourism.\nQ: How long? A: 15 days, fly back Jan 4th.", cn: "問：目的？答：旅遊。\n問：多久？答：15天，1月4號飛回去。" }, 
        stay: "Hotel Abba", stayPhone: "+31-20-618-3058" 
      },
      { 
        time: "21:00", loc: "Leidseplein", title: "光影節 & Coffeeshop", 
        action: [
          { text: "Coffeeshop Vondel：買 'Pure Joint' (純菸)", nav: "Coffeeshop Vondel Amsterdam" },
          { text: "步行去萊頓廣場 (Leidseplein) 看光影節", nav: "Leidseplein Amsterdam", icon: <Footprints className="w-4 h-4"/> },
          { text: "回飯店陽台再使用 (安全第一)" }
        ]
      }
    ]
  },
  {
    day: "Day 3",
    date: "12/22 (Mon)",
    title: "阿姆斯特丹文化日",
    color: "border-orange-500 bg-slate-800",
    activeColor: "bg-orange-600",
    weather: { temp: "5°C", cond: "多雲", aurora: null },
    events: [
      { 
        time: "09:30", loc: "Rijksmuseum", title: "國家博物館", 
        action: [
          { text: "交通：Tram 1 / 7 / 19 到 Spiegelgracht 站", icon: <Train className="w-4 h-4"/> },
          { text: "憑預約看《夜巡》", nav: "Rijksmuseum Amsterdam" },
          { text: "Cuypers Library 拍照", nav: "Cuypers Library" }
        ], 
        tip: "荷蘭水龍頭冷水可直接生飲 (Tap Water)。"
      },
      { 
        time: "12:00", loc: "Fabel Friet", title: "網紅薯條", 
        action: [
          { text: "交通：步行前往九小街 (The 9 Streets)", icon: <Footprints className="w-4 h-4"/> },
          { text: "點 Parmesan + Truffle Mayo 口味", nav: "Fabel Friet Amsterdam" },
          { text: "坐在運河橋墩上吃" }
        ]
      },
      { 
        time: "14:30", loc: "Boerejongens West", title: "高級大麻店", 
        action: [
          { text: "交通：步行前往 Baarsjesweg", nav: "Boerejongens Coffeeshop West", icon: <Footprints className="w-4 h-4"/> },
          { text: "購買：Red Velvet Cake 或 Brownie" },
          { text: "⚠️ 買完直接拿回飯店放好，絕對不要在路上吃" }
        ] 
      },
      { 
        time: "16:00", loc: "Museumplein", title: "Ice Village 聖誕市集", 
        action: [
          { text: "交通：步行前往博物館廣場", icon: <Footprints className="w-4 h-4"/> },
          { text: "喝熱紅酒 (Glühwein) 暖身", nav: "Ice Village Amsterdam" }
        ]
      },
      { 
        time: "18:30", loc: "Warung Spang Makandra", title: "蘇利南菜晚餐", 
        action: [
          { text: "交通：步行前往 De Pijp", nav: "Warung Spang Makandra", icon: <Footprints className="w-4 h-4"/> },
          { text: "點 Roti Kip (咖哩雞捲餅)" },
          { text: "⚠️ 確認無牛肉 (No Beef)" }
        ], 
        stay: "Hotel Abba", stayPhone: "+31-20-618-3058" 
      }
    ]
  },
  {
    day: "Day 4",
    date: "12/23 (Tue)",
    title: "抵達冰島",
    color: "border-cyan-500 bg-slate-800",
    activeColor: "bg-cyan-600",
    weather: { temp: "-1°C", cond: "強風", aurora: "Kp 3 (可見)" },
    events: [
      { 
        time: "10:00", loc: "AMS 機場", title: "飛往冰島", 
        action: [
          { text: "交通：Bus 397 (Leidseplein 上車) 直達機場", icon: <Bus className="w-4 h-4"/> },
          { text: "Icelandair 報到 (羽絨外套穿身上)" }
        ] 
      },
      { 
        time: "15:25", loc: "KEF 凱夫拉維克", title: "冰島入境", 
        action: [
          { text: "走綠色通道出關" },
          { text: "10-11 超市補給 (巧克力奶、Skyr)", nav: "10-11 Supermarket Keflavik Airport" },
          { text: "⚠️ Nautakjöt (牛肉) 別拿" }
        ], 
        dialogue: { en: "These are cooked instant noodles. Processed food, not raw meat.", cn: "這是煮熟的泡麵。是加工食品，不是生肉。" }
      },
      { 
        time: "17:00", loc: "Blue Lagoon", title: "藍湖溫泉", 
        action: [
          { text: "交通：搭乘預約好的 Flybus 往藍湖", icon: <Bus className="w-4 h-4"/> },
          { text: "寄放行李", nav: "Blue Lagoon Iceland" },
          { text: "頭髮厚塗潤髮乳綁丸子頭 (防打結)" },
          { text: "手機裝防水袋" }
        ], 
        tip: "回程上車前確認：Bus to Reykjavik, Kex Hostel?" 
      },
      { 
        time: "21:00", loc: "Reykjavik", title: "入住青旅", 
        action: [
          { text: "交通：搭 Flybus 接駁車至市區", icon: <Bus className="w-4 h-4"/> },
          { text: "整理行李 (明天要換小車)" },
          { text: "準備明天 Tour 的小背包" }
        ], 
        stay: "Kex Hostel", stayPhone: "+354 561 6060" 
      }
    ]
  },
  {
    day: "Day 5",
    date: "12/24 (Wed)",
    title: "冰島 Tour D1：南岸經典",
    color: "border-blue-500 bg-slate-800",
    activeColor: "bg-blue-600",
    weather: { temp: "-2°C", cond: "雪/雨", aurora: "Kp 4 (活躍)" },
    events: [
      { 
        time: "08:00", loc: "Bus stop 9", title: "集合出發", 
        action: [
          { text: "步行前往 Bus stop 9 (Snorrabraut)", nav: "Bus stop 9 Snorrabraut" },
          { text: "尋找 Nice Travel / GTA 巴士" }
        ],
        tip: "請隨時查看 road.is (路況) 與 vedur.is (天氣)，冰島天氣變化極快。"
      },
      { 
        time: "10:30", loc: "Seljalandsfoss", title: "塞里雅蘭瀑布", 
        action: [
          { text: "水簾洞瀑布 (穿防水衣褲)", nav: "Seljalandsfoss" }
        ] 
      },
      { 
        time: "13:00", loc: "Reynisfjara", title: "黑沙灘", 
        action: [
          { text: "⚠️ 絕對不要背對大海", nav: "Reynisfjara Beach" },
          { text: "小心瘋狗浪 (Sneaker Waves)" }
        ] 
      },
      { 
        time: "18:00", loc: "South Iceland", title: "入住飯店", 
        action: [
          { text: "平安夜晚餐" }
        ], 
        stay: "Hotel Drangshlid", stayPhone: "+354 765 5544" 
      }
    ]
  },
  {
    day: "Day 6",
    date: "12/25 (Thu)",
    title: "冰島 Tour D2：冰川健行",
    color: "border-blue-500 bg-slate-800",
    activeColor: "bg-blue-600",
    weather: { temp: "-5°C", cond: "晴朗", aurora: "Kp 5 (風暴級!)" },
    events: [
      { 
        time: "09:00", loc: "Skaftafell", title: "冰川健行", 
        action: [
          { text: "穿冰爪、戴安全帽", nav: "Skaftafell" },
          { text: "跟緊嚮導，勿脫隊" }
        ] 
      },
      { 
        time: "18:00", loc: "Kirkjubæjarklaustur", title: "入住飯店", 
        action: [
          { text: "聖誕大餐 (確認無牛)" },
          { text: "晚上極光機率極高" }
        ], 
        stay: "Hotel Hrifunes", stayPhone: "+354 497 1373" 
      }
    ]
  },
  {
    day: "Day 7",
    date: "12/26 (Fri)",
    title: "冰島 Tour D3：鑽石沙灘",
    color: "border-blue-500 bg-slate-800",
    activeColor: "bg-blue-600",
    weather: { temp: "-3°C", cond: "多雲", aurora: "Kp 3 (可見)" },
    events: [
      { 
        time: "10:00", loc: "Jökulsárlón", title: "傑古沙龍冰河湖", 
        action: [
          { text: "尋找海豹", nav: "Jökulsárlón" },
          { text: "鑽石沙灘拍照", nav: "Diamond Beach Iceland" }
        ] 
      },
      { 
        time: "14:00", loc: "East Fjords", title: "東部峽灣移動", 
        action: [
          { text: "欣賞沿途峽灣風景" },
          { text: "車上補眠" }
        ] 
      },
      { 
        time: "19:00", loc: "Suðursveit", title: "入住飯店", 
        action: [
          { text: "晚餐休息" }
        ], 
        stay: "Guesthouse Gerdi", stayPhone: "+354 846 0641" 
      }
    ]
  },
  {
    day: "Day 8",
    date: "12/27 (Sat)",
    title: "冰島 Tour D4：東部轉北部",
    color: "border-blue-500 bg-slate-800",
    activeColor: "bg-blue-600",
    weather: { temp: "-4°C", cond: "雪", aurora: "Kp 2 (微弱)" },
    events: [
      { 
        time: "09:00", loc: "Egilsstaðir", title: "埃伊爾斯塔濟", 
        action: [
          { text: "超市補給", nav: "Egilsstaðir" },
          { text: "看怪獸湖 (Lagarfljót)", nav: "Lagarfljót" }
        ] 
      },
      { 
        time: "16:00", loc: "Egilsstaðir", title: "入住飯店", 
        action: [
          { text: "休息，逛逛當地" }
        ], 
        stay: "Hotel Valaskjalf", stayPhone: "+354 471 2400" 
      }
    ]
  },
  {
    day: "Day 9",
    date: "12/28 (Sun)",
    title: "冰島 Tour D5：米湖與鑽石圈",
    color: "border-blue-500 bg-slate-800",
    activeColor: "bg-blue-600",
    weather: { temp: "-6°C", cond: "大雪", aurora: "Kp 3 (可見)" },
    events: [
      { 
        time: "09:00", loc: "Mývatn", title: "米湖地熱區", 
        action: [
          { text: "Hverir 地熱 (像火星表面)", nav: "Hverir Geothermal Area" },
          { text: "克拉夫拉火山", nav: "Krafla Volcano" }
        ]
      },
      { 
        time: "13:00", loc: "Goðafoss", title: "眾神瀑布", 
        action: [
          { text: "觀賞壯觀弧形瀑布", nav: "Goðafoss Waterfall" }
        ] 
      },
      { 
        time: "17:00", loc: "Akureyri", title: "阿克雷里", 
        action: [
          { text: "看愛心紅綠燈", nav: "Akureyri" },
          { text: "吃 Brynja 冰淇淋", nav: "Brynja Akureyri" }
        ], 
        stay: "Hotel Nordurland", stayPhone: "+354 462 2600" 
      }
    ]
  },
  {
    day: "Day 10",
    date: "12/29 (Mon)",
    title: "冰島 Tour D6：斯奈山半島",
    color: "border-blue-500 bg-slate-800",
    activeColor: "bg-blue-600",
    weather: { temp: "-2°C", cond: "風大", aurora: "Kp 4 (活躍)" },
    events: [
      { 
        time: "10:00", loc: "Kirkjufell", title: "教會山 (草帽山)", 
        action: [
          { text: "冰島最經典地標拍照", nav: "Kirkjufell Mountain" }
        ] 
      },
      { 
        time: "14:00", loc: "Djúpalónssandur", title: "黑卵石沙灘", 
        action: [
          { text: "看沈船遺跡與試力石", nav: "Djúpalónssandur beach" }
        ] 
      },
      { 
        time: "18:00", loc: "Stykkishólmur", title: "入住飯店", 
        action: [
          { text: "港口散步，白日夢冒險王場景", nav: "Stykkishólmur Harbour" }
        ], 
        stay: "Stykkisholmur Inn (Fosshotel)", stayPhone: "+354 430 2100" 
      }
    ]
  },
  {
    day: "Day 11",
    date: "12/30 (Tue)",
    title: "冰島 Tour D7：西部與溫泉",
    color: "border-blue-500 bg-slate-800",
    activeColor: "bg-blue-600",
    weather: { temp: "0°C", cond: "雨夾雪", aurora: "Kp 2 (微弱)" },
    events: [
      { 
        time: "10:00", loc: "Deildartunguhver", title: "歐洲最大地熱泉", 
        action: [
          { text: "看蒸氣、買地熱番茄", nav: "Deildartunguhver" }
        ] 
      },
      { 
        time: "13:00", loc: "Hraunfossar", title: "熔岩瀑布", 
        action: [
          { text: "欣賞從熔岩流出的藍色溪水", nav: "Hraunfossar" }
        ] 
      },
      { 
        time: "18:00", loc: "Borgarnes", title: "入住飯店", 
        action: [
          { text: "休息整備，明天回雷克雅維克" }
        ], 
        stay: "Hotel Borganes", stayPhone: "+354 437 1119" 
      }
    ]
  },
  {
    day: "Day 12",
    date: "12/31 (Wed)",
    title: "冰島 Tour D8 + 跨年狂歡",
    color: "border-indigo-500 bg-slate-800",
    activeColor: "bg-indigo-600",
    weather: { temp: "-1°C", cond: "晴", aurora: "Kp 4 (跨年煙火+極光)" },
    events: [
      { 
        time: "09:00", loc: "Thingvellir", title: "議會國家公園", 
        action: [
          { text: "歐美板塊交界", nav: "Thingvellir National Park" }
        ] 
      },
      { 
        time: "12:00", loc: "Geysir", title: "間歇泉", 
        action: [
          { text: "等待 Strokkur 噴發 (每5-8分鐘)", nav: "Geysir" }
        ] 
      },
      { 
        time: "14:00", loc: "Gullfoss", title: "黃金瀑布", 
        action: [
          { text: "欣賞氣勢滂礡的瀑布", nav: "Gullfoss Falls" }
        ] 
      },
      { 
        time: "18:00", loc: "Reykjavik", title: "抵達市區 & 解散", 
        action: [
          { text: "拖行李去 BSI 或置物櫃", nav: "BSI Bus Terminal" },
          { text: "吃簡單晚餐 (餐廳多已客滿/打烊)" }
        ] 
      },
      { 
        time: "20:30", loc: "Ægisíða", title: "跨年篝火 (Brenna)", 
        action: [
          { text: "交通：建議步行或計程車", icon: <Car className="w-4 h-4"/> },
          { text: "地點：Ægisíða 岸邊", nav: "Ægisíða Bonfire" },
          { text: "體驗冰島傳統篝火，聽當地人唱民謠" }
        ], 
        tip: "這是雷克雅維克最大最知名的篝火地點，必去！" 
      },
      { 
        time: "23:30", loc: "Hallgrímskirkja", title: "哈爾格林姆教堂煙火", 
        action: [
          { text: "步行前往教堂前廣場", nav: "Hallgrímskirkja", icon: <Footprints className="w-4 h-4"/> },
          { text: "23:50 倒數計時，看全城煙火齊發" }
        ], 
        tip: "如果不想人擠人，也可以去 Perlan (珍珠樓) 看全景。" 
      },
      { 
        time: "00:30", loc: "BSI Bus Terminal", title: "BSI 避難", 
        action: [
          { text: "回巴士站室內取暖", nav: "BSI Bus Terminal" },
          { text: "等待清晨 04:30 巴士" }
        ] 
      }
    ]
  },
  {
    day: "Day 13",
    date: "01/01 (Thu)",
    title: "元旦與荷蘭",
    color: "border-indigo-500 bg-slate-800",
    activeColor: "bg-indigo-600",
    weather: { temp: "4°C", cond: "陰", aurora: null },
    events: [
      { 
        time: "04:30", loc: "BSI Bus Terminal", title: "搭車去機場", 
        action: [
          { text: "搭 Flybus 前往 KEF 機場 (約45分)", icon: <Bus className="w-4 h-4"/> },
          { text: "車上補眠" }
        ] 
      },
      { time: "07:20", loc: "KEF 機場", title: "飛往荷蘭", action: [{ text: "起飛" }] },
      { 
        time: "11:35", loc: "AMS 機場", title: "抵達荷蘭", 
        action: [
          { text: "交通：去 A9-A13 站台搭免費接駁車", icon: <Bus className="w-4 h-4"/> },
          { text: "Best Western 飯店 Check-in", nav: "Best Western Plus Amsterdam Airport Hotel" },
          { text: "搭接駁車回機場，轉火車去市區", icon: <Train className="w-4 h-4"/> },
          { text: "中國城 Nam Kee 吃燒鴨飯", nav: "Nam Kee Amsterdam" },
          { text: "FEBO 吃起司酥 (Kaassoufflé) & 雞肉棒", nav: "FEBO Amsterdam" }
        ], 
        stay: "Best Western Plus Amsterdam Airport", stayPhone: "+31-20-653-2611" 
      }
    ]
  },
  {
    day: "Day 14",
    date: "01/02 (Fri)",
    title: "風車村 & 返程",
    color: "border-orange-500 bg-slate-800",
    activeColor: "bg-orange-600",
    weather: { temp: "3°C", cond: "風大", aurora: null },
    events: [
      { 
        time: "10:48", loc: "Zaanse Schans", title: "風車村", 
        action: [
          { text: "交通：火車到 Zaandijk Zaanse Schans 站", icon: <Train className="w-4 h-4"/> },
          { text: "步行 15 分鐘過橋", nav: "Zaanse Schans", icon: <Footprints className="w-4 h-4"/> },
          { text: "De Kat (貓風車) 登頂", nav: "De Kat Windmill" },
          { text: "In de Gecroonde Duyvekater 買甜麵包", nav: "Bakery Museum In de Gecroonde Duyvekater" }
        ] 
      },
      { 
        time: "16:00", loc: "AMS 機場", title: "退稅 & 報到", 
        action: [
          { text: "交通：火車回 Schiphol Airport", icon: <Train className="w-4 h-4"/> },
          { text: "機場超市最後採買" },
          { text: "Departure 3 蓋退稅章" },
          { text: "託運 & 20:00 起飛" }
        ], 
        tip: "退稅門檻：荷蘭單筆 > €50，冰島單筆 > 6000 ISK。請確保退稅單已填妥。",
        dialogue: { en: "Q: Where are goods? A: In my suitcase. I haven't checked it in yet.", cn: "問：商品在哪？答：在行李箱裡。我還沒託運。" } 
      }
    ]
  },
  {
    day: "Day 15",
    date: "01/03 (Sat)",
    title: "上海轉機",
    color: "border-red-500 bg-slate-800",
    activeColor: "bg-red-600",
    weather: { temp: "8°C", cond: "晴", aurora: null },
    events: [
      { 
        time: "13:55", loc: "PVG 上海浦東", title: "抵達上海", 
        action: [
          { text: "入境 (使用台胞證)" },
          { text: "聯絡接駁車 (如需)" }
        ], 
        stay: "雲泊夜酒店 (上海浦東店)", stayPhone: "+86-19121157776" 
      },
      { 
        time: "15:30", loc: "Shanghai", title: "上海在地方案 (二選一)", 
        action: [
          { text: "方案 A：川沙古鎮 (交通：滴滴打車約40元)", nav: "Chuansha Ancient Town", icon: <Car className="w-4 h-4"/> },
          { text: "方案 B：祝橋鎮漫步 (交通：步行約20分鐘)", nav: "Zhuqiaozhen", icon: <Footprints className="w-4 h-4"/> }
        ], 
        tip: "Google Maps 不能用，請改用高德地圖。" 
      }
    ]
  },
  {
    day: "Day 16",
    date: "01/04 (Sun)",
    title: "甜蜜的家",
    color: "border-red-500 bg-slate-800",
    activeColor: "bg-red-600",
    weather: { temp: "22°C", cond: "溫暖", aurora: null },
    events: [
      { 
        time: "07:15", loc: "PVG 上海浦東", title: "前往機場", 
        action: [
          { text: "搭早班接駁車" },
          { text: "09:15 起飛" }
        ] 
      },
      { 
        time: "11:15", loc: "TSA 松山機場", title: "抵達台北", 
        action: [
          { text: "任務完成！🎉" }
        ] 
      }
    ]
  }
];

const personas = [
  { role: "👮‍♂️ 座艙長", desc: "針對飛行與轉機", items: ["電池恐慌症：行動電源、相機電池隨身帶，打火機丟掉。", "喝水計畫：過安檢後裝水。機上很乾，勇敢按服務鈴喝水。"] },
  { role: "🧢 導遊", desc: "針對行程安全", items: ["荷蘭：紅色是自行車道，絕對不要走在上面！", "冰島：走路像企鵝，重心放低小碎步防滑。", "守時：集合時間通常是「發車時間」，請早到15分鐘。"] },
  { role: "🛡️ 保險業務", desc: "針對理賠", items: ["證據搜集狂：付錢拿收據、生病拿診斷書、遭竊拿報案單。", "正本迷思：所有文件都要留正本帶回台灣。"] },
  { role: "🍽️ 廚師", desc: "無牛飲食 No Beef", items: ["❌ Nautakjöt (牛肉)", "❌ Pylsur (冰島熱狗)", "❌ FEBO Rundvlees (牛可樂餅)", "✅ Lambakjöt (羊肉)", "✅ Grísakjöt (豬肉)", "✅ Kjúklingur (雞肉)"] },
  { role: "📷 攝影師", desc: "極光與低溫拍攝", items: ["電池保暖：備用電池一定要放在貼身口袋，低溫下電量掉很快。", "腳架：拍極光必備，但風大時要掛重物穩住。"] }
];

const insuranceDialogues = [
  { label: "醫院看診", en: "I need a medical certificate and an official receipt for my insurance claim. Can you provide them in English?", cn: "我需要英文診斷證明和收據以申請保險理賠，請問能提供嗎？" },
  { label: "行李遺失", en: "My luggage is missing. I need to file a report and get a P.I.R. form for insurance.", cn: "我的行李遺失了。我需要報案並取得 P.I.R. 表格以申請保險。" },
  { label: "東西被偷", en: "I need to report a theft for my insurance company.", cn: "我的東西被偷了，我需要報案給保險公司。" },
  { label: "班機延誤", en: "Can I have a written statement regarding the flight delay?", cn: "請問可以給我一份關於班機延誤的書面證明嗎？" }
];

const souvenirs = {
  iceland: [
    { title: "Omnom Chocolate (Omnom 巧克力)", sub: "顏值擔當", desc: "Lakkrís + Sea Salt (甘草海鹽)：白巧奶香包住甘草，像高級焦糖牛奶糖。Black n' Burnt Barley (黑焦大麥)：像酥脆爆米花配黑巧。", img: "🍫" },
    { title: "Harðfiskur (乾魚片)", sub: "維京能量棒", desc: "一定要抹厚厚的 Smjör (冰島奶油)！剛咬像厚紙板，融化後是鮮味炸彈。", img: "🐟" },
    { title: "Lakkrís Chocolate Balls (甘草巧克力球)", sub: "國民零食", desc: "Sterkar Djúpur (藍球)：脆→軟→Q，鹹甜刺激。Þristur (黃條)：像軟糯布朗尼，配黑咖啡絕配。", img: "🍬" },
    { title: "Saltverk Sea Salt (Saltverk 海鹽)", sub: "頂級調味", desc: "Birch Smoked Salt (樺木煙燻)：有營火晚會味。Lava Salt (熔岩黑鹽)：黑色片狀，口感爽脆。", img: "🧂" },
    { title: "Brennivín (黑死酒)", sub: "勇者挑戰", desc: "馬鈴薯發酵烈酒，強烈草本味。一定要冷凍後喝 Shot！", img: "🥃" }
  ],
  netherlands: [
    { title: "Stroopwafel (荷蘭焦糖煎餅)", sub: "經典必買", desc: "蓋在熱咖啡杯口「蒸」一分鐘，內餡牽絲，肉桂香氣暴增。推薦品牌：Kanjers (超市易買)、Markus (市集現做)。", img: "🧇" },
    { title: "Old Amsterdam Cheese (老阿姆斯特丹起司)", sub: "熟成風味", desc: "熟成硬起司，有白色蛋白質結晶，咬到會有「喀滋」脆感。", img: "🧀" },
    { title: "Tony's Chocolonely (Tony's 巧克力)", sub: "零奴工", desc: "Caramel Sea Salt (焦糖海鹽)：橘色包裝銷售冠軍，絲滑牛奶巧藏大顆脆硬焦糖。", img: "🍫" },
    { title: "Hagelslag (巧克力米)", sub: "早餐儀式", desc: "抹厚奶油在白吐司上，撒上 Puur (黑巧克力口味)，半融化口感超濃醇。", img: "🍞" },
    { title: "Drop (荷蘭甘草糖)", sub: "味蕾挑戰", desc: "Zout (鹹味)：生化武器級別。新手請選 Autodrop (水果甘草)。", img: "🍬" }
  ]
};

const emergencyContacts = [
  { name: "冰島緊急求救 (警/消/救護)", number: "112", note: "全歐洲通用，可定位位置" },
  { name: "荷蘭緊急求救", number: "112", note: "全歐洲通用" },
  { name: "外交部旅外國人急難救助", number: "+886-800-085-095", note: "全球免付費專線" },
  { name: "駐荷蘭代表處", number: "+31-654-948-849", note: "緊急聯絡電話" },
  { name: "駐丹麥代表處 (兼轄冰島)", number: "+45-20-76-04-66", note: "冰島無代表處，由丹麥兼轄" },
  { name: "中國駐冰島大使館", number: "+354-527-6688", note: "僅供緊急參考" }
];

// --- Components ---

const CheckboxItem = ({ item }) => {
  const [checked, setChecked] = useState(false);
  return (
    <div 
      onClick={() => setChecked(!checked)} 
      className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 active:scale-95 ${checked ? 'bg-green-900/30 border-green-700 opacity-60' : 'bg-slate-800 border-slate-700 hover:border-blue-500/50 shadow-sm'}`}
    >
      <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center ${checked ? 'bg-green-600 border-green-600' : 'border-slate-500'}`}>
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
      <div>
        <h4 className={`font-bold ${checked ? 'line-through text-slate-500' : 'text-slate-200'}`}>{item.name}</h4>
        <div className="text-xs text-blue-400 font-mono mt-0.5">{item.spec}</div>
        <p className={`text-sm mt-1 ${checked ? 'text-slate-500' : 'text-slate-400'}`}>{item.reason}</p>
      </div>
    </div>
  );
};

const ItineraryCard = ({ event }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getGoogleMapsLink = (query) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  };

  return (
    <div className="relative pl-8 pb-8 last:pb-0 border-l-2 border-slate-700 hover:border-blue-500 transition-colors">
      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-slate-900 shadow-sm"></div>
      
      <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
        {/* Header */}
        <div 
          className="p-4 cursor-pointer hover:bg-slate-700 transition-colors flex justify-between items-start"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-900/50 text-blue-300 border border-blue-500/30">{event.time}</span>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {event.loc}
              </span>
            </div>
            <h3 className="font-bold text-lg text-slate-100">{event.title}</h3>
          </div>
          {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>

        {/* Expanded Content */}
        {isOpen && (
          <div className="px-4 pb-4 border-t border-slate-700 bg-slate-800/50">
            {/* Actions with Inline Navigation */}
            <ul className="mt-4 space-y-3">
              {event.action.map((act, idx) => (
                <li key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-slate-300 gap-2">
                  <div className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                    <span className="flex items-center gap-2">
                      {act.icon && <span className="text-blue-400">{act.icon}</span>}
                      {act.text}
                    </span>
                  </div>
                  {act.nav && (
                    <a 
                      href={getGoogleMapsLink(act.nav)}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-5 sm:ml-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white rounded-md text-xs font-medium transition-colors border border-blue-500/30 self-start sm:self-auto shrink-0 active:scale-95"
                    >
                      <Navigation className="w-3 h-3" /> 導航
                    </a>
                  )}
                </li>
              ))}
            </ul>

            {/* Warnings/Tips/Dialogue */}
            <div className="mt-5 space-y-3">
              {event.warning && (
                <div className="flex items-start gap-2 bg-red-900/20 border border-red-900/30 p-3 rounded-lg text-sm text-red-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  {event.warning}
                </div>
              )}
              
              {event.tip && (
                <div className="flex items-start gap-2 bg-amber-900/20 border border-amber-900/30 p-3 rounded-lg text-sm text-amber-300">
                  <Thermometer className="w-4 h-4 shrink-0 mt-0.5" />
                  {event.tip}
                </div>
              )}

              {event.dialogue && (
                <div className="bg-blue-900/30 border border-blue-700/50 p-3 rounded-lg relative group">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCopy(event.dialogue.en); }}
                      className="p-1 hover:bg-blue-700 rounded text-xs flex items-center gap-1 text-blue-200 active:scale-95"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <h5 className="text-xs font-bold text-blue-400 mb-2 uppercase tracking-wider">Survival Dialogue</h5>
                  <p className="text-sm font-medium text-white mb-1">{event.dialogue.en}</p>
                  <p className="text-xs text-blue-300 border-t border-blue-800 pt-1 mt-1">{event.dialogue.cn}</p>
                </div>
              )}

              {event.stay && (
                <div className="flex flex-col gap-1 bg-indigo-900/20 border border-indigo-900/50 p-3 rounded-lg text-sm text-indigo-300">
                  <div className="flex items-start gap-2 font-bold">
                    <Home className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>住宿：{event.stay}</span>
                  </div>
                  {event.stayPhone && (
                    <div className="pl-6 text-indigo-400 font-mono text-xs">
                      📞 {event.stayPhone}
                    </div>
                  )}
                  {/* Navigation for Hotel */}
                  <a 
                    href={getGoogleMapsLink(event.stay)}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-2 ml-6 inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 hover:underline active:scale-95"
                  >
                    <Navigation className="w-3 h-3" /> 導航至住宿
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CurrencyCalculator = () => {
  // Base value in TWD
  const [baseValueTWD, setBaseValueTWD] = useState(100);

  const handleInputChange = (currencyKey, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setBaseValueTWD(0);
      return;
    }
    
    // Convert input currency to TWD base
    // Formula: InputAmount / Rate = BaseTWD
    // Example: 100 TWD / 1 = 100 Base
    // Example: 10 EUR / 0.029 = 344 Base
    const rate = currencyConfig[currencyKey].rate;
    const newBase = numValue / rate;
    setBaseValueTWD(newBase);
  };

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Coins className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-bold text-slate-100">雙向匯率換算</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(currencyConfig).map(([key, config]) => {
          // Calculate display value from base TWD
          // Formula: BaseTWD * Rate = DisplayValue
          const displayValue = (baseValueTWD * config.rate).toFixed(2);
          
          return (
            <div key={key} className="flex flex-col bg-slate-800 p-3 rounded-xl border border-slate-700">
              <label className={`text-xs font-bold mb-1 ${config.color}`}>{config.label}</label>
              <input 
                type="number" 
                value={baseValueTWD === 0 ? '' : displayValue}
                onChange={(e) => handleInputChange(key, e.target.value)}
                placeholder="0"
                className="bg-transparent text-white font-mono text-2xl outline-none w-full placeholder-slate-600"
                onFocus={(e) => e.target.select()}
              />
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-500 text-center mt-4">* 匯率為即時估算值，僅供參考 (Base: Late 2025)</p>
    </div>
  );
};

const InstallGuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-sm w-full p-6 relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white active:scale-95"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-900/50">
            <Smartphone className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">如何安裝此 App？</h3>
          <p className="text-sm text-slate-400 mb-6">將此網頁加入主畫面，即可像原生 App 一樣離線瀏覽 (部分功能)。</p>
          
          <div className="space-y-4 w-full text-left">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-blue-400"></span> iOS (Safari)
              </h4>
              <ol className="text-xs text-slate-300 list-decimal pl-4 space-y-1">
                <li>點擊底部選單的 <Share className="w-3 h-3 inline mx-1" /> 分享按鈕。</li>
                <li>往下滑動，選擇「加入主畫面」。</li>
                <li>點擊右上角的「新增」。</li>
              </ol>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-green-400">🤖</span> Android (Chrome)
              </h4>
              <ol className="text-xs text-slate-300 list-decimal pl-4 space-y-1">
                <li>點擊右上角的 <Menu className="w-3 h-3 inline mx-1" /> 選單按鈕。</li>
                <li>選擇「安裝應用程式」或「加入主畫面」。</li>
                <li>點擊「新增」即可。</li>
              </ol>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 active:scale-95 transition-all"
          >
            知道了！
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function TravelGuide() {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Scroll to active day button
  const dayListRef = useRef(null);
  
  useEffect(() => {
    if (dayListRef.current) {
        const activeButton = dayListRef.current.children[selectedDayIndex];
        if (activeButton) {
            activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }
  }, [selectedDayIndex]);

  const currentDay = itineraryDays[selectedDayIndex];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 pb-20 selection:bg-blue-500/30">
      
      {/* Install Guide Modal */}
      <InstallGuideModal isOpen={isInstallModalOpen} onClose={() => setIsInstallModalOpen(false)} />

      {/* Hero Section */}
      <header className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white pt-8 pb-24 px-6 relative overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 right-0 opacity-5 transform translate-x-10 -translate-y-10">
          <Snowflake className="w-64 h-64" />
        </div>
        
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
            2025-2026 Winter Edition
          </div>
          <button 
            onClick={() => setIsInstallModalOpen(true)}
            className="p-2 bg-slate-800/80 rounded-full text-slate-300 hover:text-white border border-slate-700 active:scale-95 transition-all"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight tracking-tight">
            荷蘭＋冰島<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">獨旅終極全攻略</span>
          </h1>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-3xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl shadow-xl p-2 flex overflow-x-auto no-scrollbar gap-2">
          {[
            { id: 'packing', label: '打包清單', icon: <Backpack className="w-4 h-4" /> },
            { id: 'itinerary', label: '完整行程', icon: <Map className="w-4 h-4" /> },
            { id: 'currency', label: '匯率換算', icon: <Coins className="w-4 h-4" /> },
            { id: 'survival', label: '生存攻略', icon: <AlertTriangle className="w-4 h-4" /> },
            { id: 'emergency', label: '緊急聯絡', icon: <Phone className="w-4 h-4" /> },
            { id: 'food', label: '美食圖鑑', icon: <Utensils className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap active:scale-95 ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <main className="max-w-3xl mx-auto px-4 mt-8 space-y-8">
        
        {/* 1. Packing List */}
        {activeTab === 'packing' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-4 flex gap-3 text-yellow-200 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 text-yellow-500" />
              <p>點擊項目即可勾選，檢查您的行李進度。請務必遵守鋰電池與液體規定。</p>
            </div>
            
            {packingList.map((section, idx) => (
              <div key={idx} className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
                <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-2">
                  <div className="p-2 bg-blue-900/30 text-blue-400 rounded-lg">{section.icon}</div>
                  <div>
                    <h3 className="font-bold text-slate-100">{section.category}</h3>
                    <p className="text-xs text-slate-400">{section.note}</p>
                  </div>
                </div>
                <div className="p-4 grid gap-3 md:grid-cols-2">
                  {section.items.map((item, i) => (
                    <CheckboxItem key={i} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. Itinerary (Date Selector View) */}
        {activeTab === 'itinerary' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Day Selector Strip */}
            <div className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-sm py-2 -mx-4 px-4 border-b border-slate-800">
                <div 
                    ref={dayListRef}
                    className="flex overflow-x-auto gap-2 pb-1 no-scrollbar snap-x"
                >
                    {itineraryDays.map((dayData, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedDayIndex(idx)}
                            className={`flex-shrink-0 snap-center flex flex-col items-center justify-center w-16 h-16 rounded-xl border transition-all duration-200 active:scale-95 ${
                                selectedDayIndex === idx
                                    ? `${dayData.activeColor} text-white border-transparent shadow-lg transform scale-105`
                                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                            }`}
                        >
                            <span className="text-xs font-bold uppercase">{dayData.day}</span>
                            <span className="text-[10px] font-mono mt-0.5 opacity-80 truncate px-1">{dayData.date.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Selected Day Content */}
            <div key={selectedDayIndex} className="animate-in fade-in slide-in-from-right-4 duration-300">
                
                {/* Day Header Card */}
                <div className={`mb-6 p-5 rounded-2xl shadow-lg border border-slate-700 relative overflow-hidden bg-slate-900`}>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Snowflake className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">{currentDay.title}</h2>
                                <p className="text-slate-400 font-mono text-sm">{currentDay.date}</p>
                            </div>
                            {/* Weather Badge */}
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
                                    <Thermometer className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm font-bold text-blue-100">{currentDay.weather.temp}</span>
                                    <span className="text-xs text-slate-400 border-l border-slate-600 pl-2 ml-1">{currentDay.weather.cond}</span>
                                </div>
                                {currentDay.weather.aurora && (
                                    <div className="flex items-center gap-1.5 bg-green-900/30 px-3 py-1.5 rounded-full border border-green-500/30">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                        <span className="text-xs font-bold text-green-300">極光: {currentDay.weather.aurora}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Timeline Events */}
                <div className="pl-2 space-y-6 mb-8 border-l-2 border-slate-800 ml-4">
                  {currentDay.events.map((event, i) => (
                    <div className="-ml-6" key={i}>
                        <ItineraryCard event={event} />
                    </div>
                  ))}
                </div>
            </div>

          </div>
        )}

        {/* Currency Tab */}
        {activeTab === 'currency' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CurrencyCalculator />
          </div>
        )}

        {/* 3. Survival */}
        {activeTab === 'survival' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Personas */}
            {personas.map((p, idx) => (
              <div key={idx} className="bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-800 rounded-bl-full -mr-4 -mt-4 z-0"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-1 text-slate-100">{p.role}</h3>
                  <p className="text-sm text-slate-400 mb-4">{p.desc}</p>
                  <ul className="space-y-3">
                    {p.items.map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-300">
                        <Circle className="w-2 h-2 mt-2 fill-current text-blue-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            {/* Useful Apps (New Section) */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-blue-400" /> 數位生存工具包 (必備 App)
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                    {usefulApps.map((app, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
                            <div className="p-2 bg-slate-800 rounded-lg text-blue-400 border border-slate-700">
                                {app.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-200">{app.name}</h4>
                                <p className="text-xs text-slate-500 mt-0.5">{app.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Insurance Dialogues (Restored) */}
            <div className="bg-blue-900/20 border border-blue-800/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-blue-100 mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-blue-400" /> 保險理賠專用對話
                </h3>
                <div className="space-y-4">
                    {insuranceDialogues.map((item, idx) => (
                        <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                            <div className="text-xs text-blue-400 font-bold mb-2 uppercase tracking-wider">{item.label}</div>
                            <p className="text-sm font-medium text-white mb-2">{item.en}</p>
                            <p className="text-xs text-slate-400 border-t border-slate-800 pt-2">{item.cn}</p>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}

        {/* 4. Emergency */}
        {activeTab === 'emergency' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-6 text-center">
                 <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3" />
                 <h2 className="text-xl font-bold text-red-100">緊急求救 SOS</h2>
                 <p className="text-red-300 text-sm mt-2">遇到生命危險或重大事故時使用</p>
             </div>

             <div className="grid gap-4">
                 {emergencyContacts.map((contact, idx) => (
                     <div key={idx} className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex justify-between items-center">
                         <div>
                             <h3 className="font-bold text-slate-100">{contact.name}</h3>
                             <p className="text-xs text-slate-500 mt-1">{contact.note}</p>
                         </div>
                         <div className="text-right">
                             <div className="text-xl font-mono font-bold text-blue-400">{contact.number}</div>
                         </div>
                     </div>
                 ))}
             </div>
          </div>
        )}

        {/* 5. Food & Souvenirs */}
        {activeTab === 'food' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Iceland */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Snowflake className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-slate-100">冰島極地風味</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {souvenirs.iceland.map((item, i) => (
                  <div key={i} className="bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-800 hover:border-cyan-500/50 transition-colors group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.img}</span>
                          <div>
                              <h3 className="font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                              <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded-full text-slate-400 border border-slate-700">{item.sub}</span>
                          </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Netherlands */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wind className="w-6 h-6 text-orange-400" />
                <h2 className="text-2xl font-bold text-slate-100">荷蘭甜蜜陷阱</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {souvenirs.netherlands.map((item, i) => (
                  <div key={i} className="bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-800 hover:border-orange-500/50 transition-colors group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.img}</span>
                          <div>
                              <h3 className="font-bold text-slate-100 group-hover:text-orange-400 transition-colors">{item.title}</h3>
                              <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded-full text-slate-400 border border-slate-700">{item.sub}</span>
                          </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 text-center text-slate-600 text-sm border-t border-slate-800">
        <p>2025-2026 荷蘭＋冰島獨旅攻略</p>
        <p className="mt-1">Designed for Solo Travelers</p>
      </footer>
    </div>
  );
}