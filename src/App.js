// App.js - Complete Updated with Subtle Center Highlight
import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [biryaniRevealed, setBiryaniRevealed] = useState(false);
  const [idliRevealed, setIdliRevealed] = useState(false);
  const biryaniSectionRef = useRef(null);
  const idliSectionRef = useRef(null);
  const scrollFrameRef = useRef(null);
  const [carouselOffsets, setCarouselOffsets] = useState({ dishes: 0, desserts: 0, 'cool-drinks': 0 });
  const animationRefs = useRef({});

  const particles = useMemo(() => {
    const particleImages = [
      '/briyani.jpg', '/cake.png', '/campa.png', '/chapati.png',
      '/Chicken%2065.png', '/coca%20cola.png', '/donut.png', '/dosa.png',
      '/falooda.jpg', '/fanta.png', '/fried%20rice.png', '/ice%20cream(cone).png',
      '/ice%20cream(cup).png', '/idli.jpg', '/lassi.png', '/meals.png',
      '/noodles.png', '/pepsi.png', '/poori.png', '/porotta.png', '/sprite.png',
    ];

    return [...particleImages]
      .sort(() => Math.random() - 0.5)
      .map((imageSrc, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 6}s`,
        animationDuration: `${8 + Math.random() * 4}s`,
        size: `${0.9 + Math.random() * 1.2}rem`,
        imageSrc,
      }));
  }, []);

  const menuSections = useMemo(() => ([
    {
      id: 'dishes',
      title: 'Dishes',
      subtitle: 'Savory plates and comfort food favorites',
      items: [
        { name: 'Briyani', image: '/briyani.jpg' },
        { name: 'Chicken 65', image: '/Chicken%2065.png' },
        { name: 'Chapati', image: '/chapati.png' },
        { name: 'Dosa', image: '/dosa.png' },
        { name: 'Idli', image: '/idli.jpg' },
        { name: 'Meals', image: '/meals.png' },
        { name: 'Noodles', image: '/noodles.png' },
        { name: 'Poori', image: '/poori.png' },
        { name: 'Porotta', image: '/porotta.png' },
        { name: 'Fried Rice', image: '/fried%20rice.png' },
      ],
    },
    {
      id: 'desserts',
      title: 'Deserts',
      subtitle: 'Sweet finishes for every meal',
      items: [
        { name: 'Cake', image: '/cake.png' },
        { name: 'Donut', image: '/donut.png' },
        { name: 'Falooda', image: '/falooda.jpg' },
        { name: 'Ice Cream (Cone)', image: '/ice%20cream(cone).png' },
        { name: 'Ice Cream (Cup)', image: '/ice%20cream(cup).png' },
      ],
    },
    {
      id: 'cool-drinks',
      title: 'Cool Drinks',
      subtitle: 'Chilled drinks to pair with every plate',
      items: [
        { name: 'Campa', image: '/campa.png' },
        { name: 'Coca Cola', image: '/coca%20cola.png' },
        { name: 'Fanta', image: '/fanta.png' },
        { name: 'Lassi', image: '/lassi.png' },
        { name: 'Pepsi', image: '/pepsi.png' },
        { name: 'Sprite', image: '/sprite.png' },
      ],
    },
  ]), []);

  const toSentenceCase = (value) => {
    const lowerValue = value.toLowerCase();
    return lowerValue.charAt(0).toUpperCase() + lowerValue.slice(1);
  };

  useEffect(() => {
    const updateScrollState = () => {
      const nextIsScrolled = window.scrollY > 50;
      setIsScrolled((prev) => (prev === nextIsScrolled ? prev : nextIsScrolled));
    };

    const handleScrollForNav = () => {
      if (scrollFrameRef.current !== null) return;
      scrollFrameRef.current = window.requestAnimationFrame(() => {
        scrollFrameRef.current = null;
        updateScrollState();
      });
    };

    let observer = null;
    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (entry.target === biryaniSectionRef.current) {
          setBiryaniRevealed(true);
          observer?.unobserve(entry.target);
        }
        if (entry.target === idliSectionRef.current) {
          setIdliRevealed(true);
          observer?.unobserve(entry.target);
        }
      });
    };

    let fallbackCheck = null;

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(handleIntersect, { threshold: 0.3 });
      if (biryaniSectionRef.current) observer.observe(biryaniSectionRef.current);
      if (idliSectionRef.current) observer.observe(idliSectionRef.current);
    } else {
      fallbackCheck = () => {
        if (biryaniSectionRef.current && !biryaniRevealed) {
          const rect = biryaniSectionRef.current.getBoundingClientRect();
          if (rect.top < window.innerHeight) setBiryaniRevealed(true);
        }
        if (idliSectionRef.current && !idliRevealed) {
          const rect = idliSectionRef.current.getBoundingClientRect();
          if (rect.top < window.innerHeight) setIdliRevealed(true);
        }
      };
      window.addEventListener('scroll', fallbackCheck, { passive: true });
      fallbackCheck();
    }

    window.addEventListener('scroll', handleScrollForNav, { passive: true });
    updateScrollState();

    return () => {
      window.removeEventListener('scroll', handleScrollForNav);
      if (observer) observer.disconnect();
      if (fallbackCheck) window.removeEventListener('scroll', fallbackCheck);
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = null;
      }
    };
  }, [biryaniRevealed, idliRevealed]);

  // Ultra-smooth continuous carousel animation
  useEffect(() => {
    const ids = ['dishes', 'desserts', 'cool-drinks'];
    const itemWidth = 20;
    const speed = 0.04;

    const animate = () => {
      setCarouselOffsets((prev) => {
        const newOffsets = { ...prev };
        ids.forEach((id) => {
          const section = menuSections.find((s) => s.id === id);
          if (!section) return;
          const maxOffset = section.items.length * itemWidth;
          newOffsets[id] = (prev[id] + speed) % maxOffset;
        });
        return newOffsets;
      });
      animationRefs.current.main = requestAnimationFrame(animate);
    };

    animationRefs.current.main = requestAnimationFrame(animate);

    return () => {
      if (animationRefs.current.main) {
        cancelAnimationFrame(animationRefs.current.main);
      }
    };
  }, [menuSections]);

  const getVisibleItems = (section) => {
    const offset = carouselOffsets[section.id] || 0;
    const itemWidth = 20;
    const items = section.items;
    const len = items.length;
    
    const result = [];
    for (let slot = 0; slot < 7; slot++) {
      const globalPosition = (offset / itemWidth) + slot - 1;
      const itemIndex = Math.floor(globalPosition);
      const normalizedIndex = ((itemIndex % len) + len) % len;
      
      result.push({
        ...items[normalizedIndex],
        slot,
        isCenter: slot === 2,
        key: `${section.id}-${normalizedIndex}-${slot}`,
      });
    }
    
    return result;
  };

  return (
    <div className="app">
      <div className="food-background"></div>
      
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <span className="logo-icon">🍽️</span>
          <span className="logo-text">Spice Paradise</span>
        </div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#biryani">Biryani</a>
          <a href="#idli">Idli</a>
          <a href="#menu">Menu</a>
          <button className="order-btn">Reserve Table</button>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-content">
          <div className="floating-text-container">
            <h1 className="hero-title">
              <span className="title-word word-1">Experience</span>
              <span className="title-word word-2">Authentic</span>
              <span className="title-word word-3">Indian</span>
              <span className="title-word word-4">Cuisine</span>
            </h1>
            <p className="hero-subtitle">Where every spice tells a story of tradition</p>
          </div>
          
          <div className="scroll-indicator">
            <div className="scroll-mouse">
              <div className="scroll-wheel"></div>
            </div>
            <span>Scroll Down</span>
          </div>
        </div>

        <div className="particles-container">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: particle.left,
                animationDelay: particle.animationDelay,
                animationDuration: particle.animationDuration,
                width: particle.size,
                height: particle.size,
              }}
            >
              <img src={particle.imageSrc} alt="" aria-hidden="true" className="particle-image" />
            </div>
          ))}
        </div>
      </section>

      <section className="menu-section menu-intro" id="menu">
        <div className="menu-header">
          <h2 className="menu-title">Menu</h2>
        </div>
        
      </section>

      <section className="food-section biryani-section" id="biryani" ref={biryaniSectionRef}>
        <div className="section-container">
          <div className={`food-image-side ${biryaniRevealed ? 'revealed' : ''}`}>
            <div className="food-image-mask biryani-mask">
              <img src="/briyani.jpg" alt="Chicken Biryani" className="food-object" />
            </div>
            <div className="image-glow biryani-glow"></div>
          </div>

          <div className={`food-content-side ${biryaniRevealed ? 'revealed' : ''}`}>
            <div className="content-mask">
              <span className="food-tag">🔥 Signature Dish</span>
              <h2 className="food-title">
                <span className="title-main">Royal Chicken</span>
                <span className="title-highlight">Biryani</span>
              </h2>
              <div className="food-description-full">
                <p>Biryani is a fragrant Indian classic where long-grain basmati rice meets tender chicken and aromatic spices in every bite.</p>
                <p>The chicken is marinated overnight with yogurt, ginger-garlic paste, and warm spices, then slow-cooked on dum until perfectly tender.</p>
                <p>Finished with caramelized onions, mint, coriander, and fried onions, it delivers rich flavor and a beautiful presentation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="food-section idli-section" id="idli" ref={idliSectionRef}>
        <div className="section-container reverse">
          <div className={`food-content-side ${idliRevealed ? 'revealed' : ''}`}>
            <div className="content-mask">
              <span className="food-tag idli-tag">🌿 South Indian Classic</span>
              <h2 className="food-title">
                <span className="title-main">Soft Steamed</span>
                <span className="title-highlight idli-highlight">Idli</span>
              </h2>
              <div className="food-description-full">
                <p>Idli is a beloved South Indian breakfast made from fermented rice and urad dal, known for its soft, cloud-like texture.</p>
                <p>After overnight fermentation, the batter turns light and airy before being steamed into its classic shape.</p>
                <p>Served hot with sambar and chutneys, it's a light, comforting meal that still feels complete.</p>
              </div>
            </div>
          </div>

          <div className={`food-image-side ${idliRevealed ? 'revealed' : ''}`}>
            <div className="food-image-mask idli-mask">
              <img src="/idli.jpg" alt="Steamed Idli" className="food-object" />
            </div>
            <div className="image-glow idli-glow"></div>
          </div>
        </div>
      </section>

      {/* Menu Carousels */}
      <section className="menu-section menu-rows-section">
        <div className="menu-grid">
          {menuSections.map((section) => {
            const visibleItems = getVisibleItems(section);
            
            return (
              <article className="menu-category" key={section.id}>
                <div className="menu-category-head">
                  <h3>{toSentenceCase(section.title)}</h3>
                  <p>{toSentenceCase(section.subtitle)}</p>
                </div>

                <div className="menu-carousel">
                  <div className="carousel-track-wrapper">
                    <div className="carousel-track">
                      {visibleItems.map((item) => (
                        <div
                          className={`menu-item-card ${item.isCenter ? 'center' : ''}`}
                          key={item.key}
                        >
                          <div className="menu-item-image-wrap">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="menu-item-image"
                              loading="lazy"
                            />
                          </div>
                          <div className="menu-item-copy">
                            <h4>{toSentenceCase(item.name)}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="bottom-spacer"></div>
    </div>
  );
};

export default App;