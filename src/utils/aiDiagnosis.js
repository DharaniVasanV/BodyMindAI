// Hardcoded AI diagnosis data - realistic medical responses
const diagnosisData = {
  head: {
    general: [
      {
        cause: "Tension Headache",
        confidence: 78,
        organs: ["Brain", "Scalp muscles", "Neck muscles"],
        spread: "May radiate to neck and shoulders. Usually bilateral pressure.",
        medications: ["Ibuprofen 400mg", "Paracetamol 500mg", "Aspirin 325mg"],
        recovery: ["Rest in a quiet dark room", "Stay hydrated (2L water/day)", "Apply cold/warm compress", "Avoid screen time", "Gentle neck stretches"]
      },
      {
        cause: "Migraine",
        confidence: 65,
        organs: ["Brain", "Blood vessels", "Trigeminal nerve"],
        spread: "Typically one-sided, can affect vision. May cause nausea.",
        medications: ["Sumatriptan 50mg", "Naproxen 500mg", "Rizatriptan 10mg"],
        recovery: ["Sleep in a dark quiet room", "Avoid triggers (stress, certain foods)", "Stay hydrated", "Apply ice pack to forehead", "Consult neurologist if recurrent"]
      },
      {
        cause: "Sinusitis / Sinus Pressure",
        confidence: 45,
        organs: ["Sinuses", "Nasal passages", "Frontal lobe area"],
        spread: "Pressure behind eyes and forehead. May worsen when bending forward.",
        medications: ["Fluticasone nasal spray", "Saline nasal rinse", "Decongestants"],
        recovery: ["Steam inhalation", "Warm compress on face", "Elevate head while sleeping", "Avoid allergens"]
      }
    ]
  },
  neck: {
    general: [
      {
        cause: "Cervical Spondylosis (Neck Arthritis)",
        confidence: 72,
        organs: ["Cervical vertebrae", "Intervertebral discs", "Neck muscles"],
        spread: "May radiate into shoulders and arms. Stiffness in mornings.",
        medications: ["Diclofenac gel", "Muscle relaxants", "Calcium supplements"],
        recovery: ["Neck physiotherapy exercises", "Avoid prolonged screen use", "Use ergonomic pillow", "Heat therapy", "Posture correction"]
      },
      {
        cause: "Muscle Strain / Torticollis",
        confidence: 68,
        organs: ["Sternocleidomastoid muscle", "Trapezius muscle"],
        spread: "Localized stiffness, may limit head rotation.",
        medications: ["Ibuprofen 400mg", "Diclofenac sodium", "Muscle relaxant spray"],
        recovery: ["Gentle neck rotations", "Heat compress for 15min 3x daily", "Avoid sudden movements", "Rest"]
      },
      {
        cause: "Herniated Cervical Disc",
        confidence: 40,
        organs: ["C4-C6 discs", "Spinal cord", "Nerve roots"],
        spread: "Can cause tingling or numbness down one or both arms.",
        medications: ["Pregabalin", "Methylcobalamin (Vit B12)", "Anti-inflammatories"],
        recovery: ["MRI recommended", "Physiotherapy", "Cervical collar (short-term)", "Consult orthopedic surgeon"]
      }
    ]
  },
  chest: {
    general: [
      {
        cause: "Costochondritis (Chest Wall Pain)",
        confidence: 70,
        organs: ["Cartilage between ribs and sternum", "Chest wall muscles"],
        spread: "Sharp localized pain at sternum. Worsens with pressure or deep breath.",
        medications: ["Ibuprofen 400mg", "Naproxen", "Topical diclofenac"],
        recovery: ["Rest and avoid heavy lifting", "Heat therapy to chest wall", "Gentle breathing exercises", "Reduce physical exertion"]
      },
      {
        cause: "Acid Reflux / GERD",
        confidence: 62,
        organs: ["Esophagus", "Stomach", "Lower esophageal sphincter"],
        spread: "Burning sensation rising to throat. Often worse after eating or lying down.",
        medications: ["Omeprazole 20mg", "Ranitidine", "Antacids (Gaviscon)"],
        recovery: ["Avoid spicy/fatty foods", "Don't lie down within 2hrs of eating", "Elevate head of bed", "Small frequent meals"]
      },
      {
        cause: "Anxiety / Panic Attack",
        confidence: 50,
        organs: ["Heart", "Lungs", "Autonomic nervous system"],
        spread: "Tightness spreading to throat, shortness of breath, palpitations.",
        medications: ["Deep breathing exercises", "Propranolol (if prescribed)", "Anxiolytics if required"],
        recovery: ["Practice 4-7-8 breathing", "Grounding techniques", "Regular exercise", "Limit caffeine", "Consider counseling"]
      }
    ]
  },
  stomach: {
    general: [
      {
        cause: "Gastritis / Peptic Ulcer",
        confidence: 74,
        organs: ["Stomach lining", "Duodenum", "Gastric mucosa"],
        spread: "May radiate to back. Worse on empty stomach, better after eating.",
        medications: ["Pantoprazole 40mg", "Sucralfate", "Antacids"],
        recovery: ["Eat small regular meals", "Avoid NSAIDs", "Limit alcohol and caffeine", "Avoid spicy food", "H. pylori test recommended"]
      },
      {
        cause: "Irritable Bowel Syndrome (IBS)",
        confidence: 60,
        organs: ["Large intestine", "Small intestine", "Enteric nervous system"],
        spread: "Cramping, bloating. Associated with bowel habit changes.",
        medications: ["Mebeverine", "Peppermint oil capsules", "Probiotics"],
        recovery: ["Low-FODMAP diet", "Regular meal times", "Stress management", "Adequate fiber intake", "Stay hydrated"]
      },
      {
        cause: "Appendicitis (early)",
        confidence: 30,
        organs: ["Appendix", "Peritoneum"],
        spread: "Pain migrates from navel to lower right. Fever may develop.",
        medications: ["Seek immediate medical attention", "Do not take pain relievers before diagnosis"],
        recovery: ["Emergency evaluation required", "Ultrasound / CT scan needed", "May require surgical removal"]
      }
    ]
  },
  "lower-abdomen": {
    general: [
      {
        cause: "Urinary Tract Infection (UTI)",
        confidence: 75,
        organs: ["Bladder", "Urethra", "Kidneys (if severe)"],
        spread: "May spread upward to kidneys causing back pain and fever.",
        medications: ["Nitrofurantoin", "Ciprofloxacin", "Trimethoprim", "ORS solution"],
        recovery: ["Drink 3L water daily", "Complete antibiotic course", "Avoid holding urine", "Cranberry juice helps", "Urine culture test recommended"]
      },
      {
        cause: "Menstrual Cramps / Dysmenorrhea",
        confidence: 65,
        organs: ["Uterus", "Ovaries", "Pelvic floor muscles"],
        spread: "May radiate to lower back and inner thighs.",
        medications: ["Mefenamic acid 500mg", "Ibuprofen 400mg", "Heating pad"],
        recovery: ["Warm compress on abdomen", "Light exercise (yoga, walking)", "Avoid caffeine during period", "Track cycle with app"]
      },
      {
        cause: "Constipation / Bloating",
        confidence: 55,
        organs: ["Large intestine", "Sigmoid colon"],
        spread: "Diffuse abdominal discomfort with pressure.",
        medications: ["Lactulose syrup", "Isabgol husk", "Dulcolax (short-term)"],
        recovery: ["Increase fiber intake", "Drink warm water in mornings", "Exercise regularly", "Avoid processed foods"]
      }
    ]
  },
  "left-shoulder": {
    general: [
      {
        cause: "Rotator Cuff Injury",
        confidence: 71,
        organs: ["Supraspinatus tendon", "Shoulder joint", "Rotator cuff muscles"],
        spread: "Pain radiates down upper arm. Worse when lifting arm.",
        medications: ["Diclofenac 50mg", "Topical NSAID gel", "Local steroid injection (if severe)"],
        recovery: ["RICE method (Rest, Ice, Compression, Elevation)", "Physiotherapy", "Avoid overhead movements", "Rotator cuff exercises"]
      },
      {
        cause: "Frozen Shoulder (Adhesive Capsulitis)",
        confidence: 58,
        organs: ["Shoulder capsule", "Glenohumeral joint"],
        spread: "Stiffness compounds over weeks. Range of motion progressively limited.",
        medications: ["Ibuprofen 400mg", "Oral corticosteroids", "Physiotherapy"],
        recovery: ["Daily shoulder mobility exercises", "Heat therapy before exercise", "Patience — recovery takes months", "Consider cortisone injection"]
      },
      {
        cause: "Referred Pain from Heart (Angina)",
        confidence: 35,
        organs: ["Heart", "Left coronary artery", "Phrenic nerve"],
        spread: "May radiate to jaw, left arm. Associated with exertion.",
        medications: ["Seek medical evaluation urgently", "Nitroglycerin spray (if prescribed)"],
        recovery: ["ECG and cardiac evaluation required", "Reduce physical exertion", "Stress test may be needed"]
      }
    ]
  },
  "right-shoulder": {
    general: [
      {
        cause: "Rotator Cuff Strain",
        confidence: 73,
        organs: ["Supraspinatus muscle", "Shoulder joint", "Biceps tendon"],
        spread: "Pain when raising arm or sleeping on affected side.",
        medications: ["Ibuprofen 400mg", "Voltaren gel", "Glucosamine supplements"],
        recovery: ["Rest shoulder for 48-72 hrs", "Ice 20 min 3x daily", "Pendulum exercises", "Physiotherapy"]
      },
      {
        cause: "Shoulder Bursitis",
        confidence: 60,
        organs: ["Subacromial bursa", "Acromion", "Rotator cuff"],
        spread: "Point tenderness at shoulder top. Pain arc between 60-120 degrees.",
        medications: ["Naproxen 500mg", "Corticosteroid injection"],
        recovery: ["Avoid activities that worsen pain", "Ice therapy", "Physical therapy", "Ultrasound-guided injection if needed"]
      },
      {
        cause: "Referred Pain from Liver / Gallbladder",
        confidence: 30,
        organs: ["Liver", "Gallbladder", "Right phrenic nerve"],
        spread: "May be associated with right upper abdominal pain.",
        medications: ["Ultrasound of abdomen recommended", "Antispasmodics"],
        recovery: ["Low-fat diet", "Gallstone evaluation", "Hepatic function tests"]
      }
    ]
  },
  "left-arm": {
    general: [
      {
        cause: "Muscle Strain / Overuse",
        confidence: 75,
        organs: ["Biceps", "Triceps", "Forearm muscles"],
        spread: "Localized aching, may worsen with movement.",
        medications: ["Ibuprofen 400mg", "Topical pain relief gel", "Magnesium supplements"],
        recovery: ["Rest for 24-48 hours", "Ice therapy", "Gentle stretching after 48 hrs", "Gradually return to activity"]
      },
      {
        cause: "Nerve Compression (Cubital Tunnel Syndrome)",
        confidence: 55,
        organs: ["Ulnar nerve", "Elbow cubital tunnel", "Forearm"],
        spread: "Tingling/numbness to ring and little finger. Worse with elbow flexion.",
        medications: ["Anti-inflammatory medications", "Nerve supplements (B12)"],
        recovery: ["Avoid prolonged elbow bending", "Elbow padding", "Night splinting", "Neural mobilization exercises"]
      },
      {
        cause: "Cardiac Referred Pain",
        confidence: 40,
        organs: ["Heart", "Left ventricle", "Brachial plexus"],
        spread: "Classic left arm pain radiating from chest. Associated with sweating.",
        medications: ["Seek emergency evaluation immediately"],
        recovery: ["ECG required", "Cardiac enzymes test", "Emergency if accompanied by chest tightness"]
      }
    ]
  },
  "right-arm": {
    general: [
      {
        cause: "Tennis Elbow (Lateral Epicondylitis)",
        confidence: 68,
        organs: ["Extensor muscles of forearm", "Lateral epicondyle", "Elbow joint"],
        spread: "Pain from elbow radiating down forearm. Worse gripping objects.",
        medications: ["Ibuprofen 400mg", "Naproxen", "Topical NSAID", "Steroid injection"],
        recovery: ["Rest from repetitive movements", "Forearm strap/brace", "Eccentric exercises", "Ice therapy after activity"]
      },
      {
        cause: "Carpal Tunnel Syndrome",
        confidence: 50,
        organs: ["Median nerve", "Carpal tunnel", "Wrist"],
        spread: "Tingling into thumb, index, middle finger. Worse at night.",
        medications: ["Vitamin B6 supplementation", "Anti-inflammatories", "Wrist splint"],
        recovery: ["Night wrist splinting", "Reduce repetitive wrist use", "Nerve gliding exercises", "Ergonomic keyboard/mouse"]
      },
      {
        cause: "Muscle Strain",
        confidence: 60,
        organs: ["Biceps brachii", "Deltoid", "Forearm flexors"],
        spread: "Localized muscle soreness, no nerve involvement.",
        medications: ["Ibuprofen 400mg", "Topical diclofenac gel"],
        recovery: ["RICE protocol", "Gentle stretching", "Gradually increase activity"]
      }
    ]
  },
  back: {
    general: [
      {
        cause: "Upper Back Muscle Strain",
        confidence: 76,
        organs: ["Trapezius", "Rhomboids", "Erector spinae"],
        spread: "Pain between shoulder blades. Common with desk work.",
        medications: ["Ibuprofen 400mg", "Muscle relaxants (Methocarbamol)", "Topical gel"],
        recovery: ["Posture correction exercises", "Strengthen core muscles", "Regular breaks from desk", "Heat therapy", "Ergonomic assessment"]
      },
      {
        cause: "Thoracic Disc Herniation",
        confidence: 45,
        organs: ["Thoracic vertebrae T4-T8", "Spinal cord", "Nerve roots"],
        spread: "Can cause band-like chest tightness. Rare but serious.",
        medications: ["Anti-inflammatories", "Neuromodulators"],
        recovery: ["MRI of thoracic spine", "Physiotherapy", "Avoid heavy lifting", "Core strengthening"]
      },
      {
        cause: "Kidney Infection (Pyelonephritis)",
        confidence: 38,
        organs: ["Kidneys", "Ureters", "Renal pelvis"],
        spread: "Flank pain with fever, chills, and UTI symptoms.",
        medications: ["Ciprofloxacin 500mg", "Co-amoxiclav", "Pyridium"],
        recovery: ["Urine culture test", "Blood tests (CBC)", "Aggressive hydration", "Antibiotics for 10-14 days"]
      }
    ]
  },
  "lower-back": {
    general: [
      {
        cause: "Lumbar Disc Herniation (Sciatica)",
        confidence: 74,
        organs: ["L4-L5 disc", "Sciatic nerve", "Spine"],
        spread: "Pain shoots down buttock and leg (sciatica). May cause foot numbness.",
        medications: ["Pregabalin 75mg", "Diclofenac 50mg", "Muscle relaxants"],
        recovery: ["MRI of lumbar spine", "Physiotherapy (McKenzie method)", "Avoid bending/twisting", "Core strengthening", "Walking is beneficial"]
      },
      {
        cause: "Lumbar Muscle Strain",
        confidence: 69,
        organs: ["Lumbar erector spinae", "Multifidus muscle"],
        spread: "Localized lower back pain. Worse with movement, better with rest.",
        medications: ["Ibuprofen 400mg", "Diclofenac gel", "Cyclobenzaprine (short-term)"],
        recovery: ["Short bed rest then gradual movement", "Heat therapy", "Core exercises after acute phase", "Avoid heavy lifting"]
      },
      {
        cause: "Facet Joint Arthropathy",
        confidence: 50,
        organs: ["Lumbar facet joints", "Ligaments", "Spine"],
        spread: "Aching pain across lower back. Worse in morning and after sitting.",
        medications: ["NSAIDs", "Physiotherapy", "Facet injection (if severe)"],
        recovery: ["Extension-based exercises", "Swimming", "Weight management", "Anti-inflammatory diet"]
      }
    ]
  },
  "left-leg": {
    general: [
      {
        cause: "Varicose Veins / Venous Insufficiency",
        confidence: 63,
        organs: ["Deep veins", "Superficial veins", "Calf muscles"],
        spread: "Heaviness, aching, and swelling. Worse when standing.",
        medications: ["Compression stockings", "Diosmin + Hesperidin", "Topical heparin cream"],
        recovery: ["Elevate legs when resting", "Regular walking", "Avoid prolonged standing", "Compression therapy", "Vascular surgeon evaluation"]
      },
      {
        cause: "Sciatica (radiculopathy)",
        confidence: 67,
        organs: ["Sciatic nerve", "L4-S1 nerve roots", "Hamstrings"],
        spread: "Shooting pain from lower back to foot. May include tingling.",
        medications: ["Pregabalin 75mg", "Gabapentin 300mg", "NSAIDs"],
        recovery: ["Avoid bending forward", "Piriformis stretch", "Progressive walking", "Physiotherapy", "MRI if not improving"]
      },
      {
        cause: "Muscle Cramps / Electrolyte Imbalance",
        confidence: 55,
        organs: ["Calf muscles", "Quadriceps", "Electrolyte channels"],
        spread: "Sudden cramping, usually brief but painful.",
        medications: ["Magnesium glycinate", "Potassium supplementation", "Oral rehydration"],
        recovery: ["Stretch calf muscles daily", "Stay hydrated", "Increase electrolyte-rich foods", "Banana, nuts, and leafy greens"]
      }
    ]
  },
  "right-leg": {
    general: [
      {
        cause: "Deep Vein Thrombosis (DVT)",
        confidence: 45,
        organs: ["Deep femoral vein", "Popliteal vein", "Calf veins"],
        spread: "Unilateral calf swelling, warmth, redness. Risk with immobility.",
        medications: ["Seek immediate medical evaluation", "Anticoagulation therapy"],
        recovery: ["Doppler ultrasound required urgently", "Do not massage the leg", "Early mobilization", "Anticoagulants prescribed by doctor"]
      },
      {
        cause: "Runner's Knee (Patellofemoral Pain)",
        confidence: 65,
        organs: ["Patella", "Femoral cartilage", "Quadriceps tendon"],
        spread: "Pain around knee cap. Worse going downstairs or after sitting long.",
        medications: ["Ibuprofen 400mg", "Knee brace", "Glucosamine"],
        recovery: ["RICE method", "Quadriceps strengthening", "Foam rolling", "Reduce running mileage temporarily"]
      },
      {
        cause: "Shin Splints (Medial Tibial Stress Syndrome)",
        confidence: 58,
        organs: ["Tibialis anterior", "Tibia bone", "Periosteum"],
        spread: "Pain along inner shin. Common in runners and active people.",
        medications: ["Ibuprofen 400mg", "Calcium + Vitamin D"],
        recovery: ["Rest from impact activities", "Low-impact alternatives (swimming, cycling)", "Gradual return to running", "Proper footwear"]
      }
    ]
  }
};

// Get the best matching diagnosis for a body part
export const getAIDiagnosis = (bodyPart, painIntensity, duration, userProfile) => {
  const partData = diagnosisData[bodyPart] || diagnosisData.back;
  let causes = [...partData.general];

  // Adjust confidence based on pain intensity
  causes = causes.map(c => {
    let adjustedConf = c.confidence;
    if (painIntensity >= 8) adjustedConf = Math.min(95, adjustedConf + 10);
    if (painIntensity <= 3) adjustedConf = Math.max(20, adjustedConf - 15);
    if (duration === 'more-week') adjustedConf = Math.min(95, adjustedConf + 8);
    
    // Age-based adjustments
    if (userProfile?.age > 50) {
      if (c.cause.includes('Arthritis') || c.cause.includes('Spondylosis') || c.cause.includes('Disc')) {
        adjustedConf = Math.min(95, adjustedConf + 12);
      }
    }
    
    // Allergy / medication adjustments
    if (userProfile?.preExistingConditions?.toLowerCase().includes('diabetes')) {
      if (c.cause.includes('Nerve') || c.cause.includes('neuropathy')) {
        adjustedConf = Math.min(95, adjustedConf + 10);
      }
    }
    
    return { ...c, confidence: adjustedConf };
  });

  // Sort by confidence descending
  causes.sort((a, b) => b.confidence - a.confidence);
  return causes.slice(0, 3);
};

// Mental health analysis
export const getMentalHealthInsight = (moodScore, sleepScore, stressScore, concentrate, socialWithdrawal) => {
  const insights = [];
  let severity = 'low';

  if (moodScore < 4 && sleepScore < 4) {
    insights.push({
      title: "Burnout / Depression Pattern Detected",
      detail: "Low mood combined with poor sleep is a hallmark pattern of burnout or depression. This pattern, if persistent (2+ weeks), warrants professional evaluation.",
      flag: "warning",
      icon: "🔴"
    });
    severity = 'high';
  }

  if (stressScore >= 8 && moodScore < 3) {
    insights.push({
      title: "Crisis Alert — Immediate Support Recommended",
      detail: "Very high stress combined with very low mood is a serious mental health signal. Please reach out to a mental health professional or crisis helpline immediately.",
      flag: "crisis",
      icon: "🆘",
      helpline: {
        india: "iCall: 9152987821 | Vandrevala Foundation: 1860-2662-345",
        global: "Crisis Text Line: Text HOME to 741741 | International: befrienders.org"
      }
    });
    severity = 'crisis';
  }

  if (concentrate === 'poor' && moodScore < 5) {
    insights.push({
      title: "Cognitive Load & Mood",
      detail: "Poor concentration paired with low mood may indicate ADHD, anxiety, or early depression. Mindfulness and structured routines can help.",
      flag: "info",
      icon: "🧠"
    });
  }

  if (socialWithdrawal && moodScore < 6) {
    insights.push({
      title: "Social Withdrawal Pattern",
      detail: "Pulling away from social contact while feeling low is associated with depression. Try small, low-pressure social interactions daily.",
      flag: "info",
      icon: "👥"
    });
  }

  if (sleepScore < 4) {
    insights.push({
      title: "Sleep Quality is Critical",
      detail: "Poor sleep affects every aspect of mental health. Consider sleep hygiene practices: fixed sleep schedule, no screens 1hr before bed, dark and cool room.",
      flag: "info",
      icon: "😴"
    });
  }

  if (insights.length === 0) {
    const avg = (moodScore + sleepScore + (10 - stressScore)) / 3;
    if (avg >= 7) {
      insights.push({
        title: "Good Mental Wellness",
        detail: "Your mental health indicators look positive today. Keep maintaining your current habits.",
        flag: "good",
        icon: "✅"
      });
    } else {
      insights.push({
        title: "Moderate Wellness — Room for Improvement",
        detail: "Your scores are average. Try adding 20 mins of exercise, journaling, or a short meditation today.",
        flag: "info",
        icon: "💡"
      });
    }
  }

  return { insights, severity };
};

// Brain region highlights based on mental state
export const getBrainHighlights = (moodScore, sleepScore, stressScore, concentrate) => {
  return {
    amygdala: stressScore >= 7 || moodScore < 4, // Danger/anxiety response
    prefrontalCortex: concentrate === 'poor' || moodScore < 5, // Dimmed rational thinking
    hippocampus: sleepScore < 5, // Memory consolidation affected
    hypothalamus: sleepScore < 4 || stressScore >= 8 // Stress hormone center
  };
};

// Emergency brief generation for Witness Mode
export const generateEmergencyBrief = (answers, gpsLocation) => {
  const { conscious, breathing, seizure, chestPain, bleeding } = answers;
  let situation = [];
  let urgency = "moderate";

  if (!conscious) { situation.push("patient is UNCONSCIOUS"); urgency = "critical"; }
  if (!breathing) { situation.push("patient is NOT BREATHING — CPR may be needed"); urgency = "critical"; }
  if (seizure) { situation.push("patient is having SEIZURES or convulsions"); urgency = "critical"; }
  if (chestPain) { situation.push("patient is CLUTCHING CHEST suggesting possible cardiac event"); urgency = "critical"; }
  if (bleeding) { situation.push("patient has ACTIVE BLEEDING"); urgency = "high"; }

  const time = new Date().toLocaleTimeString();
  const briefText = `EMERGENCY SITUATION REPORT — ${time}
  
Patient Status: ${situation.length > 0 ? situation.join("; ") : "Conscious and breathing"}
Location: ${gpsLocation || "Location unavailable — please check device GPS"}
Urgency Level: ${urgency.toUpperCase()}

${!conscious ? "ACTION: Begin CPR if patient is not breathing. Place patient in recovery position if breathing." : ""}
${!breathing ? "ACTION: Begin rescue breathing immediately. Call ambulance NOW." : ""}
${seizure ? "ACTION: Clear area around patient. Do NOT restrain. Time the seizure. Do NOT put anything in mouth." : ""}
${chestPain ? "ACTION: Keep patient still and calm. Give aspirin 325mg if available and not allergic. DO NOT let patient exert themselves." : ""}
${bleeding ? "ACTION: Apply firm direct pressure to wound. Use clean cloth. Keep elevated if possible." : ""}

Please dispatch emergency services to the above location immediately.`;

  return { briefText, urgency };
};

// First aid instructions based on witness mode answers
export const getFirstAidInstructions = (answers) => {
  const instructions = [];

  if (!answers.conscious) {
    instructions.push({
      title: "Unconscious Patient",
      steps: [
        "Check for responsiveness — tap shoulders and shout",
        "Call emergency services immediately (911/ambulance)",
        "If not breathing, begin CPR: 30 chest compressions, 2 breaths",
        "If breathing, place in recovery position (on side)",
        "Loosen tight clothing around neck and chest",
        "Stay with patient until help arrives"
      ],
      severity: "critical"
    });
  }

  if (!answers.breathing) {
    instructions.push({
      title: "Not Breathing — Start CPR",
      steps: [
        "1. Call 911 immediately or ask someone to call",
        "2. Tilt head back, lift chin to open airway",
        "3. Give 2 rescue breaths (1 second each)",
        "4. Begin 30 chest compressions (hard and fast, center of chest)",
        "5. Repeat 30:2 ratio until help arrives or AED is available",
        "6. If AED available, use it as soon as possible"
      ],
      severity: "critical"
    });
  }

  if (answers.seizure) {
    instructions.push({
      title: "Seizure Protocol",
      steps: [
        "Clear the area of hard/sharp objects",
        "Do NOT restrain the person — let seizure run its course",
        "Cushion the head with something soft",
        "Time the seizure — if over 5 minutes, call 911",
        "Do NOT put anything in the person's mouth",
        "After seizure: place in recovery position, speak calmly",
        "Stay until fully conscious and oriented"
      ],
      severity: "high"
    });
  }

  if (answers.chestPain) {
    instructions.push({
      title: "Suspected Heart Attack",
      steps: [
        "Call emergency services (911) immediately",
        "Have patient sit or lie in comfortable position",
        "Loosen tight clothing",
        "Give aspirin 325mg to chew (if available and not allergic)",
        "Keep patient calm and still — no physical exertion",
        "Monitor breathing and consciousness",
        "Be ready to begin CPR if patient loses consciousness"
      ],
      severity: "critical"
    });
  }

  if (answers.bleeding) {
    instructions.push({
      title: "Controlling Bleeding",
      steps: [
        "Put on gloves if available (universal precautions)",
        "Apply firm direct pressure to wound with clean cloth",
        "Do NOT remove the cloth — add more on top if blood soaks through",
        "Elevate the injured body part above heart level if possible",
        "Apply pressure bandage to maintain compression",
        "For major bleeding: tourniquets 2-3 inches above wound",
        "Monitor for shock: pale skin, rapid breathing, confusion"
      ],
      severity: "high"
    });
  }

  if (instructions.length === 0) {
    instructions.push({
      title: "Monitor Patient",
      steps: [
        "Keep patient comfortable and calm",
        "Do not leave them alone",
        "Monitor for changes in consciousness",
        "Ask about pain location and severity",
        "Prevent patient from moving unnecessarily",
        "Help find their medical ID or medications"
      ],
      severity: "low"
    });
  }

  return instructions;
};
