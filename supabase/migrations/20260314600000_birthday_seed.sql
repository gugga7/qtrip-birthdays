-- Birthday niche: Casablanca & Marrakech destinations, activities, accommodations, transports

-- ═══════════════════════════════════════════════
-- DESTINATIONS
-- ═══════════════════════════════════════════════

-- Casablanca
INSERT INTO destinations (id, name, country, description, hero_image_url, currency, language, best_time_to_visit, highlights, local_tips, health_and_safety, travel_requirements, niche_id, is_active)
VALUES (
  'casablanca', 'Casablanca', 'Morocco',
  'Morocco''s cosmopolitan gem — upscale ocean-front dining at Cabestan, the awe-inspiring Hassan II Mosque, buzzing Corniche nightlife, and an Art Deco old town that sets the stage for unforgettable birthday celebrations.',
  'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=800',
  'EUR', 'French/Arabic',
  ARRAY['Mar-Jun', 'Sep-Nov'],
  ARRAY['Cabestan', 'Hassan II Mosque', 'Corniche', 'Art Deco District'],
  ARRAY['Taxis are cheap — use Careem or petit taxis with the meter on', 'Friday is mosque day — Hassan II interior visits are limited', 'The Corniche strip comes alive after 10pm on weekends'],
  ARRAY['Tap water is not recommended — drink bottled', 'Pharmacies are plentiful and well-stocked'],
  ARRAY['Passport valid 6+ months', 'No visa required for EU/US citizens (90 days)'],
  'birthday', true
) ON CONFLICT (id) DO NOTHING;

-- Marrakech (birthday niche)
INSERT INTO destinations (id, name, country, description, hero_image_url, currency, language, best_time_to_visit, highlights, local_tips, health_and_safety, travel_requirements, niche_id, is_active)
VALUES (
  'marrakech', 'Marrakech', 'Morocco',
  'The Red City turns birthdays into legends — candlelit riad dinners, rooftop parties above the Medina, sunrise balloon flights over the Atlas Mountains, and vibrant souks full of treasures to take home.',
  'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800',
  'EUR', 'French/Arabic',
  ARRAY['Mar-May', 'Sep-Nov'],
  ARRAY['Jemaa el-Fna', 'Majorelle Garden', 'La Mamounia', 'Medina Rooftops'],
  ARRAY['Book rooftop restaurants early — they fill up fast at sunset', 'Riads in the Medina are more atmospheric than hotels in Guéliz', 'Negotiate in the souks — start at 40% of the asking price'],
  ARRAY['Tap water is not recommended — drink bottled', 'Pharmacies are plentiful and well-stocked'],
  ARRAY['Passport valid 6+ months', 'No visa required for EU/US citizens (90 days)'],
  'birthday', true
) ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- CASABLANCA ACTIVITIES
-- ═══════════════════════════════════════════════

INSERT INTO activities (id, destination_id, title, description, duration, price, category, location, tags, main_image_url, is_active) VALUES
-- Fine Dining
('casa-cabestan', 'casablanca', 'Cabestan Ocean Terrace Dinner', 'Celebrate your birthday with a spectacular multi-course dinner at Cabestan, perched above the crashing Atlantic waves. Fresh seafood, French-Moroccan fusion, and panoramic ocean views.', 3, 85, 'Fine Dining', 'Corniche', ARRAY['fine-dining', 'ocean-view', 'birthday', 'evening'], 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', true),
('casa-dar-dada', 'casablanca', 'Dar Dada Intimate Birthday Dinner', 'An intimate birthday feast in a beautifully restored Casablanca townhouse. Seasonal tasting menu with wine pairings and candlelight ambiance.', 2.5, 70, 'Fine Dining', 'Old Medina', ARRAY['fine-dining', 'intimate', 'birthday', 'evening'], 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400', true),
('casa-sqala-brunch', 'casablanca', 'La Sqala Birthday Brunch', 'Garden brunch inside a restored 18th-century bastion. Moroccan pastries, fresh juices, eggs to order, and a relaxed birthday morning among bougainvillea.', 2, 45, 'Fine Dining', 'Old Medina', ARRAY['brunch', 'garden', 'birthday', 'morning'], 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', true),
('casa-ricks-cafe', 'casablanca', 'Rick''s Café Birthday Experience', 'Dine at the legendary Rick''s Café, inspired by the classic film. Live piano, Moroccan-French cuisine, and old-world glamour for a cinematic birthday.', 2.5, 55, 'Fine Dining', 'Old Medina', ARRAY['fine-dining', 'iconic', 'birthday', 'evening'], 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', true),
-- Nightlife & Bars
('casa-koya-club', 'casablanca', 'KOYA Club Night', 'VIP entry to Casablanca''s hottest club. International DJs, premium sound system, and a birthday shoutout from the DJ booth.', 5, 60, 'Nightlife & Bars', 'Corniche', ARRAY['nightlife', 'club', 'birthday', 'evening'], 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=400', true),
('casa-marion-rooftop', 'casablanca', 'Marion Rooftop Cocktails', 'Sunset cocktails at Marion, one of Casablanca''s chicest rooftop bars. Craft cocktails, city-and-ocean views, and a relaxed birthday toast.', 2.5, 40, 'Nightlife & Bars', 'Maarif', ARRAY['cocktails', 'rooftop', 'birthday', 'evening'], 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400', true),
('casa-corniche-crawl', 'casablanca', 'Corniche Bar Crawl', 'Hit three of the Corniche''s best bars in one evening — welcome shots at each stop, a birthday sash, and a dedicated guide to keep the party moving.', 4, 35, 'Nightlife & Bars', 'Corniche', ARRAY['bar-crawl', 'nightlife', 'birthday', 'evening'], 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', true),
('casa-vip-table', 'casablanca', 'Birthday VIP Table Package', 'Reserved VIP area at a top Corniche club with premium bottle service, sparklers, a birthday cake, and dedicated host for the night.', 5, 120, 'Nightlife & Bars', 'Corniche', ARRAY['vip', 'nightlife', 'birthday', 'evening', 'premium'], 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', true),
-- Culture & Sightseeing
('casa-hassan-ii', 'casablanca', 'Hassan II Mosque Guided Tour', 'Marvel at the world''s third-largest mosque, built over the Atlantic Ocean. Expert English/French guide reveals the artistry of its 10,000 artisans.', 2, 20, 'Culture & Sightseeing', 'Boulevard de la Corniche', ARRAY['culture', 'mosque', 'sightseeing', 'morning'], 'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400', true),
('casa-art-deco', 'casablanca', 'Art Deco Walking Tour', 'Stroll through Casablanca''s stunning 1930s Art Deco quarter with an architecture expert. Discover hidden facades, lobbies, and rooftop panoramas.', 2.5, 25, 'Culture & Sightseeing', 'Downtown', ARRAY['culture', 'architecture', 'walking', 'morning'], 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400', true),
('casa-morocco-mall', 'casablanca', 'Morocco Mall & Shopping', 'Retail therapy at Africa''s largest mall — designer boutiques, a giant aquarium, an ice rink, and plenty of birthday gift shopping.', 3, 15, 'Culture & Sightseeing', 'Corniche', ARRAY['shopping', 'mall', 'leisure', 'afternoon'], 'https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=400', true),
-- Wellness & Spa
('casa-royal-hammam', 'casablanca', 'Royal Hammam beneath Hassan II', 'The ultimate Moroccan spa experience — a traditional hammam located in the vaults beneath the Hassan II Mosque. Black soap scrub, rhassoul clay, and argan oil massage.', 2.5, 65, 'Wellness & Spa', 'Hassan II complex', ARRAY['spa', 'hammam', 'wellness', 'afternoon'], 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400', true),
('casa-spa-day', 'casablanca', 'Birthday Spa Day', 'A full day of pampering at a luxury Casablanca spa. Facial, massage, manicure, and mint tea by the relaxation pool — the perfect birthday treat.', 4, 55, 'Wellness & Spa', 'Anfa', ARRAY['spa', 'wellness', 'birthday', 'afternoon'], 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=400', true),
-- Group Experiences
('casa-private-chef', 'casablanca', 'Private Chef Dinner Party', 'A personal chef takes over your accommodation to prepare a multi-course birthday feast. Menu tailored to your tastes, with wine pairing and cake.', 3.5, 75, 'Group Experiences', 'Your accommodation', ARRAY['private-chef', 'dinner', 'birthday', 'evening'], 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400', true),
('casa-catamaran', 'casablanca', 'Sunset Catamaran Cruise', 'Toast the birthday on a private catamaran cruise along the Casablanca coast. Champagne, canapés, music, and an Atlantic sunset.', 3, 70, 'Group Experiences', 'Marina', ARRAY['boat', 'sunset', 'birthday', 'evening'], 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400', true)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- MARRAKECH BIRTHDAY ACTIVITIES
-- ═══════════════════════════════════════════════

INSERT INTO activities (id, destination_id, title, description, duration, price, category, location, tags, main_image_url, is_active) VALUES
-- Fine Dining
('mkch-rooftop-dinner', 'marrakech', 'Rooftop Birthday Dinner', 'A magical rooftop dinner above the Medina with views of the Koutoubia minaret. Multi-course Moroccan-French menu, candles, and a birthday cake under the stars.', 3, 80, 'Fine Dining', 'Medina', ARRAY['fine-dining', 'rooftop', 'birthday', 'evening'], 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', true),
('mkch-mamounia', 'marrakech', 'La Mamounia Grand Birthday Dinner', 'An unforgettable evening at the legendary La Mamounia palace hotel. Seven-course tasting menu in the grand restaurant with live oud music.', 3.5, 95, 'Fine Dining', 'Hivernage', ARRAY['fine-dining', 'luxury', 'birthday', 'evening'], 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400', true),
('mkch-nomad', 'marrakech', 'Nomad Restaurant Birthday Lunch', 'Modern Moroccan cuisine at the iconic Nomad, overlooking the spice market. Birthday set menu with local wines and a surprise dessert.', 2.5, 50, 'Fine Dining', 'Medina', ARRAY['fine-dining', 'modern', 'birthday', 'afternoon'], 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', true),
-- Culture & Sightseeing
('mkch-medina-tour', 'marrakech', 'Private Medina Birthday Tour', 'A private guide leads your group through the labyrinthine Medina — hidden palaces, spice souks, and artisan workshops, with a birthday tea ceremony stop.', 3, 35, 'Culture & Sightseeing', 'Medina', ARRAY['culture', 'guided-tour', 'birthday', 'morning'], 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400', true),
('mkch-majorelle', 'marrakech', 'Majorelle Garden & YSL Museum', 'Wander the cobalt-blue Majorelle Garden and the adjacent Yves Saint Laurent Museum. Two iconic cultural landmarks in one serene birthday morning.', 2.5, 40, 'Culture & Sightseeing', 'Guéliz', ARRAY['culture', 'garden', 'museum', 'morning'], 'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400', true),
('mkch-cooking', 'marrakech', 'Moroccan Birthday Cooking Class', 'Learn to make tagine, couscous, and Moroccan pastries in a beautiful riad kitchen. A hands-on birthday activity ending with a feast of your own creation.', 3.5, 50, 'Food & Drink', 'Medina', ARRAY['cooking', 'food', 'birthday', 'afternoon'], 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400', true),
-- Nightlife & Bars
('mkch-rooftop-party', 'marrakech', 'Rooftop Cocktail Birthday Party', 'Private rooftop terrace party with a dedicated bartender, curated playlist, lanterns, and skyline views. Craft cocktails and birthday cake included.', 4, 55, 'Nightlife & Bars', 'Medina', ARRAY['cocktails', 'rooftop', 'birthday', 'evening'], 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400', true),
('mkch-club-package', 'marrakech', 'Club Birthday Package', 'VIP entry to Marrakech''s top nightclub with reserved booth, bottle service, a birthday cake, and sparkler parade. The full birthday club experience.', 5, 70, 'Nightlife & Bars', 'Hivernage', ARRAY['nightlife', 'club', 'birthday', 'evening', 'vip'], 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=400', true),
('mkch-jazz', 'marrakech', 'Jazz Bar Birthday Evening', 'An intimate evening at a Marrakech jazz bar. Live jazz trio, whisky flights, and a mellow birthday vibe away from the Medina bustle.', 3, 35, 'Nightlife & Bars', 'Guéliz', ARRAY['jazz', 'bar', 'birthday', 'evening'], 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400', true),
-- Wellness & Spa
('mkch-hammam', 'marrakech', 'Luxury Hammam Birthday Ritual', 'A premium hammam experience with black soap scrub, rhassoul clay, argan oil massage, and rose-petal bath. Mint tea and Moroccan pastries to finish.', 2.5, 65, 'Wellness & Spa', 'Medina', ARRAY['spa', 'hammam', 'birthday', 'afternoon'], 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400', true),
('mkch-pool-party', 'marrakech', 'Private Pool Party', 'Exclusive use of a luxury villa pool with DJ, birthday decorations, BBQ lunch, and unlimited soft drinks. The ultimate Marrakech birthday pool day.', 5, 80, 'Wellness & Spa', 'Palmeraie', ARRAY['pool', 'party', 'birthday', 'afternoon'], 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400', true),
-- Group Experiences
('mkch-balloon', 'marrakech', 'Hot Air Balloon Sunrise', 'Rise above the Atlas foothills at dawn in a private hot air balloon. Champagne toast, panoramic photos, and a traditional Berber breakfast on landing.', 4, 150, 'Group Experiences', 'Atlas foothills', ARRAY['balloon', 'sunrise', 'birthday', 'morning', 'premium'], 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=400', true),
('mkch-camel-sunset', 'marrakech', 'Camel Sunset & Birthday Dinner', 'Camel trek through the Palmeraie at golden hour followed by a candlelit Berber dinner in the desert with live music and a birthday cake.', 4, 65, 'Group Experiences', 'Palmeraie', ARRAY['camel', 'sunset', 'dinner', 'birthday', 'evening'], 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400', true),
('mkch-henna', 'marrakech', 'Henna & Tea Ceremony', 'A traditional henna artist decorates your group with intricate designs while you sip mint tea and nibble Moroccan sweets in a riad courtyard.', 2, 30, 'Group Experiences', 'Medina', ARRAY['henna', 'tea', 'culture', 'birthday', 'afternoon'], 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400', true)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- CASABLANCA ACCOMMODATIONS
-- ═══════════════════════════════════════════════

INSERT INTO accommodations (id, destination_id, name, type, description, location, price_per_night, rating, amenities, main_image_url, is_active) VALUES
('casa-hotel-3', 'casablanca', 'Hotel Casablanca 3*', 'Hotel', 'Comfortable city-centre hotel near the Corniche. Clean rooms with A/C, breakfast buffet, and easy access to nightlife.', 'Maarif', 60, 3, ARRAY['wifi', 'breakfast-included', 'air-conditioning', 'bar'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', true),
('casa-hotel-4', 'casablanca', 'Hotel Casablanca 4*', 'Hotel', 'Upscale hotel with rooftop pool, restaurant, and spa. Walking distance to the Art Deco district and Rick''s Café.', 'Downtown', 95, 4, ARRAY['wifi', 'pool', 'spa', 'restaurant', 'bar', 'gym', 'air-conditioning'], 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400', true),
('casa-hotel-5', 'casablanca', 'Hotel Casablanca 5*', 'Hotel', 'Landmark five-star hotel with ocean views, multiple restaurants, a world-class spa, and concierge service for birthday planning.', 'Corniche', 180, 5, ARRAY['wifi', 'pool', 'spa', 'restaurant', 'bar', 'gym', 'concierge', 'ocean-view'], 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400', true),
('casa-boutique', 'casablanca', 'Boutique Art Deco Hotel', 'Boutique', 'Charming boutique hotel in a restored Art Deco building. Individually designed rooms, courtyard café, and personal service.', 'Downtown', 110, 4, ARRAY['wifi', 'breakfast-included', 'courtyard', 'air-conditioning', 'concierge'], 'https://images.unsplash.com/photo-1548018560-c7196548e84d?w=400', true),
('casa-penthouse', 'casablanca', 'Penthouse Apartment', 'Apartment', 'Luxury penthouse with wraparound terrace, full kitchen, and skyline views. Perfect for pre-party gatherings and birthday brunches.', 'Anfa', 150, 5, ARRAY['wifi', 'kitchen', 'terrace', 'air-conditioning', 'city-view', 'parking'], 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400', true),
('casa-ocean-suite', 'casablanca', 'Ocean-View Suite', 'Suite', 'Spacious seafront suite with floor-to-ceiling windows, separate lounge, and direct beach access. Wake up to Atlantic waves on your birthday.', 'Corniche', 200, 5, ARRAY['wifi', 'ocean-view', 'room-service', 'minibar', 'air-conditioning', 'beach-access'], 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400', true)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- MARRAKECH BIRTHDAY ACCOMMODATIONS
-- ═══════════════════════════════════════════════

INSERT INTO accommodations (id, destination_id, name, type, description, location, price_per_night, rating, amenities, main_image_url, is_active) VALUES
('mkch-hotel-3', 'marrakech', 'Hotel Marrakech 3*', 'Hotel', 'Friendly mid-range hotel in Guéliz with pool, restaurant, and easy access to both the Medina and modern Marrakech.', 'Guéliz', 55, 3, ARRAY['wifi', 'pool', 'restaurant', 'air-conditioning'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', true),
('mkch-hotel-4', 'marrakech', 'Hotel Marrakech 4*', 'Hotel', 'Premium hotel with Atlas Mountain views, rooftop terrace, spa, and a concierge who can arrange birthday surprises.', 'Hivernage', 90, 4, ARRAY['wifi', 'pool', 'spa', 'restaurant', 'bar', 'gym', 'rooftop'], 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400', true),
('mkch-riad', 'marrakech', 'Traditional Birthday Riad', 'Riad', 'Authentic Medina riad with courtyard fountain, rooftop terrace, and a host who will decorate for your birthday. Breakfast included.', 'Medina', 75, 4, ARRAY['wifi', 'rooftop-terrace', 'courtyard', 'breakfast-included', 'birthday-decorations'], 'https://images.unsplash.com/photo-1548018560-c7196548e84d?w=400', true),
('mkch-riad-lux', 'marrakech', 'Luxury Riad', 'Riad', 'Boutique luxury riad with plunge pool, private hammam, and personalized concierge. Instagram-worthy interiors and birthday packages available.', 'Medina', 120, 5, ARRAY['plunge-pool', 'hammam', 'concierge', 'wifi', 'breakfast-included', 'rooftop'], 'https://images.unsplash.com/photo-1548018560-c7196548e84d?w=400', true),
('mkch-hotel-5', 'marrakech', 'Palace Hotel 5*', 'Hotel', 'Five-star palace hotel with sprawling gardens, multiple pools, a world-class spa, and a dedicated events team for birthday celebrations.', 'Hivernage', 180, 5, ARRAY['wifi', 'pool', 'spa', 'restaurant', 'bar', 'gym', 'concierge', 'gardens'], 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400', true),
('mkch-villa', 'marrakech', 'Private Villa with Pool', 'Villa', 'Luxury private villa with heated pool, lush garden, BBQ area, and dedicated staff. Ideal for birthday pool parties and group stays.', 'Palmeraie', 160, 5, ARRAY['private-pool', 'garden', 'bbq', 'staff', 'wifi', 'parking', 'air-conditioning'], 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400', true)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- CASABLANCA TRANSPORTS
-- ═══════════════════════════════════════════════

INSERT INTO transports (id, destination_id, name, type, provider, price, duration, description, features, pricing_unit, main_image_url, is_active) VALUES
('casa-airport', 'casablanca', 'Airport Transfer', 'shuttle', 'Casablanca Transfers', 15, '30 min', 'Comfortable minivan airport transfer from Mohammed V International. Driver meets you at arrivals with a name sign.', ARRAY['airport-pickup', 'name-sign', 'air-conditioning'], 'per_person', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400', true),
('casa-luxury-car', 'casablanca', 'Luxury Mercedes Transfer', 'luxury_car', 'Casa VIP Transfers', 90, '35 min', 'Private Mercedes E-Class transfer with meet & greet, chilled champagne, and door-to-door service. Start your birthday in style.', ARRAY['luxury', 'meet-and-greet', 'champagne', 'air-conditioning'], 'per_trip', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400', true)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- MARRAKECH BIRTHDAY TRANSPORTS
-- ═══════════════════════════════════════════════

INSERT INTO transports (id, destination_id, name, type, provider, price, duration, description, features, pricing_unit, main_image_url, is_active) VALUES
('mkch-airport', 'marrakech', 'Airport Transfer', 'shuttle', 'Marrakech Transfers', 12, '25 min', 'Comfortable minivan transfer from Marrakech Menara Airport. Driver meets you at arrivals with a name sign.', ARRAY['airport-pickup', 'name-sign', 'air-conditioning'], 'per_person', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400', true),
('mkch-luxury-car', 'marrakech', 'Luxury Range Rover Transfer', 'luxury_car', 'Marrakech VIP Transfers', 85, '30 min', 'Private Range Rover transfer with meet & greet, chilled water, and a smooth ride straight to your riad or hotel.', ARRAY['luxury', 'meet-and-greet', 'air-conditioning', 'water'], 'per_trip', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400', true)
ON CONFLICT (id) DO NOTHING;
