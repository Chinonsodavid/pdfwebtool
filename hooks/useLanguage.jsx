import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext(null);

const translations = {
  en: {
    common: {
      language: "Language",
      english: "English",
      spanish: "Spanish",
      french: "French",
      goBack: "Go back",
      pricing: "Pricing",
      allTools: "All tools",
      guides: "Guides",
      help: "Help",
      faq: "FAQ",
      privacy: "Privacy",
      login: "Login",
      signUp: "Sign up",
      logOut: "Log out",
      accountSettings: "Account Settings",
      upgradeToPro: "Upgrade to Pro",
      free: "Free",
    },
    landing: {
      heroTitle: "Free Online PDF Tools for Fast Document Editing & Conversion",
      heroSubtitle:
        "The complete PDF workstation for schools, offices, and freelancers. Merge, split, compress, or convert with secure OCR and e-signing in one focused workspace.",
      popular: "Popular",
      popularTools: "Popular Tools",
      chooseTool: "Choose a tool and get started",
      seeMore: "See more",
    },
    dashboard: {
      title: "All PDF Tools",
      description:
        "Convert, compress, edit, organize, secure, OCR, and extract content from PDF files.",
      allToolsFilter: "All Tools",
      noTools: "No tools match that search yet.",
    },
    tool: {
      selectPdf: "Select PDF file",
      dragFiles: "or drag and drop files here",
      dragFile: "or drag and drop file here",

      setOptions: "Set options",
      defaultsHelp: "Defaults work for most files. Adjust only what you need.",
      chooseOneFile: "Choose at least one file before continuing.",
      chooseFile: "Choose a file before continuing.",
      processing: "Processing...",
      complete: "{title} complete",
      readyDownload: "Your processed file is ready to download.",
      requestFailed: "Request failed.",
      aboutTool: "About this tool",
      steps: "Steps",
      tips: "Tips",
      commonQuestions: "Common questions",
      enable: "Enable",
    },
    auth: {
      goBackToLogin: "Go back to login",
      loginTitle: "Access your workspace",
      loginRightTitle: "Access your workspace",
      loginRightDescription:
        "Enter your email and password to access your ConstantPDF account. You are one step closer to boosting your document productivity.",
      noAccount: "Don't have an account?",
      createAccount: "Create an account",
      enterEmail: "Enter your email",
      password: "Password",
      forgotPassword: "Forgot your password?",
      loggingIn: "Logging in...",
      logIn: "Log in",
      createTitle: "Create your account",
      createRightTitle: "PDF tools for productive people",
      createRightDescription:
        "Create your account to keep your PDF workflow organized, fast, and easy to access from one place.",
      alreadyMember: "Already a member?",
      termsNotice:
        "By creating an account, you agree to our Terms of Service and Privacy Policy.",
      name: "Name",
      email: "Email",
      creatingAccount: "Creating account...",
      forgotTitle: "Forgot your password?",
      forgotDescription: "Enter your email and we will send you a reset link.",
      forgotRightTitle: "Get back into your workspace",
      forgotRightDescription:
        "Reset your password and continue working with your PDFs without losing your flow.",
      remembered: "Remembered it?",
      sending: "Sending...",
      sendResetLink: "Send reset link",
      socialMicrosoft: "Microsoft",
      socialGoogle: "Google",
      socialX: "X",
      rightPanelTitle: "Everything you need for PDFs",
      rightPanelTools: [
        "Merge PDF",
        "Split PDF",
        "Compress PDF",
        "PDF to Word",
        "OCR Documents",
        "Protect PDFs",
      ],
    },
    contact: {
      eyebrow: "Contact Support",
      title: "Contact us for personalised support",
      description:
        "Send a complaint, report a bug, or ask for help with your account or PDF workflow. The more detail you share, the faster we can help.",
      name: "Your Name",
      email: "Your Email",
      issueType: "Issue Type",
      message: "Your Message",
      namePlaceholder: "Your name",
      emailPlaceholder: "your@email.com",
      messagePlaceholder:
        "Tell us what happened, what tool you used, and how we can help.",
      sendComplaint: "Send complaint",
      beforeYouSend: "Before you send",
      beforeSendBullets: [
        "Include the tool name, the file type, and what happened just before the issue appeared.",
        "For bugs, mention your browser and device so support can reproduce the problem faster.",
        "Do not send highly sensitive documents unless you are comfortable sharing them.",
      ],
      supportOptions: "Support options",
      emailSupport: "Email support",
      bugReports: "Bug reports",
      bugReportsText:
        "Best for upload issues, conversion failures, broken previews, or download problems.",
      helpResources: "Help resources",
      success:
        "Your email app is opening with your support message. Send it there to reach ConstantPDF support.",
      issueTypes: {
        complaint: "Complaint",
        "bug-report": "Bug report",
        billing: "Billing issue",
        account: "Account support",
        business: "Business enquiry",
      },
    },
  },
  es: {
    common: {
      language: "Idioma",
      english: "Ingles",
      spanish: "Espanol",
      french: "Frances",
      goBack: "Volver",
      pricing: "Precios",
      allTools: "Todas las herramientas",
      guides: "Guias",
      help: "Ayuda",
      faq: "Preguntas frecuentes",
      privacy: "Privacidad",
      login: "Iniciar sesion",
      signUp: "Registrarse",
      logOut: "Cerrar sesion",
      accountSettings: "Configuracion de cuenta",
      upgradeToPro: "Mejorar a Pro",
      free: "Gratis",
    },
    landing: {
      heroTitle:
        "Herramientas PDF online gratis para editar y convertir documentos rapido",
      heroSubtitle:
        "La estacion de trabajo PDF completa para escuelas, oficinas y freelancers. Une, divide, comprime o convierte con OCR seguro y firma electronica en un solo espacio de trabajo.",
      popular: "Popular",
      popularTools: "Herramientas populares",
      chooseTool: "Elige una herramienta y empieza",
      seeMore: "Ver mas",
    },
    dashboard: {
      title: "Todas las herramientas PDF",
      description:
        "Convierte, comprime, edita, organiza, protege, usa OCR y extrae contenido de archivos PDF.",
      allToolsFilter: "Todas las herramientas",
      noTools: "Todavia no hay herramientas para esa busqueda.",
    },
    tool: {
      selectPdf: "Seleccionar archivo PDF",
      dragFiles: "o arrastra y suelta archivos aqui",
      dragFile: "o arrastra y suelta un archivo aqui",
      filesSecure:
        "Los archivos se procesan por HTTPS y las subidas y resultados temporales se eliminan despues de {fileRetention}.",
      setOptions: "Configurar opciones",
      defaultsHelp:
        "La configuracion predeterminada funciona para la mayoria de archivos. Cambia solo lo necesario.",
      chooseOneFile: "Elige al menos un archivo antes de continuar.",
      chooseFile: "Elige un archivo antes de continuar.",
      processing: "Procesando...",
      complete: "{title} completado",
      readyDownload: "Tu archivo procesado esta listo para descargar.",
      requestFailed: "La solicitud fallo.",
      aboutTool: "Sobre esta herramienta",
      steps: "Pasos",
      tips: "Consejos",
      commonQuestions: "Preguntas comunes",
      enable: "Activar",
    },
    auth: {
      goBackToLogin: "Volver a iniciar sesion",
      loginTitle: "Inicia sesion en tu cuenta",
      loginRightTitle: "Entra en tu espacio de trabajo",
      loginRightDescription:
        "Introduce tu correo y tu contrasena para acceder a tu cuenta de ConstantPDF. Estas a un paso de mejorar tu productividad.",
      noAccount: "No tienes una cuenta?",
      createAccount: "Crear una cuenta",
      enterEmail: "Introduce tu correo",
      password: "Contrasena",
      forgotPassword: "Olvidaste tu contrasena?",
      loggingIn: "Iniciando sesion...",
      logIn: "Iniciar sesion",
      createTitle: "Crear una cuenta nueva",
      createRightTitle: "Herramientas PDF para gente productiva",
      createRightDescription:
        "Crea tu cuenta para mantener tu flujo de trabajo PDF organizado, rapido y facil de usar en un solo lugar.",
      alreadyMember: "Ya eres miembro?",
      termsNotice:
        "Al crear una cuenta, aceptas nuestros Terminos de servicio y Politica de privacidad.",
      name: "Nombre",
      email: "Correo",
      creatingAccount: "Creando cuenta...",
      forgotTitle: "Olvidaste tu contrasena?",
      forgotDescription:
        "Introduce tu correo y te enviaremos un enlace para restablecerla.",
      forgotRightTitle: "Vuelve a tu espacio de trabajo",
      forgotRightDescription:
        "Restablece tu contrasena y sigue trabajando con tus PDF sin perder el ritmo.",
      remembered: "La recordaste?",
      sending: "Enviando...",
      sendResetLink: "Enviar enlace",
      socialMicrosoft: "Microsoft",
      socialGoogle: "Google",
      socialX: "X",
      rightPanelTitle: "Todo lo que necesitas para tus PDF",
      rightPanelTools: [
        "Unir PDF",
        "Dividir PDF",
        "Comprimir PDF",
        "PDF a Word",
        "OCR documentos",
        "Proteger PDF",
      ],
    },
    contact: {
      eyebrow: "Soporte",
      title: "Contactanos para soporte personalizado",
      description:
        "Envia una queja, reporta un error o pide ayuda con tu cuenta o tu flujo PDF. Cuantos mas detalles compartas, mas rapido podremos ayudarte.",
      name: "Tu nombre",
      email: "Tu correo",
      issueType: "Tipo de problema",
      message: "Tu mensaje",
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "tu@correo.com",
      messagePlaceholder:
        "Cuéntanos que paso, que herramienta usaste y como podemos ayudarte.",
      sendComplaint: "Enviar queja",
      beforeYouSend: "Antes de enviar",
      beforeSendBullets: [
        "Incluye el nombre de la herramienta, el tipo de archivo y que paso justo antes del problema.",
        "Para errores, menciona tu navegador y tu dispositivo para que soporte pueda reproducirlo mas rapido.",
        "No envies documentos muy sensibles a menos que te sientas comodo compartiendolos.",
      ],
      supportOptions: "Opciones de soporte",
      emailSupport: "Soporte por correo",
      bugReports: "Reporte de errores",
      bugReportsText:
        "Ideal para problemas de subida, fallos de conversion, vistas previas rotas o errores de descarga.",
      helpResources: "Recursos de ayuda",
      success:
        "Tu aplicacion de correo se esta abriendo con tu mensaje. Envialo desde alli para contactar con soporte de ConstantPDF.",
      issueTypes: {
        complaint: "Queja",
        "bug-report": "Error",
        billing: "Facturacion",
        account: "Soporte de cuenta",
        business: "Consulta comercial",
      },
    },
  },
  fr: {
    common: {
      language: "Langue",
      english: "Anglais",
      spanish: "Espagnol",
      french: "Francais",
      goBack: "Retour",
      pricing: "Tarifs",
      allTools: "Tous les outils",
      guides: "Guides",
      help: "Aide",
      faq: "FAQ",
      privacy: "Confidentialite",
      login: "Connexion",
      signUp: "Inscription",
      logOut: "Deconnexion",
      accountSettings: "Parametres du compte",
      upgradeToPro: "Passer a Pro",
      free: "Gratuit",
    },
    landing: {
      heroTitle:
        "Outils PDF en ligne gratuits pour editer et convertir rapidement",
      heroSubtitle:
        "L'espace de travail PDF complet pour les ecoles, bureaux et freelances. Fusionnez, divisez, compressez ou convertissez avec OCR securise et signature electronique.",
      popular: "Populaire",
      popularTools: "Outils populaires",
      chooseTool: "Choisissez un outil et commencez",
      seeMore: "Voir plus",
    },
    dashboard: {
      title: "Tous les outils PDF",
      description:
        "Convertissez, compressez, modifiez, organisez, securisez, utilisez l'OCR et extrayez le contenu des fichiers PDF.",
      allToolsFilter: "Tous les outils",
      noTools: "Aucun outil ne correspond encore a cette recherche.",
    },
    tool: {
      selectPdf: "Selectionner un fichier PDF",
      dragFiles: "ou glissez-deposez des fichiers ici",
      dragFile: "ou glissez-deposez un fichier ici",
      filesSecure:
        "Les fichiers sont traites via HTTPS et les televersements et resultats temporaires sont supprimes apres {fileRetention}.",
      setOptions: "Definir les options",
      defaultsHelp:
        "Les reglages par defaut conviennent a la plupart des fichiers. Modifiez seulement ce dont vous avez besoin.",
      chooseOneFile: "Choisissez au moins un fichier avant de continuer.",
      chooseFile: "Choisissez un fichier avant de continuer.",
      processing: "Traitement...",
      complete: "{title} termine",
      readyDownload: "Votre fichier traite est pret a etre telecharge.",
      requestFailed: "La requete a echoue.",
      aboutTool: "A propos de cet outil",
      steps: "Etapes",
      tips: "Conseils",
      commonQuestions: "Questions frequentes",
      enable: "Activer",
    },
    auth: {
      goBackToLogin: "Retour a la connexion",
      loginTitle: "Connectez-vous a votre compte",
      loginRightTitle: "Accedez a votre espace de travail",
      loginRightDescription:
        "Entrez votre e-mail et votre mot de passe pour acceder a votre compte ConstantPDF. Vous etes a un pas d'une meilleure productivite.",
      noAccount: "Vous n'avez pas de compte ?",
      createAccount: "Creer un compte",
      enterEmail: "Entrez votre e-mail",
      password: "Mot de passe",
      forgotPassword: "Mot de passe oublie ?",
      loggingIn: "Connexion...",
      logIn: "Se connecter",
      createTitle: "Creer un nouveau compte",
      createRightTitle: "Des outils PDF pour les personnes productives",
      createRightDescription:
        "Creez votre compte pour garder votre flux PDF organise, rapide et facile d'acces en un seul endroit.",
      alreadyMember: "Deja membre ?",
      termsNotice:
        "En creant un compte, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialite.",
      name: "Nom",
      email: "E-mail",
      creatingAccount: "Creation du compte...",
      forgotTitle: "Mot de passe oublie ?",
      forgotDescription:
        "Entrez votre e-mail et nous vous enverrons un lien de reinitialisation.",
      forgotRightTitle: "Retournez dans votre espace de travail",
      forgotRightDescription:
        "Reinitialisez votre mot de passe et continuez a travailler sur vos PDF sans perdre votre elan.",
      remembered: "Vous vous en souvenez ?",
      sending: "Envoi...",
      sendResetLink: "Envoyer le lien",
      socialMicrosoft: "Microsoft",
      socialGoogle: "Google",
      socialX: "X",
      rightPanelTitle: "Tout ce dont vous avez besoin pour vos PDF",
      rightPanelTools: [
        "Fusionner PDF",
        "Diviser PDF",
        "Compresser PDF",
        "PDF vers Word",
        "OCR documents",
        "Proteger PDF",
      ],
    },
    contact: {
      eyebrow: "Support",
      title: "Contactez-nous pour une assistance personnalisee",
      description:
        "Envoyez une reclamation, signalez un bug ou demandez de l'aide pour votre compte ou votre flux PDF. Plus vous donnez de details, plus vite nous pourrons vous aider.",
      name: "Votre nom",
      email: "Votre e-mail",
      issueType: "Type de probleme",
      message: "Votre message",
      namePlaceholder: "Votre nom",
      emailPlaceholder: "votre@email.com",
      messagePlaceholder:
        "Dites-nous ce qui s'est passe, quel outil vous avez utilise et comment nous pouvons vous aider.",
      sendComplaint: "Envoyer la reclamation",
      beforeYouSend: "Avant d'envoyer",
      beforeSendBullets: [
        "Indiquez le nom de l'outil, le type de fichier et ce qui s'est passe juste avant le probleme.",
        "Pour les bugs, mentionnez votre navigateur et votre appareil afin que le support puisse reproduire le probleme plus vite.",
        "N'envoyez pas de documents tres sensibles sauf si vous etes a l'aise pour les partager.",
      ],
      supportOptions: "Options de support",
      emailSupport: "Support par e-mail",
      bugReports: "Signalement de bug",
      bugReportsText:
        "Ideal pour les problemes d'envoi, les echecs de conversion, les apercus casses ou les soucis de telechargement.",
      helpResources: "Ressources d'aide",
      success:
        "Votre application e-mail s'ouvre avec votre message de support. Envoyez-le depuis la-bas pour contacter le support ConstantPDF.",
      issueTypes: {
        complaint: "Reclamation",
        "bug-report": "Bug",
        billing: "Facturation",
        account: "Support du compte",
        business: "Demande commerciale",
      },
    },
  },
};

function getStoredLanguage() {
  if (typeof window === "undefined") {
    return "en";
  }

  const stored = localStorage.getItem("language");
  return ["en", "es", "fr"].includes(stored) ? stored : "en";
}

function getNestedValue(object, path) {
  return path.split(".").reduce((current, part) => current?.[part], object);
}

function formatValue(value, params = {}) {
  if (typeof value !== "string") return value;

  return value.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? `{${key}}`);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getStoredLanguage);

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t(path, fallback, params) {
        const fromCurrent = getNestedValue(translations[language], path);
        const fromEnglish = getNestedValue(translations.en, path);
        const resolved = fromCurrent ?? fromEnglish ?? fallback ?? path;
        return formatValue(resolved, params);
      },
      languages: [
        { value: "en", label: translations.en.common.english },
        { value: "es", label: translations.es.common.spanish },
        { value: "fr", label: translations.fr.common.french },
      ],
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
