-- 1. Limpiar datos previos
TRUNCATE public.comments, public.articles, public.media_items CASCADE;

-- 2. Insertar los 7 Artículos con IDs fijos
INSERT INTO public.articles (id, title, excerpt, content, image_url, category, author, score, platforms, tags)
VALUES 
('a1b2c3d4-0001-4000-a000-000000000001', 'Análisis de Diablo 4: Lord of Hatred - El regreso triunfal de Mephisto', 'Blizzard expande el mundo de Santuario con una historia oscura y adictiva que te mantendrá pegado a la pantalla.', 'Me he pasado la última semana jugando sin descanso a la segunda gran expansión de Diablo IV. Lord of Hatred nos lleva a nuevas profundidades del odio con el regreso de Mephisto. La narrativa es más oscura que nunca y las nuevas zonas son visualmente espectculares. Blizzard ha pulido la jugabilidad para que el bucle de loot sea más satisfactorio que nunca. Es, sin duda, el contenido perfecto para los fans que buscaban un desafío mayor.', '/images/articles/diablo4.png', 'Análisis', 'Alberto Lloria', 9.0, '{PC, PS5, \"Xbox Series X|S\"}', '{Diablo, Blizzard, RPG}'),
('a1b2c3d4-0001-4000-a000-000000000002', 'Análisis de Cthulhu: The Cosmic Abyss - Terror cósmico y deducción futurista', 'Una deconstrucción de La llamada de Cthulhu en un entorno subacuático y futurista que sorprende por sus mecánicas de detective.', 'Lovecraft es, como se suele decir, un caramelito para el videojuego y el cine. Cthulhu: The Cosmic Abyss viene a responder a esa pregunta con una deconstrucción de La llamada de Cthulhu, piedra angular de su legado, decisiones y mucha paranoia en un proyecto cuyo final ya es sabido por todos los fans de Lovecraft.', '/images/articles/cthulhu.png', 'Análisis', 'Alberto Lloria', 7.5, '{PC, PS5, \"Xbox Series X|S\"}', '{Lovecraft, Terror, Investigación}'),
('a1b2c3d4-0001-4000-a000-000000000003', 'Análisis de Tides of Tomorrow - Ciencia ficción y decisiones con impacto real', 'Un juego que explora la responsabilidad de nuestras acciones en un mundo acuático futurista y bellamente diseñado.', 'Tides of Tomorrow nos ofrece una oportunidad única de salvar el mundo o, como en mi caso, explorar las consecuencias de nuestras decisiones más egoístas. En un mundo acuático post-apocalíptico, la interacción con otros jugadores a través de nuestras decisiones marca el ritmo de la partida.', '/images/articles/tides.png', 'Análisis', 'Alberto Lloria', 8.0, '{PC}', '{\"Ciencia Ficción\", Aventura, Indie}'),
('a1b2c3d4-0001-4000-a000-000000000004', 'Análisis de Pokémon Champions - El juego como servicio llega a la saga', 'Un intento ambicioso de llevar Pokémon al formato live-service que brilla en unos aspectos y flaquea en otros.', 'Pokémon Champions intenta algo nuevo: ser un juego como servicio constante. Para expertos y recién llegados, la experiencia varía. Aunque el sistema de combate se mantiene sólido, la estructura de misiones y pases de batalla puede sentirse algo ajena a lo que esperamos.', '/images/articles/pokemon.png', 'Análisis', 'Pokémon Company', 7.0, '{\"Nintendo Switch\"}', '{Pokémon, Competitivo, Nintendo}'),
('a1b2c3d4-0001-4000-a000-000000000005', 'Análisis de Tomodachi Life: Una Vida de Ensueño - La locura vuelve a la isla', 'Una secuela inesperada que mantiene el humor absurdo y la adicción de la entrega original de 3DS.', 'Tomodachi Life: Una Vida de Ensueño me ha demostrado que la simplicidad y el humor absurdo siguen teniendo un hueco enorme. Gestionar una isla llena de Miis con personalidades estrambóticas es tan adictivo como lo fue hace una década.', '/images/articles/tomodachi.png', 'Análisis', '3DJuegos', 8.5, '{\"Nintendo Switch\"}', '{Simulación, Mii, Nintendo}'),
('a1b2c3d4-0001-4000-a000-000000000006', 'Análisis de World of Warcraft: Midnight - El vacío llega a Azeroth', 'Blizzard recupera la esencia de las mejores expansiones con un contenido diseñado para los fans de toda la vida.', 'Hay que aceptar que el World of Warcraft que nos gustaba ya no existe, pero Midnight es lo más cerca que hemos estado de esa gloria. Blizzard ha creado contenido perfecto para los fans, con una narrativa centrada en el Vacío y la protección de Azeroth.', '/images/articles/wow.png', 'Análisis', 'Blizzard', 9.0, '{PC}', '{MMO, Blizzard, Fantasy}'),
('a1b2c3d4-0001-4000-a000-000000000007', 'Análisis de Mouse: PI for Hire - Noir, ratones y mucho estilo', 'Un shooter que destaca por su estética de animación clásica de los años 30 y su jugabilidad inspirada en los clásicos.', 'Mouse: PI for Hire es como un clásico prohibido de Disney con alma de DOOM. Su apartado artístico de los años 30 es espectacular, pero lo más sorprendente es que su jugabilidad no se queda atrás.', '/images/articles/mouse.png', 'Análisis', '3DJuegos', 8.0, '{PC, PS5, \"Xbox Series X|S\"}', '{Shooter, Indie, Noir}');

-- 3. Insertar Comentarios (Relacionados con Diablo 4)
INSERT INTO public.comments (article_id, author_id, author_name, content, created_at)
VALUES 
('a1b2c3d4-0001-4000-a000-000000000001', 'user_001', 'GamerPro99', '¡Increíble análisis! No puedo esperar a jugar la expansión.', NOW() - INTERVAL '2 hours'),
('a1b2c3d4-0001-4000-a000-000000000001', 'user_002', 'Elena_Retro', '¿Creen que Mephisto sea más difícil que Lilith?', NOW() - INTERVAL '1 hour'),
('a1b2c3d4-0001-4000-a000-000000000001', 'user_003', 'Marc_Z', 'Gráficamente se ve espectacular.', NOW());

-- 4. Poblar Biblioteca de Medios
INSERT INTO public.media_items (url, name, type, size, uploaded_by)
VALUES 
('/images/articles/cthulhu.png', 'Cthulhu Banner', 'image', 989250, 'Admin'),
('/images/articles/diablo4.png', 'Diablo 4 Hero', 'image', 948279, 'Admin'),
('/images/articles/tides.png', 'Tides of Tomorrow', 'image', 750000, 'Admin'),
('/images/articles/pokemon.png', 'Pokémon Champions', 'image', 620000, 'Admin'),
('/images/articles/tomodachi.png', 'Tomodachi Life', 'image', 580000, 'Admin'),
('/images/articles/wow.png', 'WoW Midnight', 'image', 1200000, 'Admin'),
('/images/articles/mouse.png', 'Mouse PI for Hire', 'image', 890000, 'Admin');
