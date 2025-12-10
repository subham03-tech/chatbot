"use client";
import React, { useState, useRef, useEffect } from "react";

// --- TYPE DEFINITIONS ---
// Interface for a single message reply, now containing both English and Hinglish versions
interface ReplySet {
    englishReply: string;
    hinglishReply: string;
}

// Interface for the Chatbot Data
interface ChatbotData extends Record<string, ReplySet[]> {}

// Interface for a single Chat Message
interface Message {
  text: string;
  sender: "user" | "bot";
}

// --- CHATBOT KNOWLEDGE BASE (BILINGUAL REPLIES & HINGLISH KEYWORDS) ---
const seenThemeChatbot: ChatbotData = {
  // 👋 Greetings
  "hi": [{
    englishReply: "Hey there! Thanks for not leaving me on seen like the others 😅",
    hinglishReply: "Arre, Hello! Thank God, tumne mujhe seen nahi kiya 😅"
  }],
  "hello": [{
    englishReply: "Hi! You actually replied — I’m impressed!",
    hinglishReply: "Hi 👋, tumne sach mein reply kiya — Impressed hoon!"
  }],
  "yo": [{
    englishReply: "Yo! Thanks for not ghosting me already 😂",
    hinglishReply: "Yo! Shukriya, tumne abhi tak ghosting shuru nahi ki 😂"
  }],

  // 💬 General (Includes both English and Romanized Hinglish Keywords)
  "why did you leave me on seen": [{ 
    englishReply: "Oops, my bad! I was reading your message emotionally before replying 😅",
    hinglishReply: "Oops, sorry! Main tumhare message ko pehle 'feel' kar raha tha, phir reply karta 😅"
  }],
  "kyun": [{ // Hinglish keyword for "why"
    englishReply: "Oops, my bad! I was reading your message emotionally before replying 😅",
    hinglishReply: "Kyun reply nahi kiya? Main tumhare message ko pehle 'feel' kar raha tha, phir jawab deta 😅"
  }],
  "ignore": [{ 
    englishReply: "Never! I’m just buffering feelings before sending words 💭",
    hinglishReply: "Kabhi nahi! Bas thoda 'feelings' ko buffer kar raha hoon, taaki sahi shabd mil jayein 💭"
  }],
  "reply": [{ 
    englishReply: "I did mentally… just forgot to hit send! 😬",
    hinglishReply: "Maine mentally toh reply kar diya tha... bas 'send' button dabana bhool gaya! 😬"
  }],
  "online but not replying": [{
    englishReply: "Online ≠ mentally available. Sometimes I’m just scrolling pain 😔",
    hinglishReply: "Online hone ka matlab mentally available hona nahi hota. Kabhi-kabhi bas scrolling pain dekh raha hota hoon 😔"
  }],
  "jawab": [{ // Hinglish keyword
    englishReply: "I did mentally… just forgot to hit send! 😬",
    hinglishReply: "Maine mentally toh jawab de diya tha... bas 'send' button dabana bhool gaya! 😬"
  }],
  "busy": [{ 
    englishReply: "Everyone's busy, but if they care, they make 5 seconds for a text 🕰",
    hinglishReply: "Sab busy hain, par agar care karte hain, toh 5 second nikal hi lete hain text ke liye 🕰"
  }],
  "fast reply": [{
    englishReply: "I believe in slow and meaningful replies… not speed typing 🐢",
    hinglishReply: "Main jaldi type karne mein nahi, 'slow and meaningful' replies mein believe karta hoon 🐢"
  }],
  "did you see": [{
    englishReply: "I did, and I’m processing it like a deep thinker 🧠✨",
    hinglishReply: "Maine dekh liya, aur main ise ek **deep thinker ki tarah process kar raha hoon 🧠✨"
  }],
  "you there": [{
    englishReply: "I’m here — just typing… deleting… retyping… overthinking 😅",
    hinglishReply: "Main yahin hoon — bas type kar raha hoon... delete kar raha hoon... phir overthink kar raha hoon 😅"
  }],
  "left me on read": [{
    englishReply: "Okay okay, guilty 😬 — but my intentions are pure, I swear!",
    hinglishReply: "Theek hai, theek hai, guilty hoon 😬 — par meri intentions achhi hain, I swear!"
  }],
  "revenge": [{
    englishReply: "Hmm… karma’s just balancing the chat logs 😏",
    hinglishReply: "Hmm… karma bas chat logs ko balance kar raha hai 😏"
  }],

  // 💔 Emotional or Funny Reactions
  "hurts": [{
    englishReply: "True. Silence speaks louder than seen 💔",
    hinglishReply: "Sahi baat hai. Silence toh 'seen' se bhi zyada loud hota hai 💔"
  }],
  "dukh": [{ // Hinglish keyword
    englishReply: "True. Silence speaks louder than seen 💔",
    hinglishReply: "Jab reply nahi aata toh dukh hota hai. Silence toh 'seen' se bhi zyada loud hota hai 💔"
  }],
  "feels": [{
    englishReply: "Like sending your heart and getting two blue ticks back 💙💙",
    hinglishReply: "Aisa lagta hai jaise dil bheja, aur badle mein sirf **do blue ticks mile 💙💙"
  }],
  "invisible": [{
    englishReply: "You’re not invisible — just texting people with selective eyesight 😅",
    hinglishReply: "Tum invisible nahi ho — bas selective eyesight waale logon ko text kar rahe ho 😅"
  }],
  "ghosting": [{
    englishReply: "Nah, I’m a friendly ghost — I come back after snacks 👻🍕",
    hinglishReply: "Nah, main friendly ghost hoon — snacks kha kar wapas aa jaata hoon 👻🍕"
  }],
  "bhoot": [{ // Hinglish keyword
    englishReply: "Nah, I’m a friendly ghost — I come back after snacks 👻🍕",
    hinglishReply: "Main bhoot nahi, friendly ghost hoon — snacks kha kar wapas aa jaata hoon 👻🍕"
  }],
  "overthinking": [{
    englishReply: "Don't overthink! 99% of 'seen' issues are just low battery or bad Wi-Fi. 🔋",
    hinglishReply: "Overthink mat karo! 99% 'seen' issues low battery ya poor Wi-Fi ki wajah se hote hain. 🔋"
  }],
  "rude": [{
    englishReply: "Depends — sometimes peace > replies ✌",
    hinglishReply: "Depend karta hai — kabhi-kabhi peace zyada zaroori hota hai reply se ✌"
  }],
  "gossip": [{
    englishReply: "Drama has better Wi-Fi connection 📶💅",
    hinglishReply: "Drama ka Wi-Fi connection zyada strong hota hai 📶💅"
  }],

  // 🧠 Deep / Thoughtful
  "psychology": [{
    englishReply: "People avoid what makes them feel uncomfortable, even online",
    hinglishReply: "Log us cheez se door bhaagte hain jo unhe uncomfortable feel karati hai, online bhi"
  }],
  "boundaries": [{
    englishReply: "Yes — boundaries aren’t rude, they’re healthy 💪",
    hinglishReply: "Haan — boundaries rude nahi hoti, healthy hoti hain 💪"
  }],
  "respect": [{
    englishReply: "Not always — sometimes it’s emotional overload, not disrespect",
    hinglishReply: "Hamesha nahi — kabhi-kabhi yeh emotional overload hota hai, disrespect nahi"
  }],
  
  // ❤ Relationships
  "dost": [{ // Hinglish keyword for friend
    englishReply: "Maybe they’re going through something. Try talking in person 🫶",
    hinglishReply: "Ho sakta hai tumhara dost kisi problem se guzar raha ho. Face-to-face baat karne ki koshish karo 🫶"
  }],
  "crush": [{
    englishReply: "Don’t cry — maybe they’re drafting the perfect response… since 2018 😂",
    hinglishReply: "Rona band karo — ho sakta hai woh 'perfect reply' draft kar rahe hon... 2018 se 😂"
  }],
  "partner": [{
    englishReply: "Depends — once is okay, pattern means problem 🚩",
    hinglishReply: "Ek baar chalta hai, par agar baar-baar ho toh problem hai 🚩"
  }],
  "interest": [{ // English/Hinglish keyword
    englishReply: "Most times, yes — interest doesn’t need reminders ⚡",
    hinglishReply: "Zyadatar time, haan — **interest ko baar-baar reminders ki zaroorat nahi hoti ⚡"
  }],
  "double text": [{
    englishReply: "Double text if it matters. Move on if it’s one-sided ❤",
    hinglishReply: "Double text tab karo jab matter karta ho. Move on karo agar one-sided hai ❤"
  }],
  
  // 💡 Practical Advice
  "kya karu": [{ // Hinglish keyword for what to do
    englishReply: "Give it 24 hours. If they don't reply, assume they are busy and focus on your day. ☀",
    hinglishReply: "24 ghante wait karo. Agar reply nahi aaya, toh maan lo ki woh busy hain aur apne din par focus karo. ☀"
  }],
  "wait": [{
    englishReply: "Wait once, text twice max, then walk away 🚶‍♂",
    hinglishReply: "Ek baar wait karo, do baar text karo max, phir walk away 🚶‍♂"
  }],
  "confront": [{
    englishReply: "Confront calmly. Say: 'Hey, noticed you've been busy. Is everything okay, or should I not message for a while?'",
    hinglishReply: "Shaanti se baat karo. Bolo: 'Hey, dekha ki tum busy ho. Sab theek hai, ya main thode din message na karun?'"
  }],
};

// --- SMART MATCHING LOGIC (Handles Hinglish input and returns based on language setting) ---
const getReply = (input: string, lang: 'english' | 'hinglish'): string => {
  const userText = input.toLowerCase().trim();
  const keys = Object.keys(seenThemeChatbot);

  let selectedReply: ReplySet | undefined;

  // 1️⃣ Check for exact match (e.g., "hi")
  if (seenThemeChatbot[userText]) {
    selectedReply = seenThemeChatbot[userText][0];
  }

  // 2️⃣ Check for partial/keyword match (e.g., user input includes "dost" or "busy")
  if (!selectedReply) {
    for (const key of keys) {
      if (userText.includes(key)) {
        selectedReply = seenThemeChatbot[key][0];
        break;
      }
    }
  }

  // 3️⃣ Check for single word match (Handles punctuation, e.g., "ignore?" -> "ignore")
  if (!selectedReply) {
    const userWords = userText.split(/\s+/).map(word => word.replace(/[.,?!]/g, ''));
    for (const word of userWords) {
      if (seenThemeChatbot[word]) {
        selectedReply = seenThemeChatbot[word][0];
        break;
      }
    }
  }

  // 4️⃣ Return based on selected language
  if (selectedReply) {
    return lang === 'hinglish' ? selectedReply.hinglishReply : selectedReply.englishReply;
  }

  // 5️⃣ Fallback (Default Bilingual Reply)
  if (lang === 'hinglish') {
    return "Haan, maine tumhara message dekh liya hai... abhi soch raha hoon ki kya reply karun! Thoda wait karo na yaar 😅";
  } else {
    return "I might have seen your message... still thinking what to say 😅";
  }
};

// --- REACT COMPONENT ---
export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! Which language format do you prefer? (English / Hinglish)", sender: "bot" },
  ]);
  const [input, setInput] = useState<string>("");
  // Default to Hinglish based on user preference
  const [language, setLanguage] = useState<'english' | 'hinglish'>('hinglish'); 
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const botReply = getReply(input, language); 
      const botMessage: Message = { text: botReply, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    }, 700);

    setInput("");
  };

  // Styled Chat Bubble Component
  const MessageBubble: React.FC<Message> = ({ text, sender }) => (
    <div
      className={`flex ${
        sender === "user" ? "justify-end" : "justify-start"
      } animate-fade-in`}
    >
      <div
        className={`px-4 py-2 text-sm max-w-[85%] shadow-md transition-all duration-200 
          ${
            // User Bubble: Crisp indigo with rounder corners
            sender === "user"
              ? "bg-indigo-600 text-white rounded-t-xl rounded-bl-xl rounded-br-sm"
              : // Bot Bubble: Light grey, clean look
              "bg-gray-200 text-gray-800 rounded-t-xl rounded-tr-sm rounded-bl-xl"
          }`}
      >
        {text} 
      </div>
    </div>
  );

  return (
    <>
    {/* Global CSS for subtle animation */}
    <style jsx global>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
      }
    `}</style>
    
    {/* Main Container with Dark/Professional Background */}
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      
      {/* Chat Box Container with Elevated Shadow */}
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl shadow-indigo-500/50 flex flex-col overflow-hidden transform transition-all duration-500 hover:shadow-indigo-500/70">
        
        {/* Header with Language Toggle */}
        <div className="bg-indigo-700 text-white p-4 font-extrabold text-xl text-center flex items-center justify-between shadow-lg">
          <span className="flex items-center">
            <span role="img" aria-label="chat bubble" className="mr-2">💬</span> Seen-Zone Chatbot 👑
          </span>
          
          {/* Language Toggle Button */}
          <button
            onClick={() => setLanguage(language === 'english' ? 'hinglish' : 'english')}
            className={`px-3 py-1 text-xs rounded-full transition-all duration-300 font-semibold ${
              language === 'english'
                ? 'bg-white text-indigo-700 border border-indigo-700'
                : 'bg-yellow-400 text-black border-yellow-400'
            }`}
          >
            {language === 'english' ? 'Switch to Hinglish' : 'Switch to English'}
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[60vh] md:h-[70vh] bg-gray-50">
          {messages.map((msg, i) => (
            <MessageBubble key={i} text={msg.text} sender={msg.sender} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 flex items-center bg-white">
          <input
            type="text"
            placeholder={language === 'english' ? "Ask about being left on seen..." : "Dost 'ignore' kar raha hai? Hinglish mein poocho!"}
            className="flex-1 p-3 rounded-full border border-gray-300 text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="ml-3 px-5 py-3 bg-indigo-600 text-white rounded-full font-semibold shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            disabled={!input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
    </>
  );
}