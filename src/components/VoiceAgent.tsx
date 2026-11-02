import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  ShoppingBag, 
  Radio, 
  ShieldCheck,
  Globe,
  Check,
  Copy,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Jersey, Order } from '../types';

interface VoiceAgentProps {
  jerseysList: Jersey[];
  bKashNumber: string;
  nagadNumber: string;
  directCallNumber?: string;
  facebookLink?: string;
  onOrderConfirmed?: (order: Order) => void;
  selectedJersey?: Jersey | null;
  isOpenControlled?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  speechText?: string;
  speechTextBanglish?: string;
  language?: string;
  timestamp: string;
  action?: string;
  orderDetails?: any;
  trackResult?: any;
}

export default function VoiceAgent({ 
  jerseysList, 
  bKashNumber, 
  nagadNumber, 
  directCallNumber = '01402580064',
  facebookLink = 'https://www.facebook.com/share/1Bh4gYajWE/',
  onOrderConfirmed,
  selectedJersey,
  isOpenControlled,
  onOpenChange
}: VoiceAgentProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const isOpen = isOpenControlled !== undefined ? isOpenControlled : internalIsOpen;
  const setIsOpen = (val: boolean) => {
    if (onOpenChange) onOpenChange(val);
    setInternalIsOpen(val);
  };
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');
  
  // Selected Speech Language: 'bn-BD' (Bangla) or 'en-US' (English)
  const [voiceLang, setVoiceLang] = useState<'bn-BD' | 'en-US'>('bn-BD');

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'আসসালামু আলাইকুম! নাফী জার্সি হাউজের AI ভয়েস সেলস এসিস্ট্যান্টে স্বাগতম। আপনি কোন দেশের জার্সিটি দেখতে চান বা অর্ডার করতে চান বলুন, আমি সাহায্য করছি!',
      speechText: 'আসসালামু আলাইকুম! নাফী জার্সি হাউজের এআই ভয়েস এসিস্ট্যান্টে স্বাগতম। আপনি কোন দেশের জার্সিটি অর্ডার করতে চান বলুন, আমি সাহায্য করছি।',
      speechTextBanglish: 'Assalamu Alaikum! Nafi Jersey House e apnake shagotom. Apni kon desher jersey order korte chan bolun, ami shahajjo korchi.',
      language: 'bn',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [activeVoiceOrder, setActiveVoiceOrder] = useState<any>(null);
  const [voiceOrderPlaced, setVoiceOrderPlaced] = useState<Order | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Form override fields for active voice order
  const [formName, setFormName] = useState('Voice Customer');
  const [formPhone, setFormPhone] = useState('');
  const [formSize, setFormSize] = useState('L');
  const [formPayMethod, setFormPayMethod] = useState('bKash');
  const [formTrxId, setFormTrxId] = useState('');
  const [formCustomName, setFormCustomName] = useState('');
  const [formCustomNumber, setFormCustomNumber] = useState('');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const copyOrderToClipboard = (order: any) => {
    const orderId = order?.id || order?.orderDetails?.id || 'Pending';
    const jersey = order?.jerseyName || order?.jersey?.name || 'Player Edition Jersey';
    const size = order?.size || formSize || 'L';
    const amount = order?.amount || order?.totalAmount || 1350;
    const pay = order?.paymentMethod || formPayMethod || 'bKash';
    const trx = order?.transactionId || formTrxId || 'N/A';
    const phone = order?.customerPhone || formPhone || 'N/A';
    const cName = order?.customName || formCustomName;
    const cNum = order?.customNumber || formCustomNumber;

    const summaryText = `🛒 NAFI JERSEY HOUSE - ORDER DETAILS\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 Order ID: ${orderId}\n` +
      `👕 Jersey: ${jersey}\n` +
      `📏 Size: ${size}\n` +
      `💰 Total Price: BDT ${amount}\n` +
      `💳 Payment Method: ${pay}\n` +
      `🔑 TrxID: ${trx}\n` +
      `📱 Phone: ${phone}\n` +
      (cName ? `✨ Custom Name & No: ${cName} #${cNum}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Official Facebook Page: ${facebookLink}`;

    navigator.clipboard.writeText(summaryText);
    setCopiedOrderId(orderId);
    setTimeout(() => {
      setCopiedOrderId(null);
    }, 3000);
  };

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Play audio stream directly via HTML5 Audio element (/api/tts) - Guaranteed high-clarity Bengali & English voice
  const playAudioStream = (text: string, langCode: string = 'bn') => {
    if (isMuted || typeof window === 'undefined') return;
    
    try {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }

      const cleanText = cleanTTSString(text);
      if (!cleanText) return;

      const isEnglish = (langCode === 'en' || voiceLang === 'en-US');
      const langParam = isEnglish ? 'en' : 'bn';
      const audioUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&lang=${langParam}`;
      
      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;

      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => {
        setIsSpeaking(false);
      };

      audio.play().catch(err => {
        console.warn('Autoplay blocked or audio stream fallback:', err);
        setIsSpeaking(false);
      });
    } catch (e) {
      console.error('Audio stream play error:', e);
      setIsSpeaking(false);
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isProcessing, activeVoiceOrder]);

  // Load Speech Synthesis Voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Initialize Speech Recognition when voiceLang changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        if (recognitionRef.current) {
          try { recognitionRef.current.abort(); } catch (e) {}
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = voiceLang;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');
          setInputText(transcript);
        };

        recognition.onerror = (event: any) => {
          console.log('Speech recognition event:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [voiceLang]);

  // Helper to sanitize text for speech synthesis (strips markdown, symbols, emojis, parenthetical notes, stars)
  const cleanTTSString = (str: string) => {
    if (!str) return '';
    return str
      .replace(/[\*\#\_`~]/g, '') // Strip markdown formatting
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}]/gu, '') // Strip all emojis & flags
      .replace(/[\★\☆\•\▸\■\●\✓\✔]/g, '') // Strip stars & bullet glyphs
      .replace(/\([^)]*\)/g, '') // Strip parenthetical notes
      .replace(/\bC\s*O\s*D\b/gi, 'Cash') // Replace any 'C O D' or 'COD' with 'Cash'
      .replace(/BDT/gi, 'Taka') // Speak BDT clearly as Taka
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Ultra-Clear High Quality Bilingual (Bengali & English) Text-To-Speech
  const speakText = (text: string, langCode: string = 'bn', banglishText?: string) => {
    if (isMuted || typeof window === 'undefined') return;
    
    try {
      // Stop any existing audio stream or synthesis
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      
      const sanitizedText = cleanTTSString(text);
      const sanitizedBanglish = cleanTTSString(banglishText || text);

      if (!sanitizedText && !sanitizedBanglish) return;

      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const isInAppBrowser = /FBAN|FBAV|Instagram|Messenger|Line|Twitter|Snapchat/i.test(ua);
      const isEnglishMode = langCode === 'en' || (langCode !== 'bn' && voiceLang === 'en-US');

      const voices = availableVoices.length > 0 ? availableVoices : (typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : []);
      
      // Filter out deep male voices to maintain warm, professional female assistant persona
      const femaleFilter = (v: SpeechSynthesisVoice) => {
        const n = v.name.toLowerCase();
        const maleKeywords = ['david', 'mark', 'george', 'ravi', 'guy', 'male', 'stefan', 'daniel', 'alex', 'fred', 'thomas', 'james', 'paul', 'brian', 'richard'];
        return !maleKeywords.some(kw => n.includes(kw));
      };

      // 1. IN-APP BROWSERS (Facebook / Messenger / Instagram) -> ALWAYS use direct stream for high fidelity
      if (isInAppBrowser || !('speechSynthesis' in window)) {
        playAudioStream(sanitizedText, isEnglishMode ? 'en' : 'bn');
        return;
      }

      window.speechSynthesis.cancel();

      // 2. ENGLISH MODE SPEECH SYNTHESIS
      if (isEnglishMode) {
        const enVoices = voices.filter(v => 
          (v.lang.includes('en-US') || v.lang.includes('en-GB') || v.lang.includes('en-AU') || v.lang.includes('en')) && femaleFilter(v)
        );

        const preferredEnVoice = enVoices.find(v => 
          v.name.toLowerCase().includes('natural') ||
          v.name.toLowerCase().includes('google us english') ||
          v.name.toLowerCase().includes('google uk english') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('aria') ||
          v.name.toLowerCase().includes('jenny') ||
          v.name.toLowerCase().includes('victoria') ||
          v.name.toLowerCase().includes('zira') ||
          v.name.toLowerCase().includes('karen')
        ) || enVoices[0] || voices.find(v => v.lang.startsWith('en'));

        const utterance = new SpeechSynthesisUtterance(sanitizedText);
        utterance.rate = 0.95; // Natural, articulate conversational English rate
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.lang = 'en-US';

        if (preferredEnVoice) {
          utterance.voice = preferredEnVoice;
          utterance.lang = preferredEnVoice.lang;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => {
          setIsSpeaking(false);
          playAudioStream(sanitizedText, 'en');
        };

        window.speechSynthesis.speak(utterance);
        return;
      }

      // 3. BENGALI MODE SPEECH SYNTHESIS
      const bnVoices = voices.filter(v => 
        (v.lang.toLowerCase().includes('bn') || 
         v.lang.toLowerCase().includes('bangla') || 
         v.lang.toLowerCase().includes('bengali'))
      );

      // If device has a native Bengali voice (Chrome/Android/Windows Bangla Pack):
      if (bnVoices.length > 0) {
        const preferredBnVoice = bnVoices.find(v => 
          v.name.toLowerCase().includes('natural') ||
          v.name.toLowerCase().includes('google') ||
          v.name.toLowerCase().includes('bangla') ||
          v.name.toLowerCase().includes('tanishaa') ||
          v.name.toLowerCase().includes('swara') ||
          v.name.toLowerCase().includes('female')
        ) || bnVoices[0];

        const utterance = new SpeechSynthesisUtterance(sanitizedText);
        utterance.voice = preferredBnVoice;
        utterance.lang = preferredBnVoice.lang || 'bn-BD';
        utterance.rate = 0.90; // Clear, well-paced Bengali articulation
        utterance.pitch = 1.02;
        utterance.volume = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => {
          setIsSpeaking(false);
          playAudioStream(sanitizedText, 'bn');
        };

        window.speechSynthesis.speak(utterance);
      } else {
        // If device does NOT have native Bengali TTS installed, stream studio-quality audio directly!
        playAudioStream(sanitizedText, 'bn');
      }
    } catch (err) {
      console.error('Speech synthesis error, executing audio fallback:', err);
      playAudioStream(cleanTTSString(text), langCode);
    }
  };

  // Language Mode Switcher with audio announcement
  const handleLanguageSwitch = (targetLang: 'bn-BD' | 'en-US') => {
    if (voiceLang === targetLang) return;
    
    setVoiceLang(targetLang);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }

    if (targetLang === 'en-US') {
      const enMsg: ChatMessage = {
        id: `lang-en-${Date.now()}`,
        sender: 'ai',
        text: 'English mode is now activated! How may I assist you with your jersey inquiry or order today?',
        speechText: 'English mode is now activated. How may I assist you with your jersey inquiry or order today?',
        language: 'en',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, enMsg]);
      speakText('English mode is now activated. How may I assist you today?', 'en');
    } else {
      const bnMsg: ChatMessage = {
        id: `lang-bn-${Date.now()}`,
        sender: 'ai',
        text: 'বাংলা মোড সক্রিয় করা হয়েছে! নাফী জার্সি হাউজে আপনাকে স্বাগতম। আপনি কোন জার্সিটি দেখতে বা অর্ডার করতে চান বলুন।',
        speechText: 'বাংলা মোড সক্রিয় করা হয়েছে। নাফী জার্সি হাউজে আপনাকে স্বাগতম। আপনি কোন জার্সিটি অর্ডার করতে চান বলুন।',
        speechTextBanglish: 'Bangla mode shokriyo kora hoyeche. Nafi Jersey House e apnake shagotom. Apni kon jersey order korte chan bolun.',
        language: 'bn',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, bnMsg]);
      speakText('বাংলা মোড সক্রিয় করা হয়েছে। নাফী জার্সি হাউজে আপনাকে স্বাগতম।', 'bn', 'Bangla mode shokriyo kora hoyeche.');
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Your browser does not support Web Speech API. You can type or use fallback quick prompts.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        recognitionRef.current.start();
      } catch (err) {
        console.error('Could not start recognition:', err);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isProcessing) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/ai-voice/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: query,
          activeJerseyId: selectedJersey?.id,
          userLang: voiceLang
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.replyText || 'আমি শুনতে পাচ্ছি। আপনি কোন জার্সিটি চান বলুন!',
          speechText: data.speechText || data.replyText,
          speechTextBanglish: data.speechTextBanglish,
          language: data.language || 'bn',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: data.action,
          orderDetails: data.orderDetails,
          trackResult: data.trackResult
        };

        setMessages(prev => [...prev, aiMsg]);

        // Speak back via female/male speech synthesizer
        speakText(data.speechText || data.replyText, data.language || 'bn', data.speechTextBanglish);

        // Handle Order Confirmation payload from AI
        if (data.action === 'CONFIRM_ORDER') {
          if (data.order) {
            setVoiceOrderPlaced(data.order);
            if (onOrderConfirmed) {
              onOrderConfirmed(data.order);
            }
          }

          if (data.orderDetails) {
            const details = data.orderDetails;
            const targetJersey = jerseysList.find(j => j.id === details.jerseyId) || selectedJersey || jerseysList[0];
            const isCashOrder = (details.paymentMethod || '').toLowerCase().includes('cash') || (details.paymentMethod || '').toLowerCase().includes('ক্যাশ');
            const isNagadOrder = (details.paymentMethod || '').toLowerCase().includes('nagad') || (details.paymentMethod || '').toLowerCase().includes('নগদ');
            
            // Clean & extract ONLY pure alphanumeric transaction IDs (never allow sentences or conversational text)
            const rawUserTrx = (details.transactionId || '').trim();
            const tokenMatch = rawUserTrx.match(/[A-Za-z0-9]{6,20}/);
            const candidateTrx = tokenMatch ? tokenMatch[0].toUpperCase() : '';
            const isForbidden = /^(COD|CASH|PENDING|NONE|VOICE|NULL|UNDEFINED|TRX|NA|UNKNOWN)/i.test(candidateTrx);
            const cleanTrx = (!isForbidden && candidateTrx.length >= 6) ? candidateTrx : '';
            
            const payMethodFinal = isCashOrder ? 'Cash on Delivery' : (isNagadOrder ? 'Nagad' : (details.paymentMethod || 'bKash'));

            setActiveVoiceOrder({
              jersey: targetJersey,
              size: details.size || 'L',
              quantity: details.quantity || 1,
              customerName: details.customerName || 'Voice Customer',
              customerPhone: details.customerPhone || '',
              paymentMethod: payMethodFinal,
              transactionId: cleanTrx,
              totalAmount: targetJersey ? targetJersey.priceBDT * (details.quantity || 1) : 1350
            });

            setFormSize(details.size || 'L');
            setFormPayMethod(payMethodFinal);
            if (details.customerName) setFormName(details.customerName);
            if (details.customerPhone) setFormPhone(details.customerPhone);
            setFormTrxId(cleanTrx);
            if (details.customName) setFormCustomName(details.customName);
            if (details.customNumber) setFormCustomNumber(details.customNumber);
          }
        }
      } else {
        throw new Error('Server returned error response');
      }
    } catch (err) {
      console.error('Error contacting AI Voice Agent server endpoint:', err);
      const isEn = voiceLang === 'en-US';
      const qLower = query.toLowerCase();
      
      let fallbackReply = "";
      let fallbackBanglish = "";

      // Smart client fallback
      if (qLower.includes("track") || qLower.includes("ট্র্যাক") || qLower.includes("status") || qLower.includes("স্ট্যাটাস")) {
        fallbackReply = isEn 
          ? "Please provide your 11-digit phone number or Order ID (e.g. NJH-123456) to retrieve your order status."
          : "আপনার অর্ডার ট্র্যাক করতে অনুগ্রহ করে ১১ ডিজিটের ফোন নম্বর বা অর্ডার আইডিটি (যেমন: NJH-123456) প্রদান করুন।";
        fallbackBanglish = "Apnar order track korte phone number ba Order ID bolun.";
      } else if (qLower.includes("delivery") || qLower.includes("ডেলিভারি") || qLower.includes("চার্জ")) {
        fallbackReply = isEn 
          ? "For delivery charge details, please message our Facebook page directly or talk with our admin team. Our admin will inform you about the exact delivery charge for your area."
          : "ডেলিভারি চার্জের বিষয়ে জানতে দয়া করে আমাদের ফেসবুক পেজে মেসেজ দিন অথবা পেজের এডমিনের সাথে কথা বলুন। আপনার এলাকা অনুযায়ী ডেলিভারি চার্জ কত হবে তা আমাদের এডমিন আপনাকে জানিয়ে দিবেন।";
        fallbackBanglish = "Delivery charge er jonne amader Facebook page e message din. Admin apnake delivery charge janaye diben.";
      } else if (qLower.includes("price") || qLower.includes("দাম") || qLower.includes("কত")) {
        const curPrice = selectedJersey ? selectedJersey.priceBDT : 1350;
        fallbackReply = isEn 
          ? `Our official player version national team jerseys are BDT ${curPrice}. Custom name and number printing is available for an additional +300 BDT charge.`
          : `আমাদের অফিশিয়াল প্লেয়ার ভার্সন জার্সির দাম ${curPrice} টাকা। কাস্টম নাম ও নম্বর প্রিন্ট করতে চাইলে অতিরিক্ত ৩০০ টাকা চার্জ যুক্ত হবে।`;
        fallbackBanglish = `Amader jersey er dam ${curPrice} taka. Custom print 300 taka.`;
      } else if (qLower.includes("popular") || qLower.includes("পপুলার") || qLower.includes("জনপ্রিয়") || qLower.includes("সেরা") || qLower.includes("best") || qLower.includes("rating") || qLower.includes("রেটিং") || qLower.includes("star") || qLower.includes("স্টার")) {
        const sorted = [...jerseysList].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        const topJersey = sorted[0];
        fallbackReply = isEn 
          ? `Our top-rated and most popular jersey right now is ${topJersey ? topJersey.name : 'our player edition kit'} with a ${topJersey ? topJersey.rating || 5.0 : 5.0}★ star rating! (Price: BDT ${topJersey ? topJersey.priceBDT : 1350})`
          : `আমাদের ক্যাটালগের সবচেয়ে জনপ্রিয় ও সেরা রেটিং প্রাপ্ত জার্সি হলো ${topJersey ? topJersey.name : 'প্লেয়ার এডিশন জার্সি'} (রেটিং: ${topJersey ? topJersey.rating || 5.0 : 5.0}★)। দাম মাত্র ${topJersey ? topJersey.priceBDT : 1350} টাকা!`;
        fallbackBanglish = `Amader sobcheye popular top rated jersey holo ${topJersey ? topJersey.country : 'player edition'} (${topJersey ? topJersey.rating || 5.0 : 5.0} star).`;
      } else if (qLower.includes("brazil") || qLower.includes("ব্রাজিল") || qLower.includes("argentina") || qLower.includes("আর্জেন্টিনা") || qLower.includes("portugal") || qLower.includes("পর্তুগাল") || qLower.includes("france") || qLower.includes("ফ্রান্স")) {
        fallbackReply = isEn 
          ? "Got it! Preparing your requested jersey order. Please click Confirm Order below to finalize!"
          : "ধন্যবাদ! আপনার জার্সি ও সাইজ অনুযায়ী অর্ডার প্রস্তুত করা হয়েছে। অর্ডার ফাইনাল করতে নিচে কনফার্ম করুন!";
        fallbackBanglish = "Dhonnobad! Apnar order toiri hoyeche. Niche confirm korin.";
      } else {
        fallbackReply = isEn 
          ? "Thank you for contacting Nafi Jersey House! How can I assist you with your order or questions today?"
          : "আসসালামু আলাইকুম! নাফী জার্সি হাউজে স্বাগতম। আপনার অর্ডার বা জার্সি সংক্রান্ত কোনো প্রশ্ন থাকলে বলুন!";
        fallbackBanglish = "Assalamu Alaikum! Nafi Jersey House e swagotom. Ki bhabe shahajjo korte pari?";
      }

      setMessages(prev => [...prev, {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: fallbackReply,
        speechText: fallbackReply,
        speechTextBanglish: fallbackBanglish,
        language: isEn ? 'en' : 'bn',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      speakText(fallbackReply, isEn ? 'en' : 'bn', fallbackBanglish);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmVoiceOrderSubmit = async () => {
    if (!activeVoiceOrder) return;
    setIsSubmittingOrder(true);

    try {
      const isCash = formPayMethod.toLowerCase().includes('cash') || formPayMethod.toLowerCase().includes('ক্যাশ');
      const isNagad = formPayMethod.toLowerCase().includes('nagad') || formPayMethod.toLowerCase().includes('নগদ');
      const cashTxn = `CASH-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const rawUserTrx = (formTrxId && formTrxId.trim()) ? formTrxId.trim() : '';
      const tokenMatch = rawUserTrx.match(/[A-Za-z0-9]{6,20}/);
      const candidateTrx = tokenMatch ? tokenMatch[0].toUpperCase() : '';
      const isForbidden = /^(COD|CASH|PENDING|NONE|VOICE|NULL|UNDEFINED|TRX|NA|UNKNOWN)/i.test(candidateTrx);
      const hasRealTrx = !isForbidden && candidateTrx.length >= 6;

      const finalTrxId = hasRealTrx ? candidateTrx : (isCash ? cashTxn : (isNagad ? 'Pending Nagad TrxID' : 'Pending bKash TrxID'));
      const finalPayMethod = isCash ? 'Cash on Delivery' : (isNagad ? 'Nagad' : formPayMethod);

      const response = await fetch('/api/ai-voice/confirm-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jerseyId: activeVoiceOrder.jersey.id,
          size: formSize,
          quantity: activeVoiceOrder.quantity || 1,
          customerName: formName || 'Voice Customer',
          customerPhone: formPhone || '01700000000',
          paymentMethod: finalPayMethod,
          transactionId: finalTrxId,
          customName: formCustomName || '',
          customNumber: formCustomNumber || ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        setVoiceOrderPlaced(data.order);
        
        // Notify parent app
        if (onOrderConfirmed) {
          onOrderConfirmed(data.order);
        }

        const isEn = voiceLang === 'en-US';
        let displayReply = data.replyText;
        let voiceSpeech = data.speechText;
        let banglishSpeech = data.speechTextBanglish;

        if (!voiceSpeech) {
          displayReply = isEn
            ? `Thank you! Your order for ${data.order.jerseyName} (Size: ${data.order.size}) has been recorded! Order ID: ${data.order.id}. Please send your bKash or Nagad transaction number and details to our Facebook page message.`
            : `ধন্যবাদ! আপনার ${data.order.jerseyName} (সাইজ: ${data.order.size}) এর অর্ডারটি সফলভাবে কনফার্ম করা হয়েছে। অর্ডার আইডি: ${data.order.id}। আপনার বিকাশ অথবা নগদ ট্রানজেকশন নম্বর আমাদের ফেসবুক পেজের মেসেজে পাঠিয়ে দিন এবং বিস্তারিত ডিটেইলস জানান।`;
          voiceSpeech = isEn
            ? "Please send your bKash or Nagad transaction number to our Facebook page message and provide details."
            : "আপনার বিকাশ অথবা নগদ ট্রানজেকশন নম্বর আমাদের ফেসবুক পেজের মেসেজে পাঠিয়ে দিন এবং বিস্তারিত ডিটেইলস জানান।";
          banglishSpeech = "Apnar bKash othoba Nagad transaction number amader Facebook page er message e pathiye din ebong bistarito details janan.";
        }

        setMessages(prev => [...prev, {
          id: `ai-conf-${Date.now()}`,
          sender: 'ai',
          text: displayReply,
          speechText: voiceSpeech,
          speechTextBanglish: banglishSpeech,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'CONFIRM_ORDER',
          orderDetails: data.order
        }]);

        speakText(voiceSpeech, isEn ? 'en' : 'bn', banglishSpeech);
        setActiveVoiceOrder(null);
      } else {
        alert('Could not process voice order placement. Please try again.');
      }
    } catch (err) {
      console.error('Voice order placement failed:', err);
      alert('Network error placing voice order.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const quickPrompts = voiceLang === 'bn-BD' ? [
    "অর্ডার কনফার্ম করো",
    "আজকের সেরা জার্সি কোনটি?",
    "ব্রাজিল জার্সি L সাইজ লাগবে",
    "আর্জেন্টিনা জার্সির দাম কত?",
    "আমার অর্ডার ট্র্যাক করো"
  ] : [
    "I want to confirm order",
    "Brazil jersey size L please",
    "How much is Argentina jersey?",
    "What sizes are available?",
    "Track my order status"
  ];

  return (
    <>
      {/* Floating Trigger Button (Non-intrusive z-40 and collapsible to never interfere with cards or editing) */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2">
        {isMinimized ? (
          <motion.button
            onClick={() => setIsMinimized(false)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-zinc-900 text-white shadow-2xl shadow-emerald-500/30 border border-emerald-400/50 cursor-pointer"
            title="Open AI Voice Assistant"
          >
            <Bot className="w-6 h-6 text-emerald-300" />
          </motion.button>
        ) : (
          <div className="relative flex items-center">
            <motion.button
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="relative group flex items-center gap-2.5 bg-gradient-to-r from-emerald-800/95 via-teal-850/95 to-zinc-950/95 text-white p-2 sm:p-2.5 pr-3.5 sm:pr-4 rounded-full shadow-2xl shadow-emerald-950/80 border border-emerald-400/40 cursor-pointer overflow-hidden backdrop-blur-md"
            >
              {/* Subtle Ambient Glow */}
              <span className="absolute -inset-1 rounded-full bg-emerald-500/15 animate-ping duration-1000 pointer-events-none" />

              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-zinc-950/80 border border-emerald-300/30 shadow-inner shrink-0">
                <Bot className="w-4 h-4 text-emerald-300 animate-pulse" />
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
              </div>

              <div className="text-left font-sans">
                <div className="flex items-center gap-1 text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  <span>AI Voice Assistant</span>
                </div>
                <div className="text-[10.5px] sm:text-[11px] font-semibold text-zinc-100 whitespace-nowrap">
                  কথা বলে অর্ডার করুন
                </div>
              </div>
            </motion.button>

            {/* Quick Minimize Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(true);
              }}
              className="ml-1 p-1 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 text-[10px] cursor-pointer"
              title="Minimize to floating icon"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Voice Agent Modal Drawer with high z-index (z-[80]) so it never gets blocked */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center sm:p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl h-[92vh] sm:h-[85vh] bg-zinc-900 border border-emerald-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-emerald-950/50 flex flex-col overflow-hidden"
            >
              {/* Header Bar */}
              <div className="p-4 sm:p-5 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
                    <Bot className="w-6 h-6" />
                    {(isListening || isSpeaking) && (
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-zinc-900"></span>
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                        NAFI AI Voice Assistant
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                      <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                      {isListening 
                        ? `শুনছি... (${voiceLang === 'bn-BD' ? 'বাংলা' : 'English'})` 
                        : isSpeaking 
                        ? 'কথা বলছি... (AI Speaking)' 
                        : 'প্রস্তুত আছেন (Ready)'}
                    </p>
                  </div>
                </div>

                {/* Header Controls & Language Toggle */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
                  {/* Language Selector Pill */}
                  <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-750">
                    <button
                      onClick={() => handleLanguageSwitch('bn-BD')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        voiceLang === 'bn-BD'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/50'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                      }`}
                      title="বাংলা ভয়েস মোড চালু করুন"
                    >
                      <span>🇧🇩</span>
                      <span>বাংলা</span>
                    </button>
                    <button
                      onClick={() => handleLanguageSwitch('en-US')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        voiceLang === 'en-US'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/50'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                      }`}
                      title="Switch to English Voice Mode"
                    >
                      <span>🇬🇧</span>
                      <span>English</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      isMuted 
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20' 
                        : 'bg-zinc-800 text-emerald-400 border-zinc-700 hover:bg-zinc-750'
                    }`}
                    title={isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      if (window.speechSynthesis) window.speechSynthesis.cancel();
                      setIsOpen(false);
                    }}
                    className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 hover:bg-zinc-750 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Soundwave Visualizer Bar & Test Voice Action */}
              <div className="bg-zinc-950/60 px-4 sm:px-6 py-2 border-b border-zinc-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 h-6">
                  {[40, 75, 100, 60, 90, 45, 80, 55, 95, 30, 70].map((h, idx) => (
                    <motion.div
                      key={idx}
                      animate={{
                        height: isListening || isSpeaking ? [`20%`, `${h}%`, `20%`] : `20%`
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6 + (idx % 3) * 0.2,
                        ease: 'easeInOut'
                      }}
                      className={`w-1 rounded-full ${
                        isListening 
                          ? 'bg-amber-400' 
                          : isSpeaking 
                          ? 'bg-emerald-400' 
                          : 'bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-300 flex items-center gap-1.5 bg-zinc-900 border border-zinc-700/80 px-3 py-1 rounded-full">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    {voiceLang === 'bn-BD' ? 'বাংলা ও ইংরেজি ভয়েস সাপোর্ট' : 'Bangla & English AI Voice'}
                  </span>
                </div>
              </div>

              {/* Conversation Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-zinc-900 to-zinc-950">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl p-4 shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none border border-emerald-500/30'
                        : 'bg-zinc-800/90 text-zinc-100 rounded-bl-none border border-zinc-700/60'
                    }`}>
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <span className="text-[11px] font-bold tracking-wider uppercase opacity-75 flex items-center gap-1">
                          {msg.sender === 'user' ? 'You' : 'Nafi AI Voice Agent'}
                        </span>
                        <span className="text-[10px] opacity-60 font-mono">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap font-sans font-medium">
                        {msg.text}
                      </p>

                      {msg.sender === 'ai' && (
                        <div className="flex flex-wrap items-center gap-2 mt-2.5">
                          <button
                            onClick={() => playAudioStream(msg.speechText || msg.text, msg.language || (voiceLang === 'bn-BD' ? 'bn' : 'en'))}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold transition-all cursor-pointer"
                            title="Click to play AI female voice audio"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>ভয়েস শুনুন (Listen Voice)</span>
                          </button>

                          {(msg.action === 'CONFIRM_ORDER' || msg.orderDetails || msg.text.includes('ফেসবুক') || msg.text.includes('Facebook')) && (
                            <a
                              href="https://www.facebook.com/share/1Bh4gYajWE/"
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold transition-all cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
                              <span>ফেসবুকে মেসেজ দিন</span>
                              <ExternalLink className="w-3 h-3 opacity-70" />
                            </a>
                          )}
                        </div>
                      )}

                      {msg.trackResult && (
                        <div className="mt-3 p-3 bg-zinc-900/90 rounded-xl border border-emerald-500/40 text-xs text-zinc-200 space-y-1.5 font-sans shadow-inner">
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                            <span className="font-bold text-emerald-400 font-mono text-sm">
                              অর্ডার নম্বর: {msg.trackResult.id}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {msg.trackResult.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-1 text-zinc-300">
                            <div><span className="text-zinc-400">জার্সি:</span> {msg.trackResult.jerseyName}</div>
                            <div><span className="text-zinc-400">সাইজ:</span> {msg.trackResult.size}</div>
                            <div><span className="text-zinc-400">ফোন:</span> {msg.trackResult.customerPhone}</div>
                            <div><span className="text-zinc-400">মূল্য:</span> ৳{msg.trackResult.amount}</div>
                            {msg.trackResult.transactionId && (
                              <div className="col-span-2 text-zinc-400 font-mono text-[11px]">
                                TRX ID: <span className="text-emerald-300">{msg.trackResult.transactionId}</span>
                              </div>
                            )}
                          </div>
                          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
                            <button
                              onClick={() => copyOrderToClipboard(msg.trackResult)}
                              className="inline-flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white bg-zinc-800 px-2 py-1 rounded cursor-pointer transition-all"
                            >
                              {copiedOrderId === msg.trackResult.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                              <span>{copiedOrderId === msg.trackResult.id ? 'কপি হয়েছে!' : 'অর্ডার কপি করুন'}</span>
                            </button>
                            <a
                              href="https://www.facebook.com/share/1Bh4gYajWE/"
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-blue-300 hover:text-blue-200 bg-blue-900/40 border border-blue-500/30 px-2 py-1 rounded cursor-pointer"
                            >
                              <span>ফেসবুকে পাঠান</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Processing Spinner */}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-800/80 rounded-2xl p-4 border border-zinc-700/50 flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-mono text-zinc-300">
                        {voiceLang === 'bn-BD' ? 'AI উত্তর তৈরি করছে...' : 'AI processing response...'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Voice Order Confirmation Preview Card */}
                {activeVoiceOrder && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="my-4 p-5 rounded-2xl bg-zinc-950 border-2 border-emerald-500/60 shadow-xl shadow-emerald-950/40"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-emerald-400" />
                        <h4 className="text-sm sm:text-base font-bold text-white">
                          ভয়েস অর্ডার রিভিউ (Voice Order Review)
                        </h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Ready
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
                      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                        <span className="text-zinc-400 block mb-0.5">Jersey Name:</span>
                        <strong className="text-emerald-300 font-bold text-sm block">
                          {activeVoiceOrder.jersey.name}
                        </strong>
                        <span className="text-zinc-400">Price: BDT {activeVoiceOrder.totalAmount}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                        <div>
                          <label className="text-zinc-400 block mb-1">Select Size:</label>
                          <div className="flex gap-1.5">
                            {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                              <button
                                key={s}
                                onClick={() => setFormSize(s)}
                                className={`px-2.5 py-1 rounded font-bold text-xs cursor-pointer ${
                                  formSize === s 
                                    ? 'bg-emerald-500 text-zinc-950' 
                                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                        <label className="text-zinc-400 block mb-1">Customer Name:</label>
                        <input
                          type="text"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1 text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                        <label className="text-zinc-400 block mb-1">Phone Number (11 digits):</label>
                        <input
                          type="text"
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          placeholder="017xxxxxxxx"
                          className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1 text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                        <label className="text-zinc-400 block mb-1 font-semibold text-[11px]">Payment Method:</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setFormPayMethod('bKash');
                            }}
                            className={`py-1.5 px-2 rounded font-bold text-xs cursor-pointer transition-all ${
                              formPayMethod === 'bKash' ? 'bg-pink-600 text-white' : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            bKash
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormPayMethod('Nagad');
                            }}
                            className={`py-1.5 px-2 rounded font-bold text-xs cursor-pointer transition-all ${
                              formPayMethod === 'Nagad' ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            Nagad
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormPayMethod('Cash on Delivery');
                            }}
                            className={`py-1.5 px-2 rounded font-bold text-xs cursor-pointer transition-all ${
                              formPayMethod === 'Cash on Delivery' ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            Cash (ক্যাশ)
                          </button>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                        <label className="text-zinc-400 block mb-1 font-semibold text-[11px]">Transaction ID (TrxID):</label>
                        <input
                          type="text"
                          value={formTrxId}
                          onChange={(e) => {
                            // Strict alphanumeric only - prevent conversational sentences from entering
                            const clean = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 20);
                            setFormTrxId(clean);
                          }}
                          placeholder="e.g. 9M87X2P1"
                          className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1 text-amber-300 text-xs font-mono font-bold uppercase focus:outline-none focus:border-emerald-400"
                        />
                        <p className="text-[10px] text-zinc-400 mt-1">
                          বিকাশ/নগদ ট্রানজেকশন আইডি (যেমন: 9M87X2P1)। শুধুমাত্র আসল TrxID লিখুন।
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-900/80 border border-emerald-500/30 sm:col-span-2">
                        <label className="text-emerald-400 font-bold block mb-1 text-[11px] uppercase tracking-wider">
                          👕 Custom Back Name & Jersey Number (Optional):
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={formCustomName}
                            onChange={(e) => setFormCustomName(e.target.value)}
                            placeholder="Custom Name (e.g. MESSI)"
                            className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1 text-white text-xs uppercase focus:outline-none focus:border-emerald-400"
                          />
                          <input
                            type="text"
                            value={formCustomNumber}
                            onChange={(e) => setFormCustomNumber(e.target.value)}
                            placeholder="Jersey Number (e.g. 10)"
                            className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1 text-amber-300 font-bold text-xs focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button
                        onClick={handleConfirmVoiceOrderSubmit}
                        disabled={isSubmittingOrder}
                        className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmittingOrder ? (
                          <>
                            <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                            Confirming...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-zinc-950" />
                            {voiceLang === 'bn-BD' ? 'অর্ডার ফাইনাল কনফার্ম করুন' : 'Confirm Voice Order Now'}
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setActiveVoiceOrder(null)}
                        className="w-full sm:w-auto py-3 px-4 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 font-bold text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Confirmed Order Card Badge */}
                {voiceOrderPlaced && (
                  <div className="p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500/50 text-emerald-200 text-xs shadow-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div>
                          <strong className="block text-white text-sm">অর্ডার সফলভাবে জমা হয়েছে!</strong>
                          <span className="font-mono text-emerald-300">Order ID: {voiceOrderPlaced.id} ({voiceOrderPlaced.jerseyName})</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                        Confirmed
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-500/20">
                      <a
                        href="https://www.facebook.com/share/1Bh4gYajWE/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>ফেসবুক পেজে মেসেজ পাঠান</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => copyOrderToClipboard(voiceOrderPlaced)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition-all cursor-pointer"
                      >
                        {copiedOrderId === voiceOrderPlaced.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedOrderId === voiceOrderPlaced.id ? 'কপি হয়েছে!' : 'অর্ডার সামারি কপি করুন'}</span>
                      </button>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Quick Prompts */}
              <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800/80 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(p)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs border border-zinc-700/80 transition-all cursor-pointer hover:border-emerald-500/50"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    {p}
                  </button>
                ))}
              </div>

              {/* Input Control Bar */}
              <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2">
                <button
                  onClick={toggleListening}
                  className={`p-3.5 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
                    isListening
                      ? 'bg-rose-600 text-white border-rose-400 animate-pulse shadow-lg shadow-rose-600/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-600/20'
                  }`}
                  title={isListening ? 'Stop Mic' : 'Start Mic'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={
                      isListening 
                        ? (voiceLang === 'bn-BD' ? 'কথা বলুন (Listening Bangla)...' : 'Speak now (Listening English)...')
                        : (voiceLang === 'bn-BD' ? 'কথা বলুন বা টাইপ করুন...' : 'Speak or type in English or Bangla...')
                    }
                    className="w-full bg-zinc-900 border border-zinc-750 text-white text-sm rounded-2xl px-4 py-3.5 focus:outline-none focus:border-emerald-500/80 font-sans"
                  />
                  {inputText && (
                    <button
                      onClick={() => setInputText('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim()}
                  className="p-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-zinc-950 font-bold cursor-pointer transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
