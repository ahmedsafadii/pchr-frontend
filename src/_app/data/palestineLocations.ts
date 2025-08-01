export interface District {
  id: string;
  name: string;
  nameAr: string;
}

export interface City {
  id: string;
  name: string;
  nameAr: string;
  districts: District[];
}

export interface Governorate {
  id: string;
  name: string;
  nameAr: string;
  cities: City[];
}

export const palestineLocations: Governorate[] = [
  {
    id: "gaza",
    name: "Gaza",
    nameAr: "غزة",
    cities: [
      {
        id: "gaza-city",
        name: "Gaza City",
        nameAr: "مدينة غزة",
        districts: [
          { id: "rimal", name: "Rimal", nameAr: "الرمال" },
          { id: "sabra", name: "Sabra", nameAr: "الصبرة" },
          { id: "zeitoun", name: "Zeitoun", nameAr: "الزيتون" },
          { id: "tuffah", name: "Tuffah", nameAr: "التفاح" },
          { id: "daraj", name: "Daraj", nameAr: "الدرج" }
        ]
      },
      {
        id: "beit-lahia",
        name: "Beit Lahia",
        nameAr: "بيت لاهيا",
        districts: [
          { id: "beit-lahia-center", name: "Beit Lahia Center", nameAr: "وسط بيت لاهيا" },
          { id: "atatra", name: "Atatra", nameAr: "العطاطرة" }
        ]
      },
      {
        id: "beit-hanoun",
        name: "Beit Hanoun",
        nameAr: "بيت حانون",
        districts: [
          { id: "beit-hanoun-center", name: "Beit Hanoun Center", nameAr: "وسط بيت حانون" },
          { id: "industrial-zone", name: "Industrial Zone", nameAr: "المنطقة الصناعية" }
        ]
      }
    ]
  },
  {
    id: "north-gaza",
    name: "North Gaza",
    nameAr: "شمال غزة",
    cities: [
      {
        id: "jabalia",
        name: "Jabalia",
        nameAr: "جباليا",
        districts: [
          { id: "jabalia-camp", name: "Jabalia Camp", nameAr: "مخيم جباليا" },
          { id: "jabalia-nazla", name: "Jabalia Nazla", nameAr: "جباليا النزلة" }
        ]
      },
      {
        id: "umm-al-naser",
        name: "Umm Al-Naser",
        nameAr: "أم الناصر",
        districts: [
          { id: "umm-al-naser-center", name: "Umm Al-Naser Center", nameAr: "وسط أم الناصر" }
        ]
      }
    ]
  },
  {
    id: "deir-al-balah",
    name: "Deir Al-Balah",
    nameAr: "دير البلح",
    cities: [
      {
        id: "deir-al-balah-city",
        name: "Deir Al-Balah City",
        nameAr: "مدينة دير البلح",
        districts: [
          { id: "deir-al-balah-center", name: "Deir Al-Balah Center", nameAr: "وسط دير البلح" },
          { id: "maghazi", name: "Maghazi", nameAr: "المغازي" }
        ]
      },
      {
        id: "nuseirat",
        name: "Nuseirat",
        nameAr: "النصيرات",
        districts: [
          { id: "nuseirat-camp", name: "Nuseirat Camp", nameAr: "مخيم النصيرات" },
          { id: "nuseirat-jadida", name: "Nuseirat Jadida", nameAr: "النصيرات الجديدة" }
        ]
      }
    ]
  },
  {
    id: "khan-yunis",
    name: "Khan Yunis",
    nameAr: "خان يونس",
    cities: [
      {
        id: "khan-yunis-city",
        name: "Khan Yunis City",
        nameAr: "مدينة خان يونس",
        districts: [
          { id: "khan-yunis-center", name: "Khan Yunis Center", nameAr: "وسط خان يونس" },
          { id: "qarara", name: "Qarara", nameAr: "القرارة" },
          { id: "abasan", name: "Abasan", nameAr: "عبسان" }
        ]
      },
      {
        id: "bani-suheila",
        name: "Bani Suheila",
        nameAr: "بني سهيلا",
        districts: [
          { id: "bani-suheila-center", name: "Bani Suheila Center", nameAr: "وسط بني سهيلا" }
        ]
      }
    ]
  },
  {
    id: "rafah",
    name: "Rafah",
    nameAr: "رفح",
    cities: [
      {
        id: "rafah-city",
        name: "Rafah City",
        nameAr: "مدينة رفح",
        districts: [
          { id: "rafah-center", name: "Rafah Center", nameAr: "وسط رفح" },
          { id: "tal-sultan", name: "Tal Sultan", nameAr: "تل السلطان" },
          { id: "shaboura", name: "Shaboura", nameAr: "الشابورة" }
        ]
      }
    ]
  },
  {
    id: "jenin",
    name: "Jenin",
    nameAr: "جنين",
    cities: [
      {
        id: "jenin-city",
        name: "Jenin City",
        nameAr: "مدينة جنين",
        districts: [
          { id: "jenin-center", name: "Jenin Center", nameAr: "وسط جنين" },
          { id: "jenin-camp", name: "Jenin Camp", nameAr: "مخيم جنين" }
        ]
      },
      {
        id: "qabatiya",
        name: "Qabatiya",
        nameAr: "قباطية",
        districts: [
          { id: "qabatiya-center", name: "Qabatiya Center", nameAr: "وسط قباطية" }
        ]
      },
      {
        id: "silat-al-harithiya",
        name: "Silat Al-Harithiya",
        nameAr: "سيلة الحارثية",
        districts: [
          { id: "silat-center", name: "Silat Center", nameAr: "وسط سيلة الحارثية" }
        ]
      }
    ]
  },
  {
    id: "tubas",
    name: "Tubas",
    nameAr: "طوباس",
    cities: [
      {
        id: "tubas-city",
        name: "Tubas City",
        nameAr: "مدينة طوباس",
        districts: [
          { id: "tubas-center", name: "Tubas Center", nameAr: "وسط طوباس" }
        ]
      },
      {
        id: "tammun",
        name: "Tammun",
        nameAr: "طمون",
        districts: [
          { id: "tammun-center", name: "Tammun Center", nameAr: "وسط طمون" }
        ]
      }
    ]
  },
  {
    id: "tulkarm",
    name: "Tulkarm",
    nameAr: "طولكرم",
    cities: [
      {
        id: "tulkarm-city",
        name: "Tulkarm City",
        nameAr: "مدينة طولكرم",
        districts: [
          { id: "tulkarm-center", name: "Tulkarm Center", nameAr: "وسط طولكرم" },
          { id: "tulkarm-camp", name: "Tulkarm Camp", nameAr: "مخيم طولكرم" }
        ]
      },
      {
        id: "qalqilya",
        name: "Qalqilya",
        nameAr: "قلقيلية",
        districts: [
          { id: "qalqilya-center", name: "Qalqilya Center", nameAr: "وسط قلقيلية" }
        ]
      }
    ]
  },
  {
    id: "nablus",
    name: "Nablus",
    nameAr: "نابلس",
    cities: [
      {
        id: "nablus-city",
        name: "Nablus City",
        nameAr: "مدينة نابلس",
        districts: [
          { id: "nablus-old-city", name: "Old City", nameAr: "البلدة القديمة" },
          { id: "nablus-center", name: "Nablus Center", nameAr: "وسط نابلس" },
          { id: "askar-camp", name: "Askar Camp", nameAr: "مخيم عسكر" }
        ]
      },
      {
        id: "hawara",
        name: "Hawara",
        nameAr: "حوارة",
        districts: [
          { id: "hawara-center", name: "Hawara Center", nameAr: "وسط حوارة" }
        ]
      }
    ]
  },
  {
    id: "salfit",
    name: "Salfit",
    nameAr: "سلفيت",
    cities: [
      {
        id: "salfit-city",
        name: "Salfit City",
        nameAr: "مدينة سلفيت",
        districts: [
          { id: "salfit-center", name: "Salfit Center", nameAr: "وسط سلفيت" }
        ]
      },
      {
        id: "bidya",
        name: "Bidya",
        nameAr: "بديا",
        districts: [
          { id: "bidya-center", name: "Bidya Center", nameAr: "وسط بديا" }
        ]
      }
    ]
  },
  {
    id: "ramallah",
    name: "Ramallah and Al-Bireh",
    nameAr: "رام الله والبيرة",
    cities: [
      {
        id: "ramallah-city",
        name: "Ramallah",
        nameAr: "رام الله",
        districts: [
          { id: "ramallah-center", name: "Ramallah Center", nameAr: "وسط رام الله" },
          { id: "al-manara", name: "Al-Manara", nameAr: "المنارة" },
          { id: "al-masyoun", name: "Al-Masyoun", nameAr: "الماصيون" }
        ]
      },
      {
        id: "al-bireh",
        name: "Al-Bireh",
        nameAr: "البيرة",
        districts: [
          { id: "al-bireh-center", name: "Al-Bireh Center", nameAr: "وسط البيرة" }
        ]
      },
      {
        id: "beituniya",
        name: "Beituniya",
        nameAr: "بيتونيا",
        districts: [
          { id: "beituniya-center", name: "Beituniya Center", nameAr: "وسط بيتونيا" }
        ]
      }
    ]
  },
  {
    id: "jericho",
    name: "Jericho and Al-Aghwar",
    nameAr: "أريحا والأغوار",
    cities: [
      {
        id: "jericho-city",
        name: "Jericho",
        nameAr: "أريحا",
        districts: [
          { id: "jericho-center", name: "Jericho Center", nameAr: "وسط أريحا" },
          { id: "aqabat-jaber", name: "Aqabat Jaber", nameAr: "عقبة جبر" }
        ]
      }
    ]
  },
  {
    id: "jerusalem",
    name: "Jerusalem",
    nameAr: "القدس",
    cities: [
      {
        id: "jerusalem-city",
        name: "Jerusalem",
        nameAr: "القدس",
        districts: [
          { id: "old-city", name: "Old City", nameAr: "البلدة القديمة" },
          { id: "east-jerusalem", name: "East Jerusalem", nameAr: "القدس الشرقية" },
          { id: "west-jerusalem", name: "West Jerusalem", nameAr: "القدس الغربية" }
        ]
      },
      {
        id: "abu-dis",
        name: "Abu Dis",
        nameAr: "أبو ديس",
        districts: [
          { id: "abu-dis-center", name: "Abu Dis Center", nameAr: "وسط أبو ديس" }
        ]
      }
    ]
  },
  {
    id: "bethlehem",
    name: "Bethlehem",
    nameAr: "بيت لحم",
    cities: [
      {
        id: "bethlehem-city",
        name: "Bethlehem",
        nameAr: "بيت لحم",
        districts: [
          { id: "bethlehem-center", name: "Bethlehem Center", nameAr: "وسط بيت لحم" },
          { id: "manger-square", name: "Manger Square", nameAr: "ساحة المهد" }
        ]
      },
      {
        id: "beit-jala",
        name: "Beit Jala",
        nameAr: "بيت جالا",
        districts: [
          { id: "beit-jala-center", name: "Beit Jala Center", nameAr: "وسط بيت جالا" }
        ]
      },
      {
        id: "beit-sahour",
        name: "Beit Sahour",
        nameAr: "بيت ساحور",
        districts: [
          { id: "beit-sahour-center", name: "Beit Sahour Center", nameAr: "وسط بيت ساحور" }
        ]
      }
    ]
  },
  {
    id: "hebron",
    name: "Hebron",
    nameAr: "الخليل",
    cities: [
      {
        id: "hebron-city",
        name: "Hebron",
        nameAr: "الخليل",
        districts: [
          { id: "hebron-old-city", name: "Old City", nameAr: "البلدة القديمة" },
          { id: "hebron-center", name: "Hebron Center", nameAr: "وسط الخليل" },
          { id: "wadi-al-tuffah", name: "Wadi Al-Tuffah", nameAr: "وادي التفاح" }
        ]
      },
      {
        id: "dura",
        name: "Dura",
        nameAr: "دورا",
        districts: [
          { id: "dura-center", name: "Dura Center", nameAr: "وسط دورا" }
        ]
      },
      {
        id: "yatta",
        name: "Yatta",
        nameAr: "يطا",
        districts: [
          { id: "yatta-center", name: "Yatta Center", nameAr: "وسط يطا" }
        ]
      }
    ]
  }
];

// Helper functions to get options for dropdowns
export const getGovernorateOptions = (locale: string = "en") => {
  return [
    { value: "", label: locale === "ar" ? "اختر المحافظة" : "Choose Governorate" },
    ...palestineLocations.map(gov => ({
      value: gov.id,
      label: locale === "ar" ? gov.nameAr : gov.name
    }))
  ];
};

export const getCityOptions = (governorateId: string, locale: string = "en") => {
  if (!governorateId) return [{ value: "", label: locale === "ar" ? "اختر المدينة" : "Choose City" }];
  
  const governorate = palestineLocations.find(gov => gov.id === governorateId);
  if (!governorate) return [{ value: "", label: locale === "ar" ? "اختر المدينة" : "Choose City" }];
  
  return [
    { value: "", label: locale === "ar" ? "اختر المدينة" : "Choose City" },
    ...governorate.cities.map(city => ({
      value: city.id,
      label: locale === "ar" ? city.nameAr : city.name
    }))
  ];
};

export const getDistrictOptions = (governorateId: string, cityId: string, locale: string = "en") => {
  if (!governorateId || !cityId) return [{ value: "", label: locale === "ar" ? "اختر المنطقة" : "Choose District" }];
  
  const governorate = palestineLocations.find(gov => gov.id === governorateId);
  if (!governorate) return [{ value: "", label: locale === "ar" ? "اختر المنطقة" : "Choose District" }];
  
  const city = governorate.cities.find(c => c.id === cityId);
  if (!city) return [{ value: "", label: locale === "ar" ? "اختر المنطقة" : "Choose District" }];
  
  return [
    { value: "", label: locale === "ar" ? "اختر المنطقة" : "Choose District" },
    ...city.districts.map(district => ({
      value: district.id,
      label: locale === "ar" ? district.nameAr : district.name
    }))
  ];
};