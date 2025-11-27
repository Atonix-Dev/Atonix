import { Component } from '@angular/core';

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {
  faqs: FAQ[] = [
    {
      question: '¿Qué es Radio App?',
      answer: 'Radio App es una plataforma gratuita que te permite escuchar miles de estaciones de radio en vivo de todo el mundo. Puedes buscar, filtrar y reproducir estaciones por país, género, idioma y más.',
      isOpen: false
    },
    {
      question: '¿Es gratis usar Radio App?',
      answer: 'Sí, Radio App es completamente gratuita. Puedes acceder a todas las estaciones de radio sin ningún costo. No hay planes premium ni compras dentro de la aplicación.',
      isOpen: false
    },
    {
      question: '¿Necesito crear una cuenta?',
      answer: 'No es obligatorio crear una cuenta para escuchar las estaciones de radio. Sin embargo, al registrarte puedes guardar tus estaciones favoritas, personalizar tu experiencia y sincronizar tus preferencias entre dispositivos.',
      isOpen: false
    },
    {
      question: '¿Cómo busco una estación específica?',
      answer: 'Utiliza la función de búsqueda en la parte superior de la aplicación. Puedes buscar por nombre de la estación, género musical, país o ciudad. También puedes usar los filtros para refinar tu búsqueda.',
      isOpen: false
    },
    {
      question: '¿Por qué algunas estaciones no se reproducen?',
      answer: 'Algunas estaciones pueden estar temporalmente fuera de línea, tener problemas técnicos o estar bloqueadas en tu región. Si una estación no funciona, intenta con otra similar o reporta el problema.',
      isOpen: false
    },
    {
      question: '¿Puedo escuchar Radio App sin conexión?',
      answer: 'No, Radio App transmite contenido en vivo desde Internet, por lo que necesitas una conexión activa para escuchar las estaciones. No ofrecemos descarga de contenido para escucha offline.',
      isOpen: false
    },
    {
      question: '¿Qué hago si olvidé mi contraseña?',
      answer: 'Si olvidaste tu contraseña, actualmente deberás crear una nueva cuenta. Estamos trabajando en implementar una función de recuperación de contraseña en futuras actualizaciones.',
      isOpen: false
    },
    {
      question: '¿Radio App recopila mis datos personales?',
      answer: 'Solo recopilamos los datos mínimos necesarios para proporcionar el servicio. Lee nuestra Política de Privacidad para más detalles. Tus datos se almacenan localmente en tu navegador y no se comparten con terceros sin tu consentimiento.',
      isOpen: false
    },
    {
      question: '¿Cómo puedo agregar una estación a favoritos?',
      answer: 'Primero debes tener una cuenta registrada. Luego, busca la estación que deseas guardar y haz clic en el icono de favorito (estrella o corazón). Tus estaciones favoritas aparecerán en una sección especial.',
      isOpen: false
    },
    {
      question: '¿Qué navegadores son compatibles?',
      answer: 'Radio App funciona en todos los navegadores modernos incluyendo Chrome, Firefox, Safari, Edge y Opera. Recomendamos usar siempre la última versión de tu navegador para una mejor experiencia.',
      isOpen: false
    },
    {
      question: '¿Puedo usar Radio App en mi teléfono móvil?',
      answer: 'Sí, Radio App está completamente optimizada para dispositivos móviles. Puedes acceder desde el navegador de tu smartphone o tablet sin necesidad de instalar ninguna aplicación.',
      isOpen: false
    },
    {
      question: '¿De dónde provienen las estaciones de radio?',
      answer: 'Las estaciones provienen de la API pública de Radio Browser, una base de datos comunitaria de estaciones de radio de todo el mundo. Cualquier estación puede ser agregada a la base de datos por su operador.',
      isOpen: false
    },
    {
      question: '¿Cómo puedo reportar un problema?',
      answer: 'Si encuentras algún problema técnico o tienes sugerencias, puedes contactarnos a través del repositorio del proyecto en GitHub o enviando un correo a nuestro equipo de soporte.',
      isOpen: false
    },
    {
      question: '¿Radio App muestra publicidad?',
      answer: 'Actualmente, Radio App no muestra publicidad propia. Sin embargo, las estaciones de radio pueden incluir anuncios en su transmisión, sobre lo cual no tenemos control.',
      isOpen: false
    },
    {
      question: '¿Puedo sugerir nuevas funcionalidades?',
      answer: 'Por supuesto! Nos encantaría escuchar tus ideas. Puedes enviar sugerencias a través de nuestro repositorio en GitHub o contactándonos directamente. Valoramos mucho el feedback de nuestros usuarios.',
      isOpen: false
    }
  ];

  toggleFaq(faq: FAQ): void {
    faq.isOpen = !faq.isOpen;
  }
}