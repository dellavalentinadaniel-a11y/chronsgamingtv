-- SQL to insert 7 recent reviews from 3DJuegos
INSERT INTO public.articles (title, excerpt, content, image_url, category, author, score, platforms, tags)
VALUES 
(
    'Análisis de Cthulhu: The Cosmic Abyss - Terror cósmico y deducción futurista',
    'Una deconstrucción de La llamada de Cthulhu en un entorno subacuático y futurista que sorprende por sus mecánicas de detective.',
    'Lovecraft es, como se suele decir, un caramelito para el videojuego y el cine. Cthulhu: The Cosmic Abyss viene a responder a esa pregunta con una deconstrucción de La llamada de Cthulhu, piedra angular de su legado, decisiones y mucha paranoia en un proyecto cuyo final ya es sabido por todos los fans de Lovecraft. Interpretamos a Noah, un miembro de la Agencia Ancile, conocedores de cultos y universos alternos. El juego rehúye la acción y se centra en la investigación y el uso de Key, una IA implantada en nuestro cerebro que nos sirve como apoyo y almacén de pistas.',
    '/images/articles/cthulhu.png',
    'Análisis',
    'Alberto Lloria',
    7.5,
    ARRAY['PC', 'PS5', 'Xbox Series X|S'],
    ARRAY['Lovecraft', 'Terror', 'Investigación']
),
(
    'Análisis de Diablo 4: Lord of Hatred - El regreso triunfal de Mephisto',
    'Blizzard expande el mundo de Santuario con una historia oscura y adictiva que te mantendrá pegado a la pantalla.',
    'Me he pasado la última semana jugando sin descanso a la segunda gran expansión de Diablo IV. Lord of Hatred nos lleva a nuevas profundidades del odio con el regreso de Mephisto. La narrativa es más oscura que nunca y las nuevas zonas son visualmente espectaculares. Blizzard ha pulido la jugabilidad para que el bucle de loot sea más satisfactorio que nunca. Es, sin duda, el contenido perfecto para los fans que buscaban un desafío mayor.',
    '/images/articles/diablo4.png',
    'Análisis',
    'Alberto Lloria',
    9.0,
    ARRAY['PC', 'PS5', 'Xbox Series X|S'],
    ARRAY['Diablo', 'Blizzard', 'RPG']
),
(
    'Análisis de Tides of Tomorrow - Ciencia ficción y decisiones con impacto real',
    'Un juego que explora la responsabilidad de nuestras acciones en un mundo acuático futurista y bellamente diseñado.',
    'Tides of Tomorrow nos ofrece una oportunidad única de salvar el mundo o, como en mi caso, explorar las consecuencias de nuestras decisiones más egoístas. En un mundo acuático post-apocalíptico, la interacción con otros jugadores a través de nuestras decisiones marca el ritmo de la partida. Es una propuesta valiente que refresca el género de las aventuras narrativas.',
    '/images/articles/tides.png',
    'Análisis',
    'Alberto Lloria',
    8.0,
    ARRAY['PC'],
    ARRAY['Ciencia Ficción', 'Aventura', 'Indie']
),
(
    'Análisis de Pokémon Champions - El juego como servicio llega a la saga',
    'Un intento ambicioso de llevar Pokémon al formato live-service que brilla en unos aspectos y flaquea en otros.',
    'Pokémon Champions intenta algo nuevo: ser un juego como servicio constante. Para expertos y recién llegados, la experiencia varía. Aunque el sistema de combate se mantiene sólido, la estructura de misiones y pases de batalla puede sentirse algo ajena a lo que esperamos de un título principal de Pokémon. Es un experimento interesante que determinará el futuro de la franquicia en el ámbito competitivo.',
    '/images/articles/pokemon.png',
    'Análisis',
    'Pokémon Company',
    7.0,
    ARRAY['Nintendo Switch'],
    ARRAY['Pokémon', 'Competitivo', 'Nintendo']
),
(
    'Análisis de Tomodachi Life: Una Vida de Ensueño - La locura vuelve a la isla',
    'Una secuela inesperada que mantiene el humor absurdo y la adicción de la entrega original de 3DS.',
    'Pensaba que la review más difícil de 2026 sería la de GTA 6, pero Tomodachi Life: Una Vida de Ensueño me ha demostrado que la simplicidad y el humor absurdo siguen teniendo un hueco enorme. Gestionar una isla llena de Miis con personalidades estrambóticas es tan adictivo como lo fue hace una década. Una vida de ensueño expande las posibilidades de interacción y personalización, convirtiéndose en el refugio perfecto para desconectar.',
    '/images/articles/tomodachi.png',
    'Análisis',
    '3DJuegos',
    8.5,
    ARRAY['Nintendo Switch'],
    ARRAY['Simulación', 'Mii', 'Nintendo']
),
(
    'Análisis de World of Warcraft: Midnight - El vacío llega a Azeroth',
    'Blizzard recupera la esencia de las mejores expansiones con un contenido diseñado para los fans de toda la vida.',
    'Hay que aceptar que el World of Warcraft que nos gustaba ya no existe, pero Midnight es lo más cerca que hemos estado de esa gloria. Blizzard ha creado contenido perfecto para los fans, con una narrativa centrada en el Vacío y la protección de Azeroth. Las nuevas zonas y sistemas de juego demuestran que WoW todavía tiene mucha vida y capacidad de sorpresa.',
    '/images/articles/wow.png',
    'Análisis',
    'Blizzard',
    9.0,
    ARRAY['PC'],
    ARRAY['MMO', 'Blizzard', 'Fantasy']
),
(
    'Análisis de Mouse: PI for Hire - Noir, ratones y mucho estilo',
    'Un shooter que destaca por su estética de animación clásica de los años 30 y su jugabilidad inspirada en los clásicos.',
    'Mouse: PI for Hire es como un clásico prohibido de Disney con alma de DOOM. Su apartado artístico de los años 30 es espectacular, pero lo más sorprendente es que su jugabilidad no se queda atrás. Como detective ratón en una ciudad noir, el tiroteo se siente ágil y satisfactorio. Es uno de los indies con más personalidad de los últimos tiempos.',
    '/images/articles/mouse.png',
    'Análisis',
    '3DJuegos',
    8.0,
    ARRAY['PC', 'PS5', 'Xbox Series X|S'],
    ARRAY['Shooter', 'Indie', 'Noir']
);
