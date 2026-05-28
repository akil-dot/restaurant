// App.js - Complete with Home Page Content
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
      title: 'Desserts',
      subtitle: 'Sweet finishes for every meal',
      items: [
        { name: 'Cake', image: '/cake.png' },
        { name: 'Donut', image: '/donut.png' },
        { name: 'Falooda', image: '/falloda.png' },
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
        { name: 'Miranda', image: '/Miranda.png' },
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
          <a href="#menu">Menu</a>
          <a className="order-btn" href="#reservation">Reserve Table</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home" aria-label="Home">
        <div className="hero-content">
          <div className="hero-badge">✦ Welcome to Spice Paradise ✦</div>
          
          <div className="floating-text-container">
            <h1 className="hero-title">
              Authentic Indian Cuisine
            </h1>
          </div>
          
          <p className="hero-subtitle">
            Where every spice tells a story of tradition
          </p>
          
          <p className="hero-copy">
            Experience the rich flavors of India through our carefully crafted dishes.
            From aromatic biryanis to comforting idlis, each plate brings you closer
            to the heart of Indian culinary heritage.
          </p>
          
          <div className="hero-actions">
            <a href="#menu" className="hero-button hero-button-primary">
              Explore Our Menu
            </a>
            <a href="#reservation" className="hero-button hero-button-secondary">
              Book a Table
            </a>
          </div>

          <div className="scroll-indicator">
            <div className="scroll-mouse">
              <div className="scroll-wheel"></div>
            </div>
            <span>Scroll Down</span>
          </div>
        </div>

      </section>

      {/* Menu Intro */}
      <section className="menu-section menu-intro" id="menu">
        <div className="menu-header">
          <h2 className="menu-title">Our Menu</h2>
          <p className="menu-subtitle">Discover the flavors that make us special</p>
        </div>
      </section>

      {/* Biryani Section */}
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

      {/* Idli Section */}
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

      {/* Reservation Section */}
      <section className="reservation-section">
        <div className="reservation-container" id="reservation">
          <div className="reservation-header">
            <h2 className="menu-title reservation-title">Reservation</h2>
            <p className="menu-subtitle">Secure your spot for an unforgettable dining experience</p>
          </div>
          <div className="reservation-layout">
            <div className="reservation-aside">
              <h3 className="reservation-book-heading">Book Your Table</h3>
              <p className="reservation-copy">
                Reserve your dining experience with us. We recommend booking at least 24 hours in advance for weekend evenings.
              </p>

              <div className="reservation-socials">
                <p className="reservation-socials-label">Stay connected with us</p>
                <div className="reservation-social-row">
                  <a className="reservation-social-link" href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm10.5 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>
                  </a>
                  <a className="reservation-social-link" href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8.5V7a1 1 0 0 1 1-1h2V3h-3a4 4 0 0 0-4 4v1.5H8V11h2v10h4V11h2.5l.5-2.5H14z"/></svg>
                  </a>
                  <a className="reservation-social-link" href="mailto:hello@spiceparadise.com" aria-label="Email">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm0 2v.3l8 5.2 8-5.2V7H4zm16 10V9.7l-7.4 4.8a1 1 0 0 1-1.1 0L4 9.7V17h16z"/></svg>
                  </a>
                </div>
              </div>

              <div className="reservation-info-cards">
                <div className="reservation-info-card">
                  <span className="reservation-info-icon">☎</span>
                  <div>
                    <h3>Phone</h3>
                    <p>+91 98765 43210</p>
                  </div>
                </div>

                <div className="reservation-info-card">
                  <span className="reservation-info-icon">⌖</span>
                  <div>
                    <h3>Location</h3>
                    <p>123, 5th Street, Gandhipuram, Coimbatore - 641012</p>
                  </div>
                </div>

                <div className="reservation-info-card">
                  <span className="reservation-info-icon">◷</span>
                  <div>
                    <h3>Hours</h3>
                    <p>8:30 AM - 9:00 PM</p>
                    <p>Open All Days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="reservation-card">
              <form className="reservation-form">
                <div className="reservation-field">
                  <label htmlFor="reservation-name">Name</label>
                  <input id="reservation-name" type="text" placeholder="Your full name" />
                </div>

                <div className="reservation-field">
                  <label htmlFor="reservation-email">Email</label>
                  <input id="reservation-email" type="email" placeholder="your@email.com" />
                </div>

                <div className="reservation-field">
                  <label htmlFor="reservation-phone">Phone</label>
                  <input id="reservation-phone" type="tel" placeholder="+91 98765 43210" />
                </div>

                <div className="reservation-field">
                  <label htmlFor="reservation-seats">Guests</label>
                  <input id="reservation-seats" type="number" min="1" placeholder="2 Guests" />
                </div>

                <div className="reservation-field">
                  <label htmlFor="reservation-date">Date</label>
                  <input id="reservation-date" type="date" />
                </div>

                <div className="reservation-field">
                  <label htmlFor="reservation-time">Time</label>
                  <input id="reservation-time" type="time" />
                </div>

                <div className="reservation-field reservation-field-full">
                  <label htmlFor="reservation-requests">Special Requests</label>
                  <textarea id="reservation-requests" rows="4" placeholder="Any special occasions or dietary requirements?"></textarea>
                </div>

                <button type="submit" className="reservation-submit">Reserve Now</button>
              </form>

              <p className="reservation-note">
                Note: our team will call you to confirm your reservation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="bottom-spacer"></div>
    </div>
  );
};

export default App;