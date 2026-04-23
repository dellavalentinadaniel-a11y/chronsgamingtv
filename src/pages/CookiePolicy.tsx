import React from 'react';

export function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-orange-500">Política de Cookies</h1>
      <div className="prose prose-invert prose-orange max-w-none">
        <p className="text-zinc-400 mb-8">Última actualización: Abril 2026</p>
        
        <h2 className="text-xl font-bold text-white mt-8 mb-4">1. ¿Qué son las cookies?</h2>
        <p className="text-zinc-300 mb-4">Las cookies son pequeños archivos de texto que los sitios web almacenan en su dispositivo (ordenador, tablet, smartphone) cuando los visita. Se utilizan ampliamente para que los sitios web funcionen, o funcionen de manera más eficiente, así como para proporcionar información a los propietarios del sitio.</p>
        
        <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Cómo usamos las cookies</h2>
        <p className="text-zinc-300 mb-4">Utilizamos cookies para entender cómo interactúa con nuestro sitio web, recordar sus preferencias (como el modo oscuro o su sesión de usuario) y mejorar su experiencia general de navegación.</p>
        
        <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Tipos de cookies que utilizamos</h2>
        <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-2">
          <li><strong>Cookies estrictamente necesarias:</strong> Son esenciales para que el sitio web funcione correctamente. Incluyen, por ejemplo, cookies que le permiten iniciar sesión en áreas seguras de nuestro sitio web.</li>
          <li><strong>Cookies de rendimiento:</strong> Nos ayudan a entender cómo los visitantes interactúan con el sitio web al recopilar y reportar información de forma anónima.</li>
          <li><strong>Cookies de funcionalidad:</strong> Permiten que el sitio web recuerde las elecciones que hace (como su nombre de usuario o idioma) y proporcionan características mejoradas y más personales.</li>
        </ul>
        
        <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Control de cookies</h2>
        <p className="text-zinc-300 mb-4">Puede controlar y/o eliminar las cookies según lo desee. Puede eliminar todas las cookies que ya están en su computadora y puede configurar la mayoría de los navegadores para evitar que se coloquen. Sin embargo, si hace esto, es posible que tenga que ajustar manualmente algunas preferencias cada vez que visite un sitio y que algunos servicios y funcionalidades no funcionen.</p>
      </div>
    </div>
  );
}
