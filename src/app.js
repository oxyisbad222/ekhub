import React, { useState } from 'react';

// === Helper Components ===

// In a real-world application, Google Fonts would be linked in your public/index.html file.
// For a self-contained immersive, we'll use an internal style block.
const GlobalFonts = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Creepster&family=Metal+Mania&family=IBM+Plex+Sans:wght@400;700&display=swap');
      
      /* Define custom utility classes for font usage if needed */
      /* Or apply directly in JSX using square bracket notation: font-['Creepster'] */
    `}
  </style>
);


// A simple Pentagram SVG component for thematic background
const PentagramSVG = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="50,5 61.8,38.2 98.8,38.2 69.1,61.8 80.9,95.1 50,71.8 19.1,95.1 30.9,61.8 1.2,38.2 38.2,38.2" />
  </svg>
);

// Reusable component for expandable text content (books, theories, etc.)
const ExpandableTextCard = ({ title, author, summary, fullDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="bg-red-900 rounded-lg shadow-xl p-6 cursor-pointer border border-red-700 hover:scale-102 transition-transform duration-300"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <h3 className="text-2xl font-['Metal_Mania'] mb-2 text-red-100">
        {title}
      </h3>
      {author && <p className="text-red-300 text-lg mb-3 font-['IBM_Plex_Sans']">- {author}</p>}
      <p className="text-red-200 text-base leading-relaxed font-['IBM_Plex_Sans']">
        {summary}
        <span className="font-bold text-red-400"> {isExpanded ? '' : '... (click to read more)'}</span>
      </p>
      {isExpanded && (
        // Using dangerouslySetInnerHTML to render HTML strings
        <div 
          className="mt-3 text-red-200 text-base leading-relaxed font-['IBM_Plex_Sans']"
          dangerouslySetInnerHTML={{ __html: fullDetails }}
        ></div>
      )}
    </div>
  );
};

// Modal component for displaying detailed entity information
const Modal = ({ entity, onClose }) => {
  const [isGifZoomed, setIsGifZoomed] = useState(false);

  if (!entity) return null;

  return (
    // Outer overlay, ensuring it covers the whole screen and adds padding
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-85 backdrop-blur-md">
      {/* Modal content container - now explicitly setting max-height and overflow */}
      <div className="relative bg-red-950 rounded-lg shadow-2xl p-6 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl
                  max-h-[95vh] overflow-y-auto transform scale-100 transition-transform duration-300 border-2 border-red-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-100 hover:text-white text-3xl font-bold p-2 rounded-full bg-red-700 hover:bg-red-800 transition-colors duration-200 z-10"
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-3xl sm:text-4xl font-['Metal_Mania'] mb-4 text-red-100 border-b-2 border-red-400 pb-2">
          {entity.name}
        </h3>
        {/* Display the GIF if it's an idle animation entity */}
        {entity.hasIdleAnimation && entity.idleGif && (
          <div className="flex justify-center mb-6">
            <img
              src={entity.idleGif}
              alt={`${entity.name} idle animation`}
              className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-red-600 shadow-lg cursor-pointer
                ${isGifZoomed ? 'scale-150 ring-4 ring-red-500' : ''} transition-transform duration-300`}
              onClick={() => setIsGifZoomed(!isGifZoomed)}
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/128x128/400000/ffffff?text=GIF+Error"; }}
            />
          </div>
        )}

        <div className="mt-4 space-y-4 font-['IBM_Plex_Sans']">
          <p className="text-xl text-red-100 leading-relaxed">
            <span className="font-bold text-red-300">Influence:</span> {entity.details}
          </p>
          <div className="text-xl text-red-100 leading-relaxed">
            <span className="font-bold text-red-300">Sigil:</span> {typeof entity.sigil === 'string' ? entity.sigil : entity.sigil}
          </div>
        </div>
      </div>
    </div>
  );
};

// SigilCard component for interactive entity selection in Morning Star section
const SigilCard = ({ name, details, sigil, hasIdleAnimation = false, idleGif = '', onSelect }) => { 
  return (
    <div
      className={`bg-red-900 rounded-lg p-6 cursor-pointer transform hover:scale-105 transition-transform duration-300 shadow-xl border border-red-700`}
      onClick={() => onSelect({ name, details, sigil, hasIdleAnimation, idleGif })}
    >
      <h3 className="text-2xl font-['Metal_Mania'] mb-3 text-red-100 flex items-center justify-between">
        {name}
        {/* Only show a small indicator if it has an idle animation GIF */}
        {hasIdleAnimation && (
          <span className="text-red-400 text-4xl animate-pulse">✨</span> 
        )}
      </h3>
      <p className="text-md text-red-200 mt-2 font-['IBM_Plex_Sans']">Click for more details</p>
    </div>
  );
};

// New component for displaying Pixel Art images
const PixelArtCard = ({ name, imageUrl }) => (
  <div className="bg-red-900 rounded-lg shadow-xl p-4 border border-red-700 flex flex-col items-center justify-center text-center">
    <h3 className="text-xl font-['Metal_Mania'] mb-2 text-red-100">{name}</h3>
    <img
      src={imageUrl}
      alt={`${name} pixel art`}
      className="w-40 h-40 object-contain rounded-md border-2 border-red-600"
      onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/160x160/400000/ffffff?text=Image+Error"; }}
    />
  </div>
);

// Navigation Link component
const NavLink = ({ title, onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 rounded-md bg-red-700 hover:bg-red-600 text-red-100 font-bold transition-colors duration-200 text-sm sm:text-base whitespace-nowrap font-['IBM_Plex_Sans']"
  >
    {title}
  </button>
);

// === Page Components ===

const HomePage = ({ setCurrentPage }) => (
  <section className="w-full max-w-4xl bg-red-900 rounded-lg shadow-xl p-6 mb-8 border-2 border-red-700 z-10 flex flex-col items-center justify-center text-center min-h-[50vh]">
    <h2 className="text-3xl sm:text-4xl font-['Metal_Mania'] mb-6 text-red-400">
      Welcome to the Esoteric Archive
    </h2>
    <p className="text-xl text-red-200 leading-relaxed mb-8 font-['IBM_Plex_Sans']">
      Explore the hidden knowledge of universal laws, ancient demonology, powerful rituals, and the philosophies of the Left-Hand Path. Unveil the mysteries that shape reality.
    </p>
    <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
      <NavLink title="Explore Laws" onClick={() => setCurrentPage('universalLaws')} />
      <NavLink title="Discover Entities" onClick={() => setCurrentPage('morningStar')} />
      <NavLink title="Unveil Rituals" onClick={() => setCurrentPage('rituals')} />
    </div>
  </section>
);

const UniversalLawsPage = () => (
  <section className="w-full max-w-4xl bg-red-900 rounded-lg shadow-xl p-6 mb-8 border-2 border-red-700 z-10">
    <h2 className="text-3xl sm:text-4xl font-['Metal_Mania'] mb-6 text-red-400 border-b-2 border-red-400 pb-2">
      Universal Laws
    </h2>
    <div className="space-y-4">
      <ExpandableTextCard
        title="Kybalion"
        author="Three Initiates"
        summary="The Kybalion, published anonymously in 1908, presents seven universal principles of Hermetic philosophy."
        fullDetails="These principles are Mentalism, Correspondence, Vibration, Polarity, Rhythm, Cause and Effect, and Gender. They are presented as the fundamental truths governing the universe, intended to provide keys to understanding and mastering one's reality through mental and spiritual development. The book encourages the practitioner to align their consciousness with these cosmic laws to influence their personal experiences."
      />
      <ExpandableTextCard
        title="The Master Key System"
        author="Charles F. Hanaal"
        summary="Charles F. Haanel's 'The Master Key System' is a personal development guide, originally a 24-lesson correspondence course from 1912."
        fullDetails="It focuses heavily on the power of thought and the law of attraction, instructing readers on how to harness their mental faculties to achieve personal and material success. Haanel emphasizes visualization, affirmations, and regular mental exercises to align one's subconscious with desired outcomes, aiming to unlock a 'master key' to wealth, health, and spiritual fulfillment."
      />
    </div>
  </section>
);

const DemonologyPage = () => (
  <section className="w-full max-w-4xl bg-red-900 rounded-lg shadow-xl p-6 mb-8 border-2 border-red-700 z-10">
    <h2 className="text-3xl sm:text-4xl font-['Metal_Mania'] mb-6 text-red-600 border-b-2 border-red-600 pb-2">
      Demonology
    </h2>
    <div className="space-y-4">
      <ExpandableTextCard
        title="Inferno"
        author="Dante Alighieri"
        summary="Dante's 'Inferno,' the first part of his 'Divine Comedy,' describes an allegorical journey through the nine circles of Hell."
        fullDetails="Guided by the poet Virgil, Dante witnesses vivid punishments tailored to specific sins, reflecting medieval Christian theology and morality. Each circle is a deeper descent into depravity, illustrating the consequences of unrepentant sin and exploring themes of divine justice, free will, and the path to salvation through suffering and repentance."
      />
      <ExpandableTextCard
        title="Grimorium Verum (1517 & 1817)"
        author="Attributed to Alibeck of Memphis"
        summary="The 'Grimorium Verum' is an influential grimoire, a magical textbook claiming an earlier date than its actual 18th-century appearance."
        fullDetails="It contains detailed instructions for summoning various demons and spirits, including their sigils, rituals, and incantations. Known for its notorious reputation and diverse interpretations across different editions, it remains a significant (and controversial) text in ceremonial magic, offering pathways for practitioners to engage with infernal entities for various purposes, from gaining knowledge to commanding obedience."
      />
      <ExpandableTextCard
        title="Advanced Demonology Concepts"
        summary="Delve deeper into the hierarchy, classifications, and practical applications of demonology in esoteric traditions."
        fullDetails="Advanced demonology often explores the intricate relationships between various demonic entities, their historical and cultural evolution, and their roles in different magical systems. This can involve studying specific grimoires, understanding the concept of pacts, recognizing demonic influences in mundane life, and exploring methods of banishment or invocation, always with an emphasis on knowledge and self-protection."
      />
    </div>
  </section>
);

const ChaosMagicPage = () => (
  <section className="w-full max-w-4xl bg-red-900 rounded-lg shadow-xl p-6 mb-8 border-2 border-red-700 z-10">
    <h2 className="text-3xl sm:text-4xl font-['Metal_Mania'] mb-6 text-red-400 border-b-2 border-red-400 pb-2">
      Chaos Magic
    </h2>
    <div className="space-y-4">
      <ExpandableTextCard
        title="Liber Null (1) and Liber Kaos (2)"
        author="Peter Carroll"
        summary="Peter Carroll's 'Liber Null' and 'Liber Kaos' are foundational texts in Chaos Magic, emphasizing experiential magic and subjective belief."
        fullDetails="Liber Null introduces core concepts like sigilization, gnosis, and the flexible nature of belief systems as tools for magical work. Liber Kaos expands on these, delving into advanced magical theory, ethics, and the application of chaos principles to diverse magical workings, including paradigm shifting, invocation, and evocation. Together, they advocate for a highly experimental and results-oriented approach to magic, detached from rigid dogmas."
      />
      <ExpandableTextCard
        title="Beginner Chaos Magic: Core Principles"
        summary="An introduction to the fundamental concepts and initial practices of Chaos Magic for new practitioners."
        fullDetails="Beginner Chaos Magic focuses on understanding 'belief as a tool,' sigilization (condensing desire into a symbol), and achieving gnosis (a state of heightened consciousness for magical work). It often starts with simple exercises like creating and charging sigils for minor desires, learning basic meditation techniques, and developing a flexible mindset towards magical paradigms, emphasizing personal experimentation over dogma."
      />
      <ExpandableTextCard
        title="Advanced Chaos Magic: Theory & Practice"
        summary="Explore complex theories, advanced techniques, and the broader implications of Chaos Magic for experienced practitioners."
        fullDetails="Advanced Chaos Magic delves into more intricate concepts such as meta-belief, paradigm shifting on a grand scale, advanced servitor creation, and the manipulation of archetypes. Practitioners might explore complex ritual structures, dream magic, or the application of chaos principles to non-magical fields like art and psychology. It encourages deep self-analysis, rigorous experimentation, and the continuous deconstruction and reconstruction of personal realities."
      />
    </div>
  </section>
);

const MorningStarPage = ({ onSelectEntity }) => (
  <section className="w-full max-w-4xl bg-red-900 rounded-lg shadow-xl p-6 mb-8 border-2 border-red-700 z-10">
    <h2 className="text-3xl sm:text-4xl font-['Metal_Mania'] mb-6 text-red-400 border-b-2 border-red-400 pb-2">
      Morning Star, Temptations, Sigils
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SigilCard
        name="Lucifer (Venus)"
        details="Lucifer, often associated with the planet Venus (the Morning Star), represents themes of worldly influence, illumination, vanity, and the pursuit of power. In some esoteric traditions, he is seen as a bringer of light and knowledge, challenging established norms and encouraging individual will, though this can lead to hubris and a focus on material dominion. His temptations often involve promises of earthly success and self-glory."
        sigil={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-16 h-16 text-red-400"
          >
            <path d="M12 1L9 7l-6 1.5 4.5 4.5L6 23l6-3 6 3-1.5-8.5 4.5-4.5-6-1.5L12 1zM12 3.86l2.12 4.3 4.75.69-3.44 3.36.81 4.73L12 18.27l-4.24 2.23.81-4.73L4.13 8.85l4.75-.69L12 3.86z"/>
          </svg>
        }
        hasIdleAnimation={false} // No GIF for Lucifer
        onSelect={onSelectEntity}
      />
      <SigilCard
        name="Astaroth"
        details="Astaroth is a powerful demon often associated with pride, wrath, and rationality. In various grimoires, Astaroth is depicted as a grand duke of Hell, capable of revealing secrets of the past, present, and future, and teaching liberal sciences. The temptations related to Astaroth can involve intellectual arrogance, inciting conflict, and manipulating others through cunning, emphasizing a detached and often cold logic over empathy."
        sigil={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-16 h-16 text-red-400"
          >
            <path d="M12 1L3 12h5v11h8V12h5L12 1zm0 3.76L16.24 9H7.76L12 4.76zM9 11h6v10H9V11z"/>
          </svg>
        }
        hasIdleAnimation={false} // No GIF for Astaroth
        onSelect={onSelectEntity}
      />
      <SigilCard
        name="Leviathan"
        details="Leviathan, a primordial sea serpent, is typically associated with envy, chaos, and instigation/manipulation. This entity represents the vast, uncontrollable forces of the subconscious and the deep, often turbulent, emotional waters. Temptations linked to Leviathan involve stirring up discord, fostering resentment, and subtly influencing others through emotional exploitation, playing on insecurities and desires for control."
        sigil={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-16 h-16 text-red-400"
          >
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zM12 6c-3.313 0-6 2.687-6 6s2.687 6 6 6 6-2.687 6-6-2.687-6-6-6zm-2 2h4v8h-4zM12 4a8 8 0 0 0-7.071 4H19.071A8 8 0 0 0 12 4z"/>
            {/* A simplified serpent-like flow */}
            <path d="M7 12c0 2.76 2.24 5 5 5s5-2.24 5-5-2.24-5-5-5-5 2.24-5 5z"/>
            <path d="M17 12c0 2.76-2.24 5-5 5s-5-2.24-5-5-2.24-5-5-5-5 2.24-5 5z"/>
          </svg>
        }
        hasIdleAnimation={false} // No GIF for Leviathan
        onSelect={onSelectEntity}
      />
      <SigilCard
        name="Asmodeus"
        details="Asmodeus is often known as the demon of lust and wrath, but also strongly associated with revenge and perceived luck or ill fortune. In some texts, he is said to be the king of demons who governs dice and gaming. His temptations can lead individuals down paths of uncontrolled desire, violent retribution, or a belief that their fate is solely determined by external forces rather than personal agency, sometimes manifesting as irrational gambling or risky ventures."
        sigil="Asmoday sigil: this can be found in the Lesser Key of Solomon."
        hasIdleAnimation={true}
        idleGif="https://media2.giphy.com/media/4PHcnqCQFpNrQ7KCw0/giphy.gif?cid=9b38fe91kqq07g7pqr31u4d9nhdvs0l9ai1u0gtg2qoggzwk&ep=v1_gifs_username&rid=giphy.gif&ct=g" // Asmodeus GIF
        onSelect={onSelectEntity}
      />
      <SigilCard
        name="Mammon"
        details="Mammon personifies wealth, greed, and avarice. This entity is often depicted as a demon or a pagan deity embodying material possessions and the pursuit of earthly riches. Temptations associated with Mammon involve an insatiable desire for money and material goods, leading to exploitation, hoarding, and a disregard for spiritual or ethical values in favor of financial gain. It represents the corrupting influence of excessive materialism."
        sigil={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-16 h-16 text-red-400"
          >
            {/* stylized money bag with coins */}
            <path d="M17 4H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2zM7 6h10v2H7V6zm0 4h10v8H7v-8z"/>
            <circle cx="12" cy="14" r="3" />
            <path d="M12 11v-1m0 8v-1m-3-4h1m4 0h1"/>
          </svg>
        }
        hasIdleAnimation={false} // No GIF for Mammon
        onSelect={onSelectEntity}
      />
      <SigilCard
        name="Lilith"
        details="Lilith is a complex figure often associated with femininity, lustful temptation, and fierce independence. In some traditions, she is depicted as the first woman, created equal to Adam, who refused to be subservient and left Eden. Her influence encourages autonomy, sexual liberation, and a rejection of patriarchal norms, but her temptations can also lead to excessive indulgence, unrestrained desire, and a destructive pursuit of freedom without responsibility."
        sigil={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-16 h-16 text-red-400"
          >
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-10v-2H9v2H7v2h2v2h2v-2h2v-2h-2zM12 4a8 8 0 0 0-7.071 4H19.071A8 8 0 0 0 12 4z"/>
            {/* Simple L intertwining with crescent moon using path data for abstract representation */}
            <path d="M10 8L7 16H9L12 8H10z"/> {/* 'L' part */}
            <path d="M17 12c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zM13 8v8h2V8h-2z"/> {/* Abstract Crescent */}
          </svg>
        }
        hasIdleAnimation={true}
        idleGif="https://media3.giphy.com/media/JBS9s9anIsvDC8uEUo/giphy.gif?cid=9b38fe91lv9bdrk5m3wk8sgii1e2y6f66iz83a20eprgnwss&ep=v1_gifs_username&rid=giphy.gif&ct=g" // Lilith GIF
        onSelect={onSelectEntity}
      />
    </div>
  </section>
);

const TheSatanicTemplePage = () => (
  <section className="w-full max-w-4xl bg-red-900 rounded-lg shadow-xl p-6 mb-8 border-2 border-red-700 z-10">
    <h2 className="text-3xl sm:text-4xl font-['Metal_Mania'] mb-6 text-red-400 border-b-2 border-red-400 pb-2">
      The Satanic Temple
    </h2>
    <div className="space-y-4">
      <ExpandableTextCard
        title="Origins and Philosophy"
        summary="The Satanic Temple (TST) is a non-theistic religious and political activist organization founded in 2013."
        fullDetails="TST's mission is to encourage benevolence and empathy, reject tyrannical authority, advocate practical common sense, oppose injustice, and undertake noble pursuits. They use Satan as a metaphorical figure representing rebellion against arbitrary authority and the pursuit of knowledge, not as a literal deity. Their seven fundamental tenets underpin their activism, often involving legal challenges to protect religious freedom and promote secularism."
      />
      <ExpandableTextCard
        title="Key Activism and Tenets"
        summary="TST engages in various forms of activism, notably in areas of religious freedom, reproductive rights, and separation of church and state."
        fullDetails="Their seven tenets include: compassion and reason, the struggle for justice, respect for autonomy, embracing scientific understanding, individual action for collective well-being, and the tenet that 'every tenet is a guiding principle designed to inspire nobility in action and thought.'"
      />
    </div>
  </section>
);

const RitualsPage = () => (
  <section className="w-full max-w-4xl bg-red-900 rounded-lg shadow-xl p-6 mb-8 border-2 border-red-700 z-10">
    <h2 className="text-3xl sm:text-4xl font-['Metal_Mania'] mb-6 text-red-400 border-b-2 border-red-400 pb-2">
      Rituals and Practices
    </h2>
    <div className="space-y-4">
      <ExpandableTextCard
        title="Purpose of Rituals"
        summary="In esoteric traditions, rituals serve as structured acts designed to achieve specific magical or spiritual outcomes."
        fullDetails="They can range from simple daily affirmations to complex ceremonial workings involving specific tools, invocations, and visualizations. The primary purpose is to focus the practitioner's will and consciousness, bypass the conscious mind, and influence reality on subtle planes, often by connecting with archetypal energies, spirits, or subconscious forces to manifest desired changes."
      />
      <ExpandableTextCard
        title="Common Ritual Components"
        summary="Most rituals share common elements, regardless of their specific magical system or intent."
        // Fixed: Using HTML directly within the string for dangerouslySetInnerHTML
        fullDetails={`
          <ul>
            <li><span class='font-bold text-red-300'>Preparation:</span> Cleansing, meditation, creating a sacred space.</li>
            <li><span class='font-bold text-red-300'>Invocation/Evocation:</span> Calling upon specific energies, deities, or spirits.</li>
            <li><span class='font-bold text-red-300'>Gnosis:</span> Achieving an altered state of consciousness to empower the magical act.</li>
            <li><span class='font-bold text-red-300'>Visualization:</span> Clearly imagining the desired outcome.</li>
            <li><span class='font-bold text-red-300'>Banishing:</span> Closing the ritual and dispelling unwanted energies.</li>
          </ul>
          The specific components vary widely by tradition and personal practice.
        `}
      />
      <ExpandableTextCard
        title="Rituals in Modern Occultism"
        summary="Modern occultism sees rituals adapted for contemporary practice, often focusing on personal transformation and psychological effects."
        fullDetails="Beyond traditional ceremonial magic, modern practitioners use rituals for self-exploration, shadow work, psychological reprogramming, and artistic expression. The emphasis shifts from literal summoning to understanding the symbolic power and psychological impact of ritual acts, integrating elements from various traditions or creating entirely new practices based on individual needs and experiences."
      />
    </div>
  </section>
);

const LeftHandPathPage = () => (
  <section className="w-full max-w-4xl bg-red-900 rounded-lg shadow-xl p-6 mb-8 border-2 border-red-700 z-10">
    <h2 className="text-3xl sm:text-4xl font-['Metal_Mania'] mb-6 text-red-400 border-b-2 border-red-400 pb-2">
      The Left-Hand Path
    </h2>
    <div className="space-y-4">
      <ExpandableTextCard
        title="Core Philosophy"
        summary="The Left-Hand Path (LHP) is a broad categorization for esoteric and spiritual philosophies that emphasize individualism and self-deification."
        fullDetails="Unlike Right-Hand Path (RHP) traditions, which often seek union with a higher divine force through adherence to established moral codes and surrender of the ego, LHP systems prioritize the development of the individual will, self-knowledge, and the transgression of conventional norms. Practitioners often aim to become 'gods' or 'masters' of their own reality rather than serving an external deity."
      />
      <ExpandableTextCard
        title="Key Characteristics"
        summary="LHP traditions are characterized by several key traits, though specifics vary widely between different schools of thought."
        // Fixed: Using HTML directly within the string for dangerouslySetInnerHTML
        fullDetails={`
          <ul>
            <li><span class='font-bold text-red-300'>Individual Sovereignty:</span> Emphasis on personal freedom and autonomy.</li>
            <li><span class='font-bold text-red-300'>Self-Deification:</span> The goal of becoming one's own divine authority.</li>
            <li><span class='font-bold text-red-300'>Transgression/Taboo Breaking:</span> Deliberately challenging societal or religious taboos to gain insight or power.</li>
            <li><span class='font-bold text-red-300'>Antinomianism:</span> Rejection of external moral laws in favor of self-determined ethics.</li>
            <li><span class='font-bold text-red-300'>Carnal vs. Spiritual:</span> Often integrates the physical and material aspects of existence into spiritual practice.</li>
          </ul>
          It is important to note that LHP does not inherently equate to 'evil,' but rather a different path of spiritual development.
        `}
      />
      <ExpandableTextCard
        title="LHP vs. Right-Hand Path"
        summary="The distinction between LHP and RHP is primarily philosophical, regarding the practitioner's relationship with the divine and societal norms."
        fullDetails="RHP traditions typically involve submission to divine will, adherence to strict moral codes, and the eventual dissolution of the ego into a larger whole. LHP, conversely, focuses on strengthening the ego, challenging dogmas, and forging one's own spiritual path. While RHP often seeks external spiritual authority, LHP emphasizes internal authority and self-mastery."
      />
    </div>
  </section>
);

// New Page for Pixel Art Gallery
const PixelArtGalleryPage = () => (
  <section className="w-full max-w-4xl bg-red-900 rounded-lg shadow-xl p-6 mb-8 border-2 border-red-700 z-10">
    <h2 className="text-3xl sm:text-4xl font-['Metal_Mania'] mb-6 text-red-400 border-b-2 border-red-400 pb-2">
      Demonic Pixel Art Gallery
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <PixelArtCard name="Lucifer" imageUrl="https://i.ibb.co/cXCxf2qb/download-2.png" />
      <PixelArtCard name="Astaroth" imageUrl="https://i.ibb.co/93djxM1F/download-3.png" />
      <PixelArtCard name="Leviathan" imageUrl="https://i.ibb.co/JRjSWb64/download-4.png" />
      <PixelArtCard name="Asmodeus" imageUrl="https://i.ibb.co/d4RjdB5X/download-1.png" />
      <PixelArtCard name="Mammon" imageUrl="https://i.ibb.co/q38LKrqD/download-5.png" />
      <PixelArtCard name="Lilith" imageUrl="https://i.ibb.co/Df7wCMnw/download.png" />
    </div>
  </section>
);


// === Main App Component ===

const App = () => {
  // State to manage which page is currently active
  const [currentPage, setCurrentPage] = useState('home');
  // State to manage the modal for demonic entities
  const [selectedEntity, setSelectedEntity] = useState(null);

  // Handlers for modal
  const handleOpenModal = (entityData) => {
    setSelectedEntity(entityData);
  };
  const handleCloseModal = () => {
    setSelectedEntity(null);
  };

  // Conditional rendering function for pages
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'universalLaws':
        return <UniversalLawsPage />;
      case 'demonology':
        return <DemonologyPage />;
      case 'chaosMagic':
        return <ChaosMagicPage />;
      case 'morningStar':
        return <MorningStarPage onSelectEntity={handleOpenModal} />;
      case 'satanicTemple':
          return <TheSatanicTemplePage />;
      case 'rituals':
          return <RitualsPage />;
      case 'leftHandPath':
          return <LeftHandPathPage />;
      case 'pixelArtGallery': // New case for the pixel art gallery
        return <PixelArtGalleryPage />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-red-100 font-['IBM_Plex_Sans'] p-4 flex flex-col items-center relative overflow-hidden">
      <GlobalFonts /> {/* Include Google Fonts styles */}

      {/* Pentagrams - positioned absolutely for visual flair */}
      <PentagramSVG className="absolute top-4 left-4 w-24 h-24 text-red-700 opacity-10 rotate-45 transform hover:scale-110 transition-transform duration-300 animate-pulse" />
      <PentagramSVG className="absolute bottom-4 right-4 w-24 h-24 text-red-700 opacity-10 -rotate-30 transform hover:scale-110 transition-transform duration-300 animate-pulse" />
      <PentagramSVG className="absolute top-1/4 right-8 w-16 h-16 text-red-700 opacity-8 rotate-90 transform hover:scale-110 transition-transform duration-300 hidden md:block animate-pulse" />
      <PentagramSVG className="absolute bottom-1/4 left-8 w-16 h-16 text-red-700 opacity-8 -rotate-90 transform hover:scale-110 transition-transform duration-300 hidden md:block animate-pulse" />


      {/* Page Title */}
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-8 mt-4 text-red-100 drop-shadow-lg z-10 font-['Creepster']">
        Esoteric Knowledge Hub
      </h1>

      {/* Navigation Bar */}
      <nav className="w-full max-w-4xl bg-red-900 p-4 rounded-lg shadow-lg mb-8 flex flex-wrap justify-center gap-4 border border-red-700 z-20">
        <NavLink title="Home" onClick={() => setCurrentPage('home')} />
        <NavLink title="Universal Laws" onClick={() => setCurrentPage('universalLaws')} />
        <NavLink title="Demonology" onClick={() => setCurrentPage('demonology')} />
        <NavLink title="Chaos Magic" onClick={() => setCurrentPage('chaosMagic')} />
        <NavLink title="Morning Star" onClick={() => setCurrentPage('morningStar')} />
        <NavLink title="The Satanic Temple" onClick={() => setCurrentPage('satanicTemple')} />
        <NavLink title="Rituals" onClick={() => setCurrentPage('rituals')} />
        <NavLink title="Left Hand Path" onClick={() => setCurrentPage('leftHandPath')} />
        <NavLink title="Pixel Art Gallery" onClick={() => setCurrentPage('pixelArtGallery')} /> {/* New NavLink */}
      </nav>

      {/* Render current page content */}
      {renderPage()}

      {/* Footer or additional info */}
      <footer className="mt-12 text-center text-red-500 text-sm z-10 font-['IBM_Plex_Sans']">
        <p>&copy; {new Date().getFullYear()} Esoteric Knowledge. All rights reserved.</p>
      </footer>

      {/* Render the Modal if an entity is selected */}
      <Modal entity={selectedEntity} onClose={handleCloseModal} />
    </div>
  );
};

export default App;
