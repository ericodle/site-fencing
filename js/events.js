/* ---------------------------------------------------------------------------
   Sheshouzuo Fencing Club — club calendar
   Every event on the calendar, and the tournament list under it, comes from
   this file. Add an object, save, reload. There is no database yet.

     id            anything unique
     type          "regular" (a weekly session) | "practice" | "tournament" |
                   "interclub" | "social"
     start, end    Taipei time, "2026-10-03 09:00" — or "2026-10-17" for a
                   whole day. A multi-day event runs from start's day to end's.
     title, place  { en, zh }
     map           optional search text for the "Open map" link
     details       { en, zh }
     registration  optional; lists the event in the tournament desk:
                   { status: "open" | "soon" | "tba" | "closed", en, zh }
     featured      optional; true adds a star
     repeat        optional; "weekly" repeats the event every week from start
     until         with repeat, the last date it can fall on ("2026-12-31")

   The events below are samples. Replace them with the real season.
   --------------------------------------------------------------------------- */
window.CLUB_EVENTS = [
  // regular weekly sessions
  {
    id: "weekly-beginner-adult-epee",
    type: "regular",
    repeat: "weekly",
    start: "2026-09-07 19:00",
    end: "2026-09-07 21:00",
    until: "2026-12-31",
    title: { en: "Adult beginner lessons · Épée", zh: "成人初學團體課・銳劍" },
    place: { en: "Bade Road venue, B1", zh: "八德路場地 B1" },
    map: "No. 128, Section 4, Bade Road, Taipei",
    details: { en: "Group épée lessons for adult beginners. You finish competition-ready.", zh: "成人銳劍初學團體課，結業即具備參賽能力。" }
  },
  {
    id: "weekly-beginner-kids",
    type: "regular",
    repeat: "weekly",
    start: "2026-09-08 17:00",
    end: "2026-09-08 18:30",
    until: "2026-12-31",
    title: { en: "Kids' beginner lessons (7–13)", zh: "兒童初學團體課 (7–13)" },
    place: { en: "Bade Road venue, B1", zh: "八德路場地 B1" },
    map: "No. 128, Section 4, Bade Road, Taipei",
    details: { en: "Group épée and saber lessons for ages 7–13.", zh: "7–13 歲銳劍與軍刀初學團體課。" }
  },
  {
    id: "weekly-open-training",
    type: "regular",
    repeat: "weekly",
    start: "2026-09-08 19:00",
    end: "2026-09-08 21:30",
    until: "2026-12-31",
    title: { en: "Open training", zh: "自由練習" },
    place: { en: "Bade Road venue, B1", zh: "八德路場地 B1" },
    map: "No. 128, Section 4, Bade Road, Taipei",
    details: { en: "Épée and saber bouting with a coach on the floor. Guests from other clubs welcome.", zh: "銳劍與軍刀自由對打，場上有教練。歡迎其他俱樂部劍手。" }
  },
  {
    id: "weekly-park-footwork",
    type: "regular",
    repeat: "weekly",
    start: "2026-09-09 06:45",
    end: "2026-09-09 07:45",
    until: "2026-12-31",
    title: { en: "Park footwork", zh: "公園步法" },
    place: { en: "Minsheng Park, Songshan", zh: "松山區民生公園" },
    map: "Minsheng Park, Taipei",
    details: { en: "No blades needed: footwork drills in running shoes. Moves under cover if it rains.", zh: "不需用劍：穿跑鞋練步法。遇雨移至有遮蔽處。" }
  },
  {
    id: "weekly-saber-night",
    type: "regular",
    repeat: "weekly",
    start: "2026-09-09 19:00",
    end: "2026-09-09 21:00",
    until: "2026-12-31",
    title: { en: "Saber night", zh: "軍刀之夜" },
    place: { en: "Bade Road venue, B1", zh: "八德路場地 B1" },
    map: "No. 128, Section 4, Bade Road, Taipei",
    details: { en: "Saber drills and bouting.", zh: "軍刀練習與對打。" }
  },
  {
    id: "weekly-beginner-adult-saber",
    type: "regular",
    repeat: "weekly",
    start: "2026-09-10 19:00",
    end: "2026-09-10 21:00",
    until: "2026-12-31",
    title: { en: "Adult beginner lessons · Saber", zh: "成人初學團體課・軍刀" },
    place: { en: "Bade Road venue, B1", zh: "八德路場地 B1" },
    map: "No. 128, Section 4, Bade Road, Taipei",
    details: { en: "Group saber lessons for adult beginners. You finish competition-ready.", zh: "成人軍刀初學團體課，結業即具備參賽能力。" }
  },
  {
    id: "weekly-club-night",
    type: "regular",
    repeat: "weekly",
    start: "2026-09-11 19:30",
    end: "2026-09-11 22:00",
    until: "2026-12-31",
    title: { en: "Club night & ladder bouts", zh: "俱樂部之夜・排位賽" },
    place: { en: "Bade Road venue, B1", zh: "八德路場地 B1" },
    map: "No. 128, Section 4, Bade Road, Taipei",
    details: { en: "Ladder bouts in épée and saber. Guests from other clubs welcome.", zh: "銳劍與軍刀排位賽。歡迎其他俱樂部劍手。" }
  },
  {
    id: "weekly-park-cross-training",
    type: "regular",
    repeat: "weekly",
    start: "2026-09-12 08:00",
    end: "2026-09-12 09:30",
    until: "2026-12-31",
    title: { en: "Park cross-training", zh: "公園體能訓練" },
    place: { en: "Minsheng Park, Songshan", zh: "松山區民生公園" },
    map: "Minsheng Park, Taipei",
    details: { en: "Conditioning and agility, no blades needed.", zh: "體能與敏捷訓練，不需用劍。" }
  },
  {
    id: "weekly-tournament-training",
    type: "regular",
    repeat: "weekly",
    start: "2026-09-12 13:00",
    end: "2026-09-12 16:00",
    until: "2026-12-31",
    title: { en: "Tournament training", zh: "備賽訓練" },
    place: { en: "Bade Road venue, B1", zh: "八德路場地 B1" },
    map: "No. 128, Section 4, Bade Road, Taipei",
    details: { en: "Bouting and video review aimed at the next tournament.", zh: "以下一場比賽為目標的對打與錄影檢討。" }
  },
  {
    id: "weekly-open-mat",
    type: "regular",
    repeat: "weekly",
    start: "2026-09-13 14:00",
    end: "2026-09-13 17:00",
    until: "2026-12-31",
    title: { en: "Open mat & private lessons", zh: "自由練習・個人課" },
    place: { en: "Bade Road venue, B1", zh: "八德路場地 B1" },
    map: "No. 128, Section 4, Bade Road, Taipei",
    details: { en: "Open bouting, with private lessons alongside.", zh: "自由對打，並同時進行個人課。" }
  },

  // one-off events
  {
    id: "popup-dajia-0905",
    type: "practice",
    start: "2026-09-05 10:00",
    end: "2026-09-05 12:00",
    title: { en: "Pop-up bouting · Dajia Riverside", zh: "快閃對打・大佳河濱公園" },
    place: { en: "Dajia Riverside Park, Zhongshan", zh: "中山區大佳河濱公園" },
    map: "Dajia Riverside Park, Taipei",
    details: {
      en: "Footwork warm-up, then bouts on the wireless scoring kit by the river.",
      zh: "步法熱身後，在河邊以無線計分設備進行對打。"
    }
  },
  {
    id: "interclub-neihu-0912",
    type: "interclub",
    start: "2026-09-12 19:00",
    end: "2026-09-12 21:30",
    title: { en: "Open night with a Neihu club", zh: "內湖俱樂部開放之夜" },
    place: { en: "Partner club, Neihu", zh: "內湖合作俱樂部" },
    details: {
      en: "Our turn to be the guests. Bring your own kit.",
      zh: "這次換我們當客人，請自備裝備。"
    }
  },
  {
    id: "popup-daan-0919",
    type: "practice",
    start: "2026-09-19 09:00",
    end: "2026-09-19 11:30",
    title: { en: "Pop-up practice · Da'an Park", zh: "快閃練習・大安森林公園" },
    place: { en: "Da'an Forest Park, by the amphitheater", zh: "大安森林公園露天音樂台旁" },
    map: "Da'an Forest Park amphitheater, Taipei",
    details: {
      en: "Footwork ladders, then open bouting on wireless scoring under the trees. Loaner gear available.",
      zh: "步法梯訓練後，在樹下以無線計分自由對打。可借用裝備。"
    }
  },
  {
    id: "clinic-referee-0920",
    type: "practice",
    start: "2026-09-20 14:00",
    end: "2026-09-20 17:00",
    title: { en: "Referee clinic", zh: "裁判講習" },
    place: { en: "Bade Road venue, B1", zh: "八德路場地 B1" },
    map: "No. 128, Section 4, Bade Road, Taipei",
    details: {
      en: "Right of way, hand signals and running a pool — everyone refs at tournaments, so everyone learns.",
      zh: "優先權、裁判手勢與小組賽執裁——比賽時人人都要當裁判，所以人人都要學。"
    }
  },
  {
    id: "social-midautumn-0926",
    type: "social",
    start: "2026-09-26 18:30",
    end: "2026-09-26 21:30",
    title: { en: "Mid-Autumn barbecue", zh: "中秋烤肉" },
    place: { en: "Dajia Riverside Park, Zhongshan", zh: "中山區大佳河濱公園" },
    map: "Dajia Riverside Park, Taipei",
    details: {
      en: "Members, families and friends from other clubs. Bring something for the grill.",
      zh: "會員、家人與其他俱樂部的朋友都歡迎，帶點食材一起烤。"
    }
  },
  {
    id: "deadline-ranking1",
    type: "tournament",
    start: "2026-09-28",
    title: { en: "Entries close · Ranking Round 1", zh: "截止報名・排名賽第一站" },
    place: { en: "Online", zh: "線上" },
    details: {
      en: "Last day to enter National Ranking Tournament Round 1. Message us on LINE if you need a hand.",
      zh: "全國排名賽第一站報名最後一天。需要協助請以 LINE 聯絡我們。"
    }
  },
  {
    id: "popup-tianmu-1003",
    type: "practice",
    start: "2026-10-03 09:00",
    end: "2026-10-03 12:00",
    title: { en: "Pop-up practice · Tianmu", zh: "快閃練習・天母" },
    place: { en: "Tianmu Sports Park, Shilin", zh: "士林區天母運動公園" },
    map: "Tianmu Sports Park, Taipei",
    details: {
      en: "Tournament-pace bouting two weeks out from Round 1.",
      zh: "排名賽第一站前兩週，以比賽節奏進行對打。"
    }
  },
  {
    id: "interclub-hsinchu-1010",
    type: "interclub",
    start: "2026-10-10 14:00",
    end: "2026-10-10 18:00",
    title: { en: "Visit: open bouting in Hsinchu", zh: "拜訪：新竹開放對打" },
    place: { en: "Partner club, Hsinchu", zh: "新竹合作俱樂部" },
    details: {
      en: "Carpool leaves Taipei Main Station at 12:30 — sign up on Discord.",
      zh: "共乘 12:30 從台北車站出發，請在 Discord 登記。"
    }
  },
  {
    id: "ranking-1",
    type: "tournament",
    start: "2026-10-17",
    end: "2026-10-18",
    featured: true,
    title: { en: "National Ranking Tournament · Round 1", zh: "全國排名賽・第一站" },
    place: { en: "Taichung · épée, saber · Open, U20", zh: "台中・銳劍、軍刀・公開組、U20" },
    map: "Taichung",
    registration: { status: "soon", en: "Entries close Sep 28", zh: "9 月 28 日截止報名" },
    details: {
      en: "Our first target of the season. Shared rooms and carpools are organized on Discord.",
      zh: "本賽季的第一個目標。住宿與共乘在 Discord 上安排。"
    }
  },
  {
    id: "popup-bitan-1024",
    type: "practice",
    start: "2026-10-24 09:00",
    end: "2026-10-24 11:00",
    title: { en: "Pop-up practice · Bitan", zh: "快閃練習・碧潭" },
    place: { en: "Bitan riverside plaza, Xindian", zh: "新店碧潭河濱廣場" },
    map: "Bitan riverside, Xindian",
    details: {
      en: "Footwork and conditioning by the river, then coffee.",
      zh: "在河邊練步法與體能，結束後一起喝咖啡。"
    }
  },
  {
    id: "social-halloween-1031",
    type: "social",
    start: "2026-10-31 19:00",
    end: "2026-10-31 22:00",
    title: { en: "Halloween bouting night", zh: "萬聖節對打之夜" },
    place: { en: "Bade Road venue, B1", zh: "八德路場地 B1" },
    map: "No. 128, Section 4, Bade Road, Taipei",
    details: {
      en: "Costumes over kit are encouraged, as long as the mask still fits.",
      zh: "歡迎在裝備外穿上變裝，只要面罩還戴得上。"
    }
  },
  {
    id: "taipei-open",
    type: "tournament",
    start: "2026-11-07",
    title: { en: "Taipei City Open", zh: "臺北市擊劍公開賽" },
    place: { en: "Taipei · épée, saber · Open, Veterans", zh: "台北・銳劍、軍刀・公開組、壯年組" },
    registration: { status: "open", en: "Entries close Oct 16", zh: "10 月 16 日截止報名" },
    details: {
      en: "A home event, so no travel. A good first tournament for anyone through the beginner course.",
      zh: "在台北舉行，不必長途移動。很適合完成初學課程的劍手當作第一場比賽。"
    }
  },
  {
    id: "popup-neihu-1114",
    type: "practice",
    start: "2026-11-14 09:00",
    end: "2026-11-14 11:30",
    title: { en: "Pop-up practice · Neihu", zh: "快閃練習・內湖" },
    place: { en: "Neihu Riverside Park", zh: "內湖河濱公園" },
    map: "Neihu Riverside Park, Taipei",
    details: {
      en: "Open to fencers from any club. Wireless scoring and loaner gear on site.",
      zh: "任何俱樂部的劍手都歡迎。現場提供無線計分與借用裝備。"
    }
  },
  {
    id: "friendly-1129",
    type: "interclub",
    start: "2026-11-29 10:00",
    end: "2026-11-29 17:00",
    featured: true,
    title: { en: "Inter-club friendly bouts", zh: "跨館友誼賽" },
    place: { en: "Hosted by Sheshouzuo · Bade Road venue", zh: "射手座主辦・八德路場地" },
    map: "No. 128, Section 4, Bade Road, Taipei",
    registration: { status: "open", en: "Sign up on LINE", zh: "請以 LINE 報名" },
    details: {
      en: "All clubs welcome, no ranking points. Pools in the morning, direct elimination after lunch.",
      zh: "歡迎各館參加，不計積分。上午小組賽，午餐後淘汰賽。"
    }
  },
  {
    id: "camp-1205",
    type: "practice",
    start: "2026-12-05",
    end: "2026-12-06",
    title: { en: "Tournament prep camp", zh: "賽前集訓營" },
    place: { en: "Bade Road venue, B1", zh: "八德路場地 B1" },
    map: "No. 128, Section 4, Bade Road, Taipei",
    details: {
      en: "Two days of bouting, video review and pool practice ahead of Round 2.",
      zh: "排名賽第二站前的兩天集訓：對打、錄影檢討與小組賽模擬。"
    }
  },
  {
    id: "ranking-2",
    type: "tournament",
    start: "2026-12-12",
    end: "2026-12-13",
    title: { en: "National Ranking Tournament · Round 2", zh: "全國排名賽・第二站" },
    place: { en: "Kaohsiung · épée, saber · Open, U17, U20", zh: "高雄・銳劍、軍刀・公開組、U17、U20" },
    map: "Kaohsiung",
    registration: { status: "tba", en: "We'll post it on LINE", zh: "公告後將發布於 LINE" },
    details: {
      en: "Entry details are not out yet. We'll post them on LINE the day they are.",
      zh: "報名資訊尚未公布，公布當天我們會發在 LINE 上。"
    }
  },
  {
    id: "social-yearend-1219",
    type: "social",
    start: "2026-12-19 18:30",
    end: "2026-12-19 22:00",
    title: { en: "Year-end party", zh: "年終聚會" },
    place: { en: "Venue announced on LINE", zh: "地點將於 LINE 公布" },
    details: {
      en: "Season awards, bad fencing jokes, and a toast to every club we fenced with this year.",
      zh: "賽季頒獎、擊劍冷笑話，並向今年一起擊劍的每間俱樂部舉杯。"
    }
  }
];
