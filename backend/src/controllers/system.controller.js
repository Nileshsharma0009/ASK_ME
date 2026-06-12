// backend/src/controllers/system.controller.js

export const getComplianceConfig = (req, res) => {
  const contentLedger = {
    en: {
      title: "Maritime Workspace Guidelines",
      subtitle: "Terms, Capabilities, & Safety Boundaries",
      purposeTitle: "Purpose & System Architecture",
      purposeDesc: "This system is configured as an advanced Maritime Retrieval-Augmented Generation (RAG) engine. It parses institutional shipping manuals, safety logs, and maritime regulations rapidly for operational convenience.",
      powersTitle: "Core Capabilities & Powers",
      power1: "Synthesizes long-form multi-document shipping and deck references into summary points instantly.",
      power2: "Cross-references query parameters against uploaded shipping log frameworks.",
      power3: "Maintains state parameters across full-page extended conversational threads.",
      limitTitle: "System Limitations & Risk Matrix",
      limitDesc: "Large Language Models can occasionally hallucinate, introduce formatting anomalies, or process outdated variables. This engine works entirely on semantic probability arrays and does not possess autonomous navigation or real-time decision-making layers.",
      restrictTitle: "When NOT to use",
      restrictDesc: "Do NOT use this assistant as an autonomous navigation terminal. It must never bypass real-time bridge protocols, override official logbooks, or replace certified maritime crew commands.",
      optNever: "Don't show again (Mute permanently)",
      optSession: "Keep reminding me on each new chat session",
      btnText: "I Understand & Consent"
    },
    hi: {
      title: "समुद्री कार्यक्षेत्र दिशानिर्देश",
      subtitle: "नियम, क्षमताएं और सुरक्षा सीमाएं",
      purposeTitle: "उद्देश्य और सिस्टम आर्किटेक्चर",
      purposeDesc: "यह सिस्टम एक उन्नत समुद्री रिट्रीवल-ऑगमेंटेड जनरेशन (RAG) इंजन के रूप में कॉन्फ़िगर किया गया है। यह परिचालन सुविधा के लिए संस्थागत शिपिंग नियमावली और समुद्री नियमों को तेज़ी से पार्स करता है।",
      powersTitle: "मुख्य क्षमताएं और शक्तियां",
      power1: "लंबी बहु-दस्तावेज़ शिपिंग संदर्भों को तुरंत सारांश बिंदुओं में संश्लेषित करता है।",
      power2: "अपलोड किए गए शिपिंग लॉग फ्रेमवर्क के खिलाफ क्वेरी मापदंडों को क्रॉस-रेफरेंस करता है।",
      power3: "पूर्ण-पृष्ठ विस्तारित वार्तालाप थ्रेड्स में स्थिति मापदंडों को बनाए रखता है।",
      limitTitle: "सिस्टम की सीमाएं और जोखिम मैट्रिक्स",
      limitDesc: "लार्ज लैंग्वेज मॉडल कभी-कभी गलत या पुरानी जानकारी (hallucinate) उत्पन्न कर सकते हैं। यह इंजन पूरी तरह से सिमेंटिक प्रोबेबिलिटी पर काम करता है और इसमें स्वायत्त नेविगेशन क्षमता नहीं है।",
      restrictTitle: "कब उपयोग न करें",
      restrictDesc: "इस सहायक का उपयोग स्वायत्त नेविगेशन टर्मिनल के रूप में न करें। इसे कभी भी वास्तविक समय के ब्रिज प्रोटोकॉल या प्रमाणित समुद्री चालक दल के निर्देशों को ओवरराइड नहीं करना चाहिए।",
      optNever: "दोबारा न दिखाएं (स्थायी रूप से म्यूट करें)",
      optSession: "प्रत्येक नए चैट सत्र पर मुझे याद दिलाते रहें",
      btnText: "मैं समझता हूं और सहमत हूं"
    },
    te: {
      title: "మెరైన్ వర్క్‌స్పేస్ మార్గదర్శకాలు",
      subtitle: "నిబంధనలు, సామర్థ్యాలు & భద్రతా పరిమితులు",
      purposeTitle: "లక్ష్యం & సిస్టమ్ ఆర్కిటెక్చర్",
      purposeDesc: "ఈ సిస్టమ్ అధునాతన మెరైన్ రీట్రీవల్-అగ్మెంటెడ్ జనరేషన్ (RAG) ఇంజిన్‌గా కాన్ఫిగర్ చేయబడింది. ఇది సంస్థాగత షిప్పింగ్ పత్రాలను విశ్లేషిస్తుంది మరియు కార్యాచరణ సౌలభ్యం కోసం అంతర్గత షిప్పింగ్ పరిజ్ఞానాన్ని వేగంగా ప్రదర్శిస్తుంది.",
      powersTitle: "కోర్ సామర్థ్యాలు & అధికారాలు",
      power1: "సుదీర్ఘమైన బహుళ-పత్రాల షిప్పింగ్ డేటా మూలాలను తక్షణమే సారాంశ పాయింట్‌లుగా మారుస్తుంది.",
      power2: "అప్లోడ్ చేసిన షిప్పింగ్ లాగ్ ఫ్రేమ్‌వర్క్‌లకు వ్యతిరేకంగా క్వెరీ పారామితులను క్రాస్-రెఫరెన్స్ చేస్తుంది.",
      power3: "పూర్తి పేజీ పొడిగించిన సంభాషణ థ్రెడ్‌లలో స్టేట్ పారామితులను నిర్వహిస్తుంది.",
      limitTitle: "సిస్టమ్ పరిమితులు & రిస్క్ మ్యాట్రిక్స్",
      limitDesc: "లార్జ్ లాంగ్వేజ్ మోడల్స్ అప్పుడప్పుడు తప్పుడు సమాచారాన్ని ఇవ్వవచ్చు. ఈ ఇంజన్ పూర్తిగా సెమాంటిక్ సంభావ్యతపై పనిచేస్తుంది మరియు స్వయంప్రతిపత్త నావిగేషన్ సామర్థ్యాన్ని కలిగి ఉండదు.",
      restrictTitle: "ఎప్పుడు ఉపయోగించకూడదు",
      restrictDesc: "ఈ అసిస్టెంట్‌ను స్వయంప్రతిపత్త నావిగేషన్ టెర్మినల్‌గా ఉపయోగించవద్దు. ఇది నిజ-సమయ బ్రిడ్జ్ ప్రోటోకాల్స్ లేదా ధృవీకరించబడిన నావిగేషన్ ఆదేశాలను దాటవేయకూడదు.",
      optNever: "మళ్లీ చూపవద్దు (శాశ్వతంగా మ్యూట్ చేయండి)",
      optSession: "ప్రతి కొత్త చాట్ సెషన్‌లో నాకు గుర్తు చేస్తూ ఉండండి",
      btnText: "నేను అర్థం చేసుకున్నాను & అంగీకరిస్తున్నాను"
    },
    ta: {
      title: "கடல்சார் பணிமனை வழிகாட்டுதல்கள்",
      subtitle: "விதிமுறைகள், திறன்கள் மற்றும் பாதுகாப்பு வரம்புகள்",
      purposeTitle: "நோக்கம் மற்றும் கணினி கட்டமைப்பு",
      purposeDesc: "இந்த அமைப்பு மேம்பட்ட கடல்சார் மீட்டெடுப்பு-பெருகிய தலைமுறை (RAG) இயந்திரமாக கட்டமைக்கப்பட்டுள்ளது. இது நிறுவன கப்பல் ஆவணங்களை பாகுபடுத்தி, செயல்பாட்டு வசதிக்காக உள் கடல்சார் அறிவு வரைபடங்களை விரைவாக வெளிပါတယ်။",
      powersTitle: "முக்கிய திறன்கள் மற்றும் ஆற்றல்கள்",
      power1: "நீண்ட பல ஆவண கப்பல் தரவு ஆதாரங்களை உடனடியாக சுருக்க புள்ளிகளாக ஒருங்கிணைக்கிறது.",
      power2: "பதிவேற்றப்பட்ட கப்பல் பதிவு கட்டமைப்புகளுக்கு எதிராக வினவல் அளவுருக்களை குறுக்குக் குறிப்பு செய்கிறது.",
      power3: "முழு பக்க நீட்டிக்கப்பட்ட உரையாடல் இழைகள் முழுவதும் மாநில அளவுருக்களை பராமரிக்கிறது.",
      limitTitle: "கணினி வரம்புகள் மற்றும் இடர் மேலாண்மை",
      limitDesc: "பெரிய மொழி மாதிரிகள் எப்போதாவது தவறான அல்லது காலாவதியான மாறிகளை செயலாக்கலாம். இந்த இயந்திரம் முற்றிலும் சொற்பொருள் நிகழ்தகவு வரிசைகளில் இயங்குகிறது மற்றும் தன்னாட்சி வழிசெலுத்தல் திறனைக் கொண்டிருக்கவில்லை.",
      restrictTitle: "எப்போது பயன்படுத்தக்கூடாது",
      restrictDesc: "இந்த உதவியாளரை ஒரு தன்னாட்சி வழிசெலுத்தல் முனையமாக பயன்படுத்த வேண்டாம். இது ஒருபோதும் நிகழ்நேர பிரிட்ஜ் நெறிமுறைகளைத் தவிர்க்கவோ அல்லது அதிகாரப்பூர்வ கடல்சார் குழு கட்டளைகளை மீறவோ கூடாது.",
      optNever: "மீண்டும் காட்டாதே (நிரந்தரமாக முடக்கு)",
      optSession: "ஒவ்வொரு புதிய அரட்டை அமர்விலும் எனக்கு நினைவூட்டுக",
      btnText: "நான் புரிந்துகொண்டு ஒப்புக்கொள்கிறேன்"
    }
  };

  const languagesList = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' }
  ];

  return res.status(200).json({ contentLedger, languagesList });
};