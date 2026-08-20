export const translations = {
  es: {
    reserve: "Reservar",
    faq: "FAQ",
    homeTitle: "San Teleco",
    homeSubtitle: "Ven a SanTeleco, la mítica fiesta universitaria",
    faqQuestionHow: "¿Cómo puedo reservar mi entrada?",
    faqQuestionWhere: "¿Dónde se celebra la fiesta?",
    faqQuestionWho: "¿Quién puede ir?",
    faqAnswerHow: `Reservar tu entrada es rápido y muy sencillo. Solo tienes que seguir estos sencillos pasos:<br><br>

<strong>1. Introduce tus datos:</strong> Rellena el formulario. <em>(¡Revisa bien que tu email esté escrito correctamente!)</em>.<br>
<strong>2. Selecciona tus entradas.</strong><br>
<strong>3. ¡Todo listo!</strong> Recibirás un correo de confirmación con tu código QR.<br><br>

<span class="text-sm opacity-80">¿No has recibido el correo? Revisa tu carpeta de Spam o contáctanos a contacto@daat.uvigo.es.</span>`,
    faqAnswerWhere: `Como manda la tradición, este año volveremos a celebrar la fiesta en nuestro lugar de siempre:<br>
<strong>Parking de la Escuela de Telecomunicaciones</strong>; Rúa Maxwell s/n (Campus Universitario).`,
    faqAnswerWho: "El único requisito indispensable para acceder al recinto es ser <strong>mayor de edad (+18)</strong>.",
    faqMapLink: "Abrir ubicación en Google Maps →",
    privacyLink: "Política de privacidad",
    photos: "Fotos",
    fullName: "Nombre completo*",
    email: "Correo electrónico*",
    privacyConsent: "He leído y acepto la",
    privacyPolicy: "Política de privacidad",
    reserveButton: "Pedir reserva",
  },
  gl: {
    reserve: "Reservar",
    faq: "FAQ",
    homeTitle: "San Teleco",
    homeSubtitle: "Vén a SanTeleco, a mítica festa universitaria",
    faqQuestionHow: "¿Como podo reservar a miña entrada?",
    faqQuestionWhere: "¿Onde se celebra a festa?",
    faqQuestionWho: "¿Quen pode ir?",
    faqAnswerHow: `Reservar a túa entrada é rápido e moi sinxelo. Só tes que seguir estes sinxelos pasos:<br><br>

<strong>1. Introduce os teus datos:</strong> Rellena o formulario. <em>(¡Revisa ben que o teu email estea ben escrito!)</em>.<br>
<strong>2. Selecciona as túas entradas.</strong><br>
<strong>3. ¡Todo listo!</strong> Recibirás un correo de confirmación co teu código QR.<br><br>

<span class="text-sm opacity-80">¿Non recibiches o correo? Revisa a túa carpeta de Spam ou contáctanos en contacto@daat.uvigo.es.</span>`,
    faqAnswerWhere: `Como manda a tradición, este ano volveremos celebrar a festa no noso lugar de sempre:<br>
<strong>Parking da Escola de Telecomunicacións</strong>; Rúa Maxwell s/n (Campus Universitario).`,
    faqAnswerWho: "O único requisito indispensable para acceder ao recinto é ser <strong>maior de idade (+18)</strong>.",
    faqMapLink: "Abrir ubicación en Google Maps →",
    privacyLink: "Política de privacidade",
    photos: "Fotos",
    fullName: "Nome completo*",
    email: "Correo electrónico*",
    privacyConsent: "Leín e acepto a",
    privacyPolicy: "Política de privacidade",
    reserveButton: "Pedir reserva",
  },
  en: {
    reserve: "Book",
    faq: "FAQ",
    homeTitle: "San Teleco",
    homeSubtitle: "Come to SanTeleco, the legendary university party",
    faqQuestionHow: "How can I book my ticket?",
    faqQuestionWhere: "Where is the party held?",
    faqQuestionWho: "Who can come?",
    faqAnswerHow: `Booking your ticket is quick and easy. Just follow these simple steps:<br><br>

<strong>1. Enter your details:</strong> Fill out the form. <em>(Double-check that your email is correct!)</em>.<br>
<strong>2. Select your tickets.</strong><br>
<strong>3. Done!</strong> You will receive a confirmation email with your QR code.<br><br>

<span class="text-sm opacity-80">Did you not receive the email? Check your Spam folder or contact us at contacto@daat.uvigo.es.</span>`,
    faqAnswerWhere: `As tradition dictates, this year we will celebrate the party in our usual place:<br>
<strong>Telecommunications School Parking</strong>; Rúa Maxwell s/n (University Campus).`,
    faqAnswerWho: "The only requirement to access the venue is to be <strong>of legal age (+18)</strong>.",
    faqMapLink: "Open location in Google Maps →",
    privacyLink: "Privacy policy",
    photos: "Photos",
    fullName: "Full name*",
    email: "Email*",
    privacyConsent: "I have read and accept the",
    privacyPolicy: "Privacy policy",
    reserveButton: "Book reservation",
  },
} as const;

export function getTranslations(locale: string | undefined) {
  const lang = locale ?? "es";
  return translations[lang as keyof typeof translations] ?? translations.es;
}
