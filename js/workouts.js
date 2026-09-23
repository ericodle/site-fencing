/* ---------------------------------------------------------------------------
   Kuou Fencing Club — workouts
   Every session on workouts.html, and the coach's timer that runs it, comes
   from this file. Add an object, save, reload.

     id        anything unique; also the ?w= value that opens it
     title     { en, zh }
     tag       { en, zh } — the short line on its card
     summary   { en, zh }
     needs     { en, zh } — equipment and space
     notes     [{ en, zh }] — the rules that hold for the whole session
     blocks    in order; each is either a list of steps or a set of intervals

   A block of steps:
     { name, about, steps: [{ kind, secs, name, cue }] }
     kind is "easy" (warm-up, mobility, cool-down), "work" or "rest".

   A block of intervals, which the timer expands into work / rest pairs:
     { name, about, work, rest, restName, repeat, moves: [{ name, cue }] }
     Each move gets `work` seconds and is followed by `rest` seconds of rest.
     repeat runs the whole list of moves that many times (default 1).

   name, about, cue and restName are all { en, zh }. The blocks of a session
   should add up to its full length: the timetable is drawn from the seconds
   here, not typed in separately.
   --------------------------------------------------------------------------- */
window.CLUB_WORKOUTS = [
  {
    id: "footwork-cross-training",
    title: { en: "Footwork cross-training", zh: "步法交叉訓練" },
    tag: { en: "60 min · footwork · all levels", zh: "60 分鐘・步法・不限程度" },
    summary: {
      en: "A general hour for any floor or park: footwork fundamentals, agility and plyometrics, partner distance work, bout-tempo conditioning and core, with every rest period timed.",
      zh: "適用於任何場地或公園的通用一小時課表：步法基本功、敏捷與增強式訓練、兩人距離練習、比賽節奏體能與核心，每段休息都計時。"
    },
    needs: {
      en: "Four cones, a flat 12 m strip, and a partner — or a random-number app for block C.",
      zh: "四個角錐、一段 12 公尺平坦場地，以及一位夥伴——C 段也可改用亂數 App。"
    },
    notes: [
      {
        en: "The rest is part of the training. Cutting it turns a speed session into a conditioning session.",
        zh: "休息也是訓練的一部分。把休息砍掉，速度課就變成了體能課。"
      },
      {
        en: "Land quietly. When the landings get loud, block B is over, whatever the clock says.",
        zh: "落地要輕。一旦落地變得大聲，B 段就到此為止，不論時間還剩多少。"
      },
      {
        en: "No flèche on concrete or asphalt. Saber fencers take the saber option wherever one is given.",
        zh: "水泥或柏油地面禁止衝刺。凡有軍刀替代動作之處，軍刀劍手一律採用替代動作。"
      },
      {
        en: "Under 14: halve the jump contacts in block B and keep everything else as written.",
        zh: "14 歲以下：B 段的跳躍次數減半，其餘照表進行。"
      }
    ],
    blocks: [
      {
        name: { en: "Warm-up", zh: "熱身" },
        about: { en: "Raise the temperature, open the hips and ankles, wake the feet up. No speed yet.", zh: "提高體溫、打開髖與腳踝、喚醒雙腳。先不求速度。" },
        steps: [
          {
            kind: "easy", secs: 180,
            name: { en: "Easy jog or rope", zh: "輕鬆慢跑或跳繩" },
            cue: { en: "Conversational pace. This is only to get warm.", zh: "能邊動邊說話的強度，只為了讓身體熱起來。" }
          },
          {
            kind: "easy", secs: 180,
            name: { en: "Dynamic mobility", zh: "動態伸展" },
            cue: { en: "Leg swings front-to-back and across, hip circles, walking lunges with a twist, ankle circles.", zh: "前後與左右擺腿、繞髖、轉體弓箭步走、轉腳踝。" }
          },
          {
            kind: "easy", secs: 120,
            name: { en: "Activation", zh: "神經肌肉啟動" },
            cue: { en: "A-skips, lateral shuffles, carioca; finish with three 5-second bursts of quick feet.", zh: "A 字跳步、側併步、交叉步跑；最後做三次 5 秒快速碎步。" }
          }
        ]
      },
      {
        name: { en: "A — Footwork fundamentals", zh: "A——步法基本功" },
        about: { en: "One movement per round, done cleanly at the fastest speed that stays clean. Walk back to the line in the rest.", zh: "每組一個動作，在保持乾淨的前提下盡可能快。休息時走回起始線。" },
        work: 45, rest: 45,
        restName: { en: "Rest — walk back to the line", zh: "休息——走回起始線" },
        moves: [
          {
            name: { en: "Advance–retreat, steady rhythm", zh: "前進－後退，穩定節奏" },
            cue: { en: "Same step length every time. The head does not bob.", zh: "每一步同樣長度，頭不上下起伏。" }
          },
          {
            name: { en: "Double advance, double retreat", zh: "兩次前進、兩次後退" },
            cue: { en: "Two quick steps, then settle. Don't drift upright.", zh: "兩步要快，然後站穩。身體不要漸漸站直。" }
          },
          {
            name: { en: "Advance–lunge–recover", zh: "前進－弓步－還原" },
            cue: { en: "Arm before foot. Recover to a full en garde.", zh: "先出手再出腳，還原到完整的實戰姿勢。" }
          },
          {
            name: { en: "Retreat–lunge", zh: "後退－弓步" },
            cue: { en: "Lunge out of the retreat with no pause between.", zh: "後退直接接弓步，中間不停頓。" }
          },
          {
            name: { en: "Check-step advance", zh: "停頓步前進" },
            cue: { en: "A half-step, a pause, then finish. Break your own rhythm.", zh: "半步、停頓、再完成。打破自己的節奏。" }
          },
          {
            name: { en: "Balestra–lunge", zh: "跳步－弓步" },
            cue: { en: "A low, flat jump. Land on both feet together and go.", zh: "跳得低而平，雙腳同時落地隨即出擊。" }
          },
          {
            name: { en: "Cross-step forward and back", zh: "交叉步前進與後退" },
            cue: { en: "Stay sideways; the hips don't open. Saber: double advances instead.", zh: "保持側身，髖部不要打開。軍刀改做兩次前進。" }
          },
          {
            name: { en: "Free footwork", zh: "自由步法" },
            cue: { en: "Whatever you're worst at, at bout speed.", zh: "挑你最弱的動作，用比賽速度做。" }
          }
        ]
      },
      {
        name: { en: "B — Agility and plyometrics", zh: "B——敏捷與增強式訓練" },
        about: { en: "Four movements, three times through. Every landing is quiet and every landing is held.", zh: "四個動作，循環三輪。每次落地都要輕，也都要停穩。" },
        work: 30, rest: 30, repeat: 3,
        moves: [
          {
            name: { en: "Lateral line hops", zh: "左右跳線" },
            cue: { en: "Both feet, over a line, small and fast.", zh: "雙腳左右跳過一條線，小而快。" }
          },
          {
            name: { en: "Split jumps", zh: "弓步換腳跳" },
            cue: { en: "Switch legs in the air, land in a lunge, stay tall.", zh: "空中換腳，落成弓步，上身挺直。" }
          },
          {
            name: { en: "Skater bounds", zh: "滑冰側跳" },
            cue: { en: "Push sideways and stick each landing for a beat.", zh: "向側推蹬，每次落地停穩一拍。" }
          },
          {
            name: { en: "Broad jump and stick", zh: "立定跳遠並定住" },
            cue: { en: "Jump forward, freeze the landing for two seconds, walk back.", zh: "向前跳，落地定住兩秒，再走回來。" }
          }
        ]
      },
      {
        name: { en: "Water break", zh: "補水" },
        about: { en: "Drink, and pair up for block C.", zh: "喝水，並為 C 段兩人一組。" },
        steps: [
          {
            kind: "rest", secs: 120,
            name: { en: "Water break", zh: "補水休息" },
            cue: { en: "Drink before you're thirsty. Find a partner.", zh: "口渴前就喝水。找好夥伴。" }
          }
        ]
      },
      {
        name: { en: "C — Distance and reaction", zh: "C——距離與反應" },
        about: { en: "Partner work at a real fencing distance. Alone, use a random-number app on a 2-second beep, with a number mapped to each action.", zh: "以真實交鋒距離進行的兩人練習。一個人時，用亂數 App 每 2 秒嗶一次，每個數字對應一個動作。" },
        work: 60, rest: 60,
        restName: { en: "Rest — swap roles", zh: "休息——交換角色" },
        moves: [
          {
            name: { en: "Mirror drill", zh: "鏡像練習" },
            cue: { en: "The follower holds the distance exactly. Swap leader at 30 seconds.", zh: "跟隨者精準保持距離。30 秒時交換帶領者。" }
          },
          {
            name: { en: "Called changes", zh: "口令變換" },
            cue: { en: "Forward, back, lunge, hold — on the call, never before it.", zh: "前進、後退、弓步、停——聽到口令才動，絕不搶先。" }
          },
          {
            name: { en: "Hand-signal lunges", zh: "手勢弓步" },
            cue: { en: "The partner opens a hand at random. Lunge to it the moment it opens.", zh: "夥伴隨機張開手掌，一張開就弓步刺向它。" }
          },
          {
            name: { en: "Distance gate", zh: "距離判斷" },
            cue: { en: "The partner moves and stops. Lunge only when the stop leaves you in distance.", zh: "夥伴移動後停下，只有停下時在距離內才弓步。" }
          },
          {
            name: { en: "Mirror drill with attacks", zh: "鏡像練習加進攻" },
            cue: { en: "The leader may lunge at any time; the follower escapes with the feet alone.", zh: "帶領者可隨時弓步，跟隨者只能用步法脫離。" }
          }
        ]
      },
      {
        name: { en: "D — Bout endurance", zh: "D——比賽耐力" },
        about: { en: "Three two-minute bouts of footwork, each as long as a real exchange of touches gets.", zh: "三回合、每回合兩分鐘的步法，長度接近實戰中一段連續交鋒。" },
        work: 120, rest: 60,
        restName: { en: "Rest — walk, breathe through the nose", zh: "休息——走動，用鼻子呼吸" },
        moves: [
          {
            name: { en: "Bout-tempo footwork", zh: "比賽節奏步法" },
            cue: { en: "Move continuously at bout tempo. Full-speed attack every 15 seconds.", zh: "以比賽節奏持續移動，每 15 秒全速進攻一次。" }
          }
        ],
        repeat: 3
      },
      {
        name: { en: "E — Core and stability", zh: "E——核心與穩定" },
        about: { en: "Short holds, done well. Keep the tempo, shorten the range.", zh: "短時間支撐，做到確實。維持節奏，縮小幅度。" },
        work: 30, rest: 15,
        moves: [
          {
            name: { en: "Front plank", zh: "棒式" },
            cue: { en: "Squeeze the glutes; ribs down.", zh: "夾臀，肋骨下收。" }
          },
          {
            name: { en: "Side plank, left", zh: "左側棒式" },
            cue: { en: "Hips high, one straight line from head to heel.", zh: "髖部抬高，頭到腳跟成一直線。" }
          },
          {
            name: { en: "Side plank, right", zh: "右側棒式" },
            cue: { en: "Hips high, one straight line from head to heel.", zh: "髖部抬高，頭到腳跟成一直線。" }
          },
          {
            name: { en: "Dead bug", zh: "死蟲式" },
            cue: { en: "The lower back stays pressed to the ground.", zh: "下背始終貼地。" }
          }
        ]
      },
      {
        name: { en: "Cool-down", zh: "緩和" },
        about: { en: "Bring the heart rate down and give the calves and hips back their length.", zh: "讓心跳降下來，把小腿與髖部拉回原本的長度。" },
        steps: [
          {
            kind: "easy", secs: 60,
            name: { en: "Walk and shake out", zh: "走動放鬆" },
            cue: { en: "Walk the strip and let the legs go loose.", zh: "沿場地走動，讓雙腿放鬆。" }
          },
          {
            kind: "easy", secs: 60,
            name: { en: "Calf and soleus stretch", zh: "小腿伸展" },
            cue: { en: "30 seconds a side: straight knee first, then bent.", zh: "每側 30 秒：先直膝，再屈膝。" }
          },
          {
            kind: "easy", secs: 60,
            name: { en: "Hip flexor stretch", zh: "髖屈肌伸展" },
            cue: { en: "Half-kneeling, 30 seconds a side. Tuck the pelvis.", zh: "單膝跪姿，每側 30 秒。骨盆後傾。" }
          },
          {
            kind: "easy", secs: 60,
            name: { en: "Hamstrings and breathing", zh: "腿後側伸展與呼吸" },
            cue: { en: "A seated reach, then four slow breaths.", zh: "坐姿前伸，最後四次緩慢呼吸。" }
          }
        ]
      }
    ]
  }
];
