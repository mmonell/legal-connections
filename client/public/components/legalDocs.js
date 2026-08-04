// Content for the privacy policy (/privacy) and terms of use (/terms),
// rendered by lc-legal-page.js. Kept as data (not markup) so the EN/ES/PT
// versions stay structurally identical and cannot drift apart.
//
// Each section: { heading: {en,es,pt}, body: [ block, ... ] }
// A block is either an {en,es,pt} paragraph triple, or { list: [ triples ] }.
//
// These documents describe what the app actually does today:
//   - leads captured by lc-hero (static form), lc-avatar (guided intake) and
//     the WhatsApp button, stored in Cloudflare D1 (src/shared/leads.js)
//   - lead scoring into hot/warm/cold (src/shared/leadScore.js)
//   - TCPA call/text/WhatsApp consent (the legal1 string in lc-hero/lc-avatar)
//   - cookie consent banner, essential-only vs. all (lc-consent.js)
//   - per-IP rate limiting on cf-connecting-ip (src/shared/rateLimit.js)
//   - transactional email via AWS SES (src/shared/mailer.js)
// If any of that changes, these documents must change with it.
//
// TODO before launch: replace the LEGAL_ENTITY placeholders below with the
// registered entity name, mailing address, and governing state, and have
// counsel review both documents.

import { LC } from '../config.js';

// TODO: real registered entity name, mailing address, and governing state.
const LEGAL_ENTITY = {
  name: 'Legal Connections LLC', // TODO confirm registered legal name
  address: '[TODO: street address, city, state, ZIP]',
  state: { en: 'Florida', es: 'Florida', pt: 'Flórida' }, // TODO confirm governing state
};

export const LEGAL_META = {
  kicker: { en: 'Legal', es: 'Legal', pt: 'Jurídico' },
  effective: { en: 'Effective', es: 'Vigente desde', pt: 'Em vigor desde' },
  updated: { en: 'Last updated', es: 'Última actualización', pt: 'Última atualização' },
  // TODO: set to the real launch date when these go live.
  effectiveDate: { en: 'August 3, 2026', es: '3 de agosto de 2026', pt: '3 de agosto de 2026' },
  updatedDate: { en: 'August 3, 2026', es: '3 de agosto de 2026', pt: '3 de agosto de 2026' },
  contents: { en: 'Contents', es: 'Contenido', pt: 'Conteúdo' },
  contactHeading: { en: 'How to reach us', es: 'Cómo contactarnos', pt: 'Como falar conosco' },
  contactBody: {
    en: `Questions about this document, your information, or a request to exercise your rights can go to ${LEGAL_ENTITY.name} at:`,
    es: `Las preguntas sobre este documento, tu información o una solicitud para ejercer tus derechos pueden dirigirse a ${LEGAL_ENTITY.name} en:`,
    pt: `Dúvidas sobre este documento, suas informações ou um pedido para exercer seus direitos podem ser enviados à ${LEGAL_ENTITY.name} em:`,
  },
};

const NOT_A_LAW_FIRM = {
  en: 'Legal Connections is a legal referral network — not a law firm, not a medical provider, and not a lawyer referral service certified by any state bar unless separately stated. We do not provide legal advice, and using this site does not create an attorney–client relationship between you and us.',
  es: 'Legal Connections es una red de referidos legales — no es un bufete de abogados, ni un proveedor médico, ni un servicio de referencia de abogados certificado por ningún colegio de abogados estatal salvo que se indique por separado. No brindamos asesoría legal, y usar este sitio no crea una relación abogado–cliente entre tú y nosotros.',
  pt: 'A Legal Connections é uma rede de indicações jurídicas — não é um escritório de advocacia, nem um prestador médico, nem um serviço de indicação de advogados certificado por qualquer ordem estadual, salvo indicação em contrário. Não prestamos consultoria jurídica, e usar este site não cria uma relação advogado–cliente entre você e nós.',
};

// ---------------------------------------------------------------------------
// Privacy policy
// ---------------------------------------------------------------------------

const privacy = {
  title: { en: 'Privacy Policy', es: 'Política de Privacidad', pt: 'Política de Privacidade' },
  intro: [
    {
      en: `This policy explains what ${LEGAL_ENTITY.name} ("Legal Connections", "we", "us") collects when you use this website, why we collect it, who we share it with, and the choices you have. It applies to this website and to the WhatsApp and phone conversations that start from it.`,
      es: `Esta política explica qué recopila ${LEGAL_ENTITY.name} ("Legal Connections", "nosotros") cuando usas este sitio web, por qué lo recopilamos, con quién lo compartimos y qué opciones tienes. Aplica a este sitio web y a las conversaciones por WhatsApp y teléfono que se inician desde él.`,
      pt: `Esta política explica o que a ${LEGAL_ENTITY.name} ("Legal Connections", "nós") coleta quando você usa este site, por que coletamos, com quem compartilhamos e quais escolhas você tem. Aplica-se a este site e às conversas por WhatsApp e telefone iniciadas a partir dele.`,
    },
    {
      en: 'The short version: we collect what you tell us about your accident and how to reach you, we use it to match you with an attorney or medical provider in our network, and we share it with the professionals we match you to. We do not sell your information.',
      es: 'La versión corta: recopilamos lo que nos cuentas sobre tu accidente y cómo contactarte, lo usamos para conectarte con un abogado o proveedor médico de nuestra red, y lo compartimos con los profesionales a los que te conectamos. No vendemos tu información.',
      pt: 'A versão curta: coletamos o que você nos conta sobre seu acidente e como contatá-lo, usamos isso para conectá-lo a um advogado ou prestador médico da nossa rede, e compartilhamos com os profissionais aos quais o conectamos. Não vendemos suas informações.',
    },
  ],
  sections: [
    {
      heading: { en: 'Who we are', es: 'Quiénes somos', pt: 'Quem somos' },
      body: [
        NOT_A_LAW_FIRM,
        {
          en: `The data controller responsible for the information described here is ${LEGAL_ENTITY.name}, ${LEGAL_ENTITY.address}.`,
          es: `El responsable del tratamiento de la información descrita aquí es ${LEGAL_ENTITY.name}, ${LEGAL_ENTITY.address}.`,
          pt: `O controlador de dados responsável pelas informações descritas aqui é a ${LEGAL_ENTITY.name}, ${LEGAL_ENTITY.address}.`,
        },
      ],
    },
    {
      heading: { en: 'Information you give us', es: 'Información que nos das', pt: 'Informações que você nos fornece' },
      body: [
        {
          en: 'This site offers three ways to reach us: a guided intake that asks one question at a time, a case evaluation form, and a WhatsApp chat. All three feed the same record. Depending on which you use and how far you go, we may collect:',
          es: 'Este sitio ofrece tres formas de contactarnos: una entrevista guiada que hace una pregunta a la vez, un formulario de evaluación de caso y un chat de WhatsApp. Los tres alimentan el mismo registro. Según cuál uses y hasta dónde llegues, podemos recopilar:',
          pt: 'Este site oferece três formas de nos contatar: uma triagem guiada que faz uma pergunta por vez, um formulário de avaliação de caso e um chat no WhatsApp. Os três alimentam o mesmo registro. Dependendo de qual você usar e até onde for, podemos coletar:',
        },
        {
          list: [
            {
              en: '<strong>Contact details</strong> — your name, phone number, email address, city, county, and state of residence.',
              es: '<strong>Datos de contacto</strong> — tu nombre, número de teléfono, correo electrónico, ciudad, condado y estado de residencia.',
              pt: '<strong>Dados de contato</strong> — seu nome, telefone, e-mail, cidade, condado e estado de residência.',
            },
            {
              en: '<strong>Case details</strong> — the type of matter (auto accident, personal injury, workers’ compensation, immigration), the date and state of the accident, your role in it (driver, passenger, pedestrian), whether police responded, who you believe was at fault, whether you have spoken with an insurance company, whether you already have an attorney, whether you have photos or other evidence, vehicle damage, lost wages, and any description you write in your own words.',
              es: '<strong>Detalles del caso</strong> — el tipo de asunto (accidente de auto, daños personales, compensación laboral, inmigración), la fecha y el estado del accidente, tu rol en él (conductor, pasajero, peatón), si respondió la policía, quién crees que tuvo la culpa, si has hablado con una aseguradora, si ya tienes abogado, si tienes fotos u otra evidencia, daños al vehículo, salarios perdidos, y cualquier descripción que escribas con tus propias palabras.',
              pt: '<strong>Detalhes do caso</strong> — o tipo de assunto (acidente de carro, lesões pessoais, indenização trabalhista, imigração), a data e o estado do acidente, seu papel nele (motorista, passageiro, pedestre), se a polícia atendeu, quem você acredita ser o culpado, se já falou com uma seguradora, se já tem advogado, se tem fotos ou outras evidências, danos ao veículo, salários perdidos, e qualquer descrição que você escreva com suas próprias palavras.',
            },
            {
              en: '<strong>Health-related details</strong> — whether you were injured and whether you have received medical treatment. We ask only what we need to route you to the right professional. Please do not send us detailed medical records through this site.',
              es: '<strong>Detalles relacionados con la salud</strong> — si resultaste lesionado y si has recibido tratamiento médico. Preguntamos solo lo necesario para dirigirte al profesional adecuado. Por favor no nos envíes expedientes médicos detallados a través de este sitio.',
              pt: '<strong>Detalhes relacionados à saúde</strong> — se você se feriu e se recebeu tratamento médico. Perguntamos apenas o necessário para encaminhá-lo ao profissional certo. Por favor, não nos envie prontuários médicos detalhados por este site.',
            },
            {
              en: '<strong>Immigration matters</strong> — if you contact us about immigration, the type of matter, whether you are currently in the United States, and whether you face a deadline. We do not ask for your immigration status beyond that, and you should not send documents through this site.',
              es: '<strong>Asuntos de inmigración</strong> — si nos contactas por inmigración, el tipo de asunto, si te encuentras actualmente en Estados Unidos y si tienes una fecha límite. No preguntamos tu estatus migratorio más allá de eso, y no debes enviar documentos a través de este sitio.',
              pt: '<strong>Assuntos de imigração</strong> — se você nos contatar sobre imigração, o tipo de assunto, se está atualmente nos Estados Unidos e se tem um prazo. Não perguntamos seu status imigratório além disso, e você não deve enviar documentos por este site.',
            },
            {
              en: '<strong>Preferences</strong> — the language you prefer to be contacted in, and the language you were browsing in.',
              es: '<strong>Preferencias</strong> — el idioma en que prefieres que te contacten y el idioma en que navegabas.',
              pt: '<strong>Preferências</strong> — o idioma em que prefere ser contatado e o idioma em que estava navegando.',
            },
          ],
        },
        {
          en: 'The guided intake and the WhatsApp chat save each answer as you give it, so a record may exist even if you stop before finishing. If you want that record deleted, ask us — see "Your choices and rights" below.',
          es: 'La entrevista guiada y el chat de WhatsApp guardan cada respuesta a medida que la das, por lo que puede existir un registro aunque te detengas antes de terminar. Si quieres que se elimine ese registro, pídenoslo — ver "Tus opciones y derechos" más abajo.',
          pt: 'A triagem guiada e o chat do WhatsApp salvam cada resposta conforme você a fornece, então um registro pode existir mesmo se você parar antes de terminar. Se quiser que esse registro seja excluído, peça-nos — veja "Suas escolhas e direitos" abaixo.',
        },
      ],
    },
    {
      heading: { en: 'Information collected automatically', es: 'Información recopilada automáticamente', pt: 'Informações coletadas automaticamente' },
      body: [
        {
          list: [
            {
              en: '<strong>IP address</strong> — recorded briefly when you submit a form, only to rate-limit abuse and spam submissions. It is stored separately from your case record and purged on a rolling basis.',
              es: '<strong>Dirección IP</strong> — se registra brevemente cuando envías un formulario, únicamente para limitar abusos y envíos de spam. Se almacena por separado de tu registro de caso y se purga de forma continua.',
              pt: '<strong>Endereço IP</strong> — registrado brevemente quando você envia um formulário, apenas para limitar abusos e envios de spam. É armazenado separadamente do seu registro de caso e é expurgado periodicamente.',
            },
            {
              en: '<strong>Which page you came from</strong> — we tag each submission with the page and form it came from (for example, the auto accidents page) so we know which parts of the site are useful.',
              es: '<strong>Desde qué página llegaste</strong> — etiquetamos cada envío con la página y el formulario de origen (por ejemplo, la página de accidentes de auto) para saber qué partes del sitio son útiles.',
              pt: '<strong>De qual página você veio</strong> — marcamos cada envio com a página e o formulário de origem (por exemplo, a página de acidentes de carro) para sabermos quais partes do site são úteis.',
            },
            {
              en: '<strong>Standard server logs</strong> — our hosting provider records ordinary request data (time, approximate location, browser type) to keep the site running and secure.',
              es: '<strong>Registros estándar del servidor</strong> — nuestro proveedor de alojamiento registra datos ordinarios de solicitud (hora, ubicación aproximada, tipo de navegador) para mantener el sitio funcionando y seguro.',
              pt: '<strong>Registros padrão do servidor</strong> — nosso provedor de hospedagem registra dados comuns de requisição (hora, localização aproximada, tipo de navegador) para manter o site funcionando e seguro.',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'Cookies and similar technologies', es: 'Cookies y tecnologías similares', pt: 'Cookies e tecnologias semelhantes' },
      body: [
        {
          en: 'We use a small number of strictly necessary storage items — your language preference and, for staff, an administrative session. These are required for the site to work and are not covered by the consent banner.',
          es: 'Usamos una pequeña cantidad de elementos de almacenamiento estrictamente necesarios — tu preferencia de idioma y, para el personal, una sesión administrativa. Son necesarios para que el sitio funcione y no están cubiertos por el banner de consentimiento.',
          pt: 'Usamos um pequeno número de itens de armazenamento estritamente necessários — sua preferência de idioma e, para a equipe, uma sessão administrativa. Eles são necessários para o funcionamento do site e não são cobertos pelo banner de consentimento.',
        },
        {
          en: 'Anything beyond that — analytics or marketing cookies — loads only if you choose "Accept all" in the consent banner. Choosing "Essential only" leaves them off. You can change your mind by clearing this site’s data in your browser, which brings the banner back.',
          es: 'Cualquier cosa más allá de eso — cookies de analítica o marketing — se carga solo si eliges "Aceptar todo" en el banner de consentimiento. Elegir "Solo esenciales" las deja desactivadas. Puedes cambiar de opinión borrando los datos de este sitio en tu navegador, lo que hace reaparecer el banner.',
          pt: 'Qualquer coisa além disso — cookies de análise ou marketing — carrega apenas se você escolher "Aceitar tudo" no banner de consentimento. Escolher "Somente essenciais" os mantém desativados. Você pode mudar de ideia limpando os dados deste site no seu navegador, o que faz o banner reaparecer.',
        },
      ],
    },
    {
      heading: { en: 'How we use your information', es: 'Cómo usamos tu información', pt: 'Como usamos suas informações' },
      body: [
        {
          list: [
            {
              en: 'To evaluate your matter and match you with an attorney or medical professional in our network.',
              es: 'Para evaluar tu asunto y conectarte con un abogado o profesional médico de nuestra red.',
              pt: 'Para avaliar seu caso e conectá-lo a um advogado ou profissional médico da nossa rede.',
            },
            {
              en: 'To contact you about your inquiry by phone call, text message, WhatsApp, or email — using the contact details and language preference you gave us.',
              es: 'Para contactarte sobre tu consulta por llamada, mensaje de texto, WhatsApp o correo electrónico — usando los datos de contacto y la preferencia de idioma que nos diste.',
              pt: 'Para contatá-lo sobre sua consulta por ligação, mensagem de texto, WhatsApp ou e-mail — usando os dados de contato e a preferência de idioma que você forneceu.',
            },
            {
              en: 'To prioritize inquiries. We apply an automated score to each submission based on your answers (for example, whether you were injured and how recent the accident was) so that time-sensitive matters get attention first. This score only affects how quickly a person reviews your inquiry — no decision about you is made by automated means alone, and a human reviews every match.',
              es: 'Para priorizar consultas. Aplicamos una puntuación automatizada a cada envío según tus respuestas (por ejemplo, si resultaste lesionado y qué tan reciente fue el accidente) para que los asuntos urgentes reciban atención primero. Esta puntuación solo afecta la rapidez con que una persona revisa tu consulta — ninguna decisión sobre ti se toma únicamente por medios automatizados, y una persona revisa cada conexión.',
              pt: 'Para priorizar consultas. Aplicamos uma pontuação automatizada a cada envio com base nas suas respostas (por exemplo, se você se feriu e quão recente foi o acidente) para que assuntos urgentes recebam atenção primeiro. Essa pontuação afeta apenas a rapidez com que uma pessoa revisa sua consulta — nenhuma decisão sobre você é tomada apenas por meios automatizados, e uma pessoa revisa cada conexão.',
            },
            {
              en: 'To operate, secure, and improve the site, including preventing spam and abuse.',
              es: 'Para operar, proteger y mejorar el sitio, incluyendo la prevención de spam y abusos.',
              pt: 'Para operar, proteger e melhorar o site, incluindo a prevenção de spam e abusos.',
            },
            {
              en: 'To comply with law and to establish, exercise, or defend legal claims.',
              es: 'Para cumplir con la ley y para establecer, ejercer o defender reclamaciones legales.',
              pt: 'Para cumprir a lei e para estabelecer, exercer ou defender reivindicações legais.',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'Calls, texts, and WhatsApp', es: 'Llamadas, mensajes de texto y WhatsApp', pt: 'Ligações, mensagens e WhatsApp' },
      body: [
        {
          en: 'When you submit your phone number, you authorize Legal Connections and its service providers to contact you by phone call, text message, or WhatsApp at that number. Consent is not a condition of receiving services. Message frequency varies, and message and data rates may apply.',
          es: 'Cuando envías tu número de teléfono, autorizas a Legal Connections y a sus proveedores de servicio a contactarte por llamada, mensaje de texto o WhatsApp a ese número. El consentimiento no es una condición para recibir servicios. La frecuencia de mensajes varía y pueden aplicar tarifas de mensajes y datos.',
          pt: 'Quando você envia seu número de telefone, autoriza a Legal Connections e seus prestadores de serviço a contatá-lo por ligação, mensagem de texto ou WhatsApp nesse número. O consentimento não é condição para receber serviços. A frequência de mensagens varia e podem ser aplicadas tarifas de mensagens e dados.',
        },
        {
          en: 'Reply STOP to any message to stop receiving texts, or tell us on a call or by email. Opting out of marketing messages does not stop the operational messages needed to handle an inquiry you started.',
          es: 'Responde STOP a cualquier mensaje para dejar de recibir textos, o dínoslo en una llamada o por correo electrónico. Optar por no recibir mensajes de marketing no detiene los mensajes operativos necesarios para atender una consulta que iniciaste.',
          pt: 'Responda STOP a qualquer mensagem para parar de receber textos, ou avise-nos por telefone ou e-mail. Cancelar mensagens de marketing não interrompe as mensagens operacionais necessárias para tratar uma consulta que você iniciou.',
        },
        {
          en: 'The WhatsApp chat on this site is operated by us but delivered over WhatsApp, which is provided by Meta. Messages you send there are also subject to WhatsApp’s own privacy policy.',
          es: 'El chat de WhatsApp en este sitio lo operamos nosotros pero se entrega a través de WhatsApp, provisto por Meta. Los mensajes que envíes allí también están sujetos a la propia política de privacidad de WhatsApp.',
          pt: 'O chat do WhatsApp neste site é operado por nós, mas entregue pelo WhatsApp, fornecido pela Meta. As mensagens que você envia lá também estão sujeitas à política de privacidade do próprio WhatsApp.',
        },
      ],
    },
    {
      heading: { en: 'Who we share it with', es: 'Con quién la compartimos', pt: 'Com quem compartilhamos' },
      body: [
        {
          en: 'Sharing your information with attorneys and medical providers is the core of what this service does. Specifically, we share it with:',
          es: 'Compartir tu información con abogados y proveedores médicos es el núcleo de lo que hace este servicio. En concreto, la compartimos con:',
          pt: 'Compartilhar suas informações com advogados e prestadores médicos é o núcleo do que este serviço faz. Especificamente, compartilhamos com:',
        },
        {
          list: [
            {
              en: '<strong>Attorneys and law firms</strong> in our referral network, so they can evaluate and contact you about your matter. Once they have your information, their own privacy practices and professional obligations apply.',
              es: '<strong>Abogados y bufetes</strong> de nuestra red de referidos, para que puedan evaluar tu asunto y contactarte. Una vez que tienen tu información, aplican sus propias prácticas de privacidad y obligaciones profesionales.',
              pt: '<strong>Advogados e escritórios</strong> da nossa rede de indicações, para que possam avaliar seu caso e contatá-lo. Uma vez que tenham suas informações, aplicam-se suas próprias práticas de privacidade e obrigações profissionais.',
            },
            {
              en: '<strong>Medical professionals and clinics</strong> in our network, when your matter calls for care.',
              es: '<strong>Profesionales médicos y clínicas</strong> de nuestra red, cuando tu asunto requiere atención.',
              pt: '<strong>Profissionais médicos e clínicas</strong> da nossa rede, quando seu caso exige atendimento.',
            },
            {
              en: '<strong>Service providers</strong> that run this site on our behalf — our hosting and database provider (Cloudflare), our email provider (Amazon Web Services), and the messaging platforms we use to reach you. They may process your information only as needed to provide their service to us.',
              es: '<strong>Proveedores de servicio</strong> que operan este sitio en nuestro nombre — nuestro proveedor de alojamiento y base de datos (Cloudflare), nuestro proveedor de correo (Amazon Web Services) y las plataformas de mensajería que usamos para contactarte. Solo pueden procesar tu información según sea necesario para prestarnos su servicio.',
              pt: '<strong>Prestadores de serviço</strong> que operam este site em nosso nome — nosso provedor de hospedagem e banco de dados (Cloudflare), nosso provedor de e-mail (Amazon Web Services) e as plataformas de mensagens que usamos para contatá-lo. Eles podem processar suas informações apenas conforme necessário para nos prestar seu serviço.',
            },
            {
              en: '<strong>Authorities or other parties</strong> when required by law, court order, or to protect the rights and safety of people involved.',
              es: '<strong>Autoridades u otras partes</strong> cuando lo exija la ley, una orden judicial, o para proteger los derechos y la seguridad de las personas involucradas.',
              pt: '<strong>Autoridades ou outras partes</strong> quando exigido por lei, ordem judicial, ou para proteger os direitos e a segurança das pessoas envolvidas.',
            },
          ],
        },
        {
          en: 'We do not sell your personal information, and we do not share it for cross-context behavioral advertising.',
          es: 'No vendemos tu información personal, ni la compartimos para publicidad conductual entre contextos.',
          pt: 'Não vendemos suas informações pessoais, nem as compartilhamos para publicidade comportamental entre contextos.',
        },
        {
          en: 'We may receive compensation from the attorneys or providers in our network for referrals. That compensation never comes out of your pocket and never changes what we tell you about your options.',
          es: 'Podemos recibir compensación de los abogados o proveedores de nuestra red por los referidos. Esa compensación nunca sale de tu bolsillo y nunca cambia lo que te decimos sobre tus opciones.',
          pt: 'Podemos receber compensação dos advogados ou prestadores da nossa rede por indicações. Essa compensação nunca sai do seu bolso e nunca muda o que dizemos sobre suas opções.',
        },
      ],
    },
    {
      heading: { en: 'How long we keep it', es: 'Cuánto tiempo la conservamos', pt: 'Por quanto tempo guardamos' },
      body: [
        {
          en: 'We keep inquiry records for as long as needed to handle your matter and to meet our legal, accounting, and recordkeeping obligations — and then we delete them or render them anonymous. Rate-limiting records tied to IP addresses are kept only briefly. If you ask us to delete your information, we will do so unless we are required to keep it.',
          es: 'Conservamos los registros de consultas mientras sea necesario para atender tu asunto y cumplir nuestras obligaciones legales, contables y de conservación de registros — y luego los eliminamos o los anonimizamos. Los registros de limitación de tasa vinculados a direcciones IP se conservan solo brevemente. Si nos pides eliminar tu información, lo haremos salvo que estemos obligados a conservarla.',
          pt: 'Mantemos os registros de consultas pelo tempo necessário para tratar do seu caso e cumprir nossas obrigações legais, contábeis e de guarda de registros — e depois os excluímos ou os tornamos anônimos. Os registros de limitação de taxa vinculados a endereços IP são mantidos apenas brevemente. Se você pedir para excluirmos suas informações, faremos isso, salvo se formos obrigados a mantê-las.',
        },
      ],
    },
    {
      heading: { en: 'Your choices and rights', es: 'Tus opciones y derechos', pt: 'Suas escolhas e direitos' },
      body: [
        {
          en: 'Depending on where you live, you may have the right to request a copy of the information we hold about you, to correct it, to have it deleted, to limit how we use it, or to object to certain uses. You also have the right not to be discriminated against for exercising these rights.',
          es: 'Según dónde vivas, puedes tener derecho a solicitar una copia de la información que tenemos sobre ti, a corregirla, a que se elimine, a limitar cómo la usamos, o a oponerte a ciertos usos. También tienes derecho a no sufrir discriminación por ejercer estos derechos.',
          pt: 'Dependendo de onde você mora, você pode ter o direito de solicitar uma cópia das informações que temos sobre você, de corrigi-las, de tê-las excluídas, de limitar como as usamos, ou de se opor a certos usos. Você também tem o direito de não ser discriminado por exercer esses direitos.',
        },
        {
          en: `To make a request, email us at ${LC.email} or call ${LC.phoneDisplay}. We may need to verify your identity before acting, and we will respond within the time the applicable law allows.`,
          es: `Para hacer una solicitud, escríbenos a ${LC.email} o llama al ${LC.phoneDisplay}. Es posible que necesitemos verificar tu identidad antes de actuar, y responderemos dentro del plazo que permita la ley aplicable.`,
          pt: `Para fazer uma solicitação, envie um e-mail para ${LC.email} ou ligue para ${LC.phoneDisplay}. Podemos precisar verificar sua identidade antes de agir, e responderemos dentro do prazo permitido pela lei aplicável.`,
        },
        {
          en: 'To stop text messages, reply STOP. To stop emails, use the unsubscribe link or tell us. To withdraw cookie consent, clear this site’s data in your browser.',
          es: 'Para detener los mensajes de texto, responde STOP. Para detener los correos, usa el enlace de cancelación o dínoslo. Para retirar el consentimiento de cookies, borra los datos de este sitio en tu navegador.',
          pt: 'Para parar as mensagens de texto, responda STOP. Para parar os e-mails, use o link de cancelamento ou avise-nos. Para retirar o consentimento de cookies, limpe os dados deste site no seu navegador.',
        },
      ],
    },
    {
      heading: { en: 'Security and international transfers', es: 'Seguridad y transferencias internacionales', pt: 'Segurança e transferências internacionais' },
      body: [
        {
          en: 'Your information is transmitted over encrypted connections and stored in a database hosted by Cloudflare. Access to inquiry records is limited to authorized staff, who sign in with a one-time code sent to their email and hold a role that determines what they can see and do. No method of transmission or storage is perfectly secure, and we cannot guarantee absolute security.',
          es: 'Tu información se transmite por conexiones cifradas y se almacena en una base de datos alojada por Cloudflare. El acceso a los registros de consultas se limita al personal autorizado, que inicia sesión con un código de un solo uso enviado a su correo y tiene un rol que determina qué puede ver y hacer. Ningún método de transmisión o almacenamiento es perfectamente seguro, y no podemos garantizar seguridad absoluta.',
          pt: 'Suas informações são transmitidas por conexões criptografadas e armazenadas em um banco de dados hospedado pela Cloudflare. O acesso aos registros de consultas é limitado a funcionários autorizados, que entram com um código de uso único enviado ao seu e-mail e possuem uma função que determina o que podem ver e fazer. Nenhum método de transmissão ou armazenamento é perfeitamente seguro, e não podemos garantir segurança absoluta.',
        },
        {
          en: 'Our providers operate globally, so your information may be processed on servers outside your country, including in the United States. Where the law requires it, we rely on appropriate safeguards for those transfers.',
          es: 'Nuestros proveedores operan globalmente, por lo que tu información puede procesarse en servidores fuera de tu país, incluyendo Estados Unidos. Cuando la ley lo exige, nos apoyamos en salvaguardas apropiadas para esas transferencias.',
          pt: 'Nossos provedores operam globalmente, portanto suas informações podem ser processadas em servidores fora do seu país, inclusive nos Estados Unidos. Quando a lei exige, contamos com salvaguardas apropriadas para essas transferências.',
        },
      ],
    },
    {
      heading: { en: 'Children', es: 'Menores', pt: 'Crianças' },
      body: [
        {
          en: 'This site is intended for adults. We do not knowingly collect information from children under 13. If a parent or guardian is inquiring on behalf of an injured minor, please contact us by phone rather than through the forms. If we learn we have collected a child’s information without authorization, we delete it.',
          es: 'Este sitio está dirigido a adultos. No recopilamos conscientemente información de menores de 13 años. Si un padre o tutor consulta en nombre de un menor lesionado, por favor contáctanos por teléfono en lugar de usar los formularios. Si sabemos que hemos recopilado información de un menor sin autorización, la eliminamos.',
          pt: 'Este site é destinado a adultos. Não coletamos intencionalmente informações de crianças menores de 13 anos. Se um pai ou responsável estiver consultando em nome de um menor ferido, entre em contato por telefone em vez de usar os formulários. Se soubermos que coletamos informações de uma criança sem autorização, nós as excluímos.',
        },
      ],
    },
    {
      heading: { en: 'Changes to this policy', es: 'Cambios a esta política', pt: 'Alterações nesta política' },
      body: [
        {
          en: 'We may update this policy as the service changes. When we do, we revise the "Last updated" date at the top. If a change materially affects how we use information you already gave us, we will make a reasonable effort to tell you directly.',
          es: 'Podemos actualizar esta política a medida que el servicio cambie. Cuando lo hagamos, revisaremos la fecha de "Última actualización" en la parte superior. Si un cambio afecta materialmente cómo usamos información que ya nos diste, haremos un esfuerzo razonable por comunicártelo directamente.',
          pt: 'Podemos atualizar esta política conforme o serviço mudar. Quando fizermos isso, revisaremos a data de "Última atualização" no topo. Se uma mudança afetar materialmente como usamos informações que você já nos forneceu, faremos um esforço razoável para avisá-lo diretamente.',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Terms of use
// ---------------------------------------------------------------------------

const terms = {
  title: { en: 'Terms of Use', es: 'Términos de Uso', pt: 'Termos de Uso' },
  intro: [
    {
      en: `These terms are an agreement between you and ${LEGAL_ENTITY.name} ("Legal Connections", "we", "us") covering your use of this website and the referral service offered through it. By using the site, submitting a form, or starting a WhatsApp chat with us, you accept these terms. If you do not accept them, please do not use the site.`,
      es: `Estos términos son un acuerdo entre tú y ${LEGAL_ENTITY.name} ("Legal Connections", "nosotros") que cubre tu uso de este sitio web y el servicio de referidos que se ofrece a través de él. Al usar el sitio, enviar un formulario o iniciar un chat de WhatsApp con nosotros, aceptas estos términos. Si no los aceptas, por favor no uses el sitio.`,
      pt: `Estes termos são um acordo entre você e a ${LEGAL_ENTITY.name} ("Legal Connections", "nós") que cobre seu uso deste site e o serviço de indicação oferecido por meio dele. Ao usar o site, enviar um formulário ou iniciar um chat no WhatsApp conosco, você aceita estes termos. Se não os aceitar, por favor não use o site.`,
    },
    {
      en: 'Please read section 2 carefully — it explains that we are not a law firm and that nothing here is legal advice.',
      es: 'Por favor lee con atención la sección 2 — explica que no somos un bufete de abogados y que nada aquí constituye asesoría legal.',
      pt: 'Por favor, leia a seção 2 com atenção — ela explica que não somos um escritório de advocacia e que nada aqui constitui consultoria jurídica.',
    },
  ],
  sections: [
    {
      heading: { en: 'What this service is', es: 'Qué es este servicio', pt: 'O que é este serviço' },
      body: [
        {
          en: 'Legal Connections connects people injured in accidents with attorneys and medical professionals in our network. You tell us about your situation through the guided intake, the case evaluation form, or WhatsApp; we review it and, where we can, introduce you to a professional who handles matters like yours.',
          es: 'Legal Connections conecta a personas lesionadas en accidentes con abogados y profesionales médicos de nuestra red. Nos cuentas tu situación a través de la entrevista guiada, el formulario de evaluación de caso o WhatsApp; la revisamos y, cuando podemos, te presentamos a un profesional que maneja asuntos como el tuyo.',
          pt: 'A Legal Connections conecta pessoas feridas em acidentes a advogados e profissionais médicos da nossa rede. Você nos conta sua situação pela triagem guiada, pelo formulário de avaliação de caso ou pelo WhatsApp; nós a analisamos e, quando possível, apresentamos você a um profissional que cuida de casos como o seu.',
        },
        {
          en: 'Using this site is free to you. We may be compensated by the professionals in our network for referrals; that never comes out of your pocket.',
          es: 'Usar este sitio es gratuito para ti. Podemos recibir compensación de los profesionales de nuestra red por los referidos; eso nunca sale de tu bolsillo.',
          pt: 'Usar este site é gratuito para você. Podemos ser remunerados pelos profissionais da nossa rede pelas indicações; isso nunca sai do seu bolso.',
        },
      ],
    },
    {
      heading: { en: 'Not a law firm, not legal advice', es: 'No somos un bufete ni damos asesoría legal', pt: 'Não somos escritório de advocacia nem damos consultoria jurídica' },
      body: [
        NOT_A_LAW_FIRM,
        {
          en: 'Everything on this site — the guidance the guided intake gives you, the service pages, and anything our staff tells you before you are matched — is general information, not legal or medical advice about your specific situation. Only a licensed attorney or medical professional who has reviewed your case can advise you.',
          es: 'Todo en este sitio — la orientación que te da la entrevista guiada, las páginas de servicios y cualquier cosa que nuestro personal te diga antes de conectarte — es información general, no asesoría legal ni médica sobre tu situación específica. Solo un abogado o profesional médico con licencia que haya revisado tu caso puede asesorarte.',
          pt: 'Tudo neste site — a orientação dada pela triagem guiada, as páginas de serviços e qualquer coisa que nossa equipe lhe diga antes de você ser conectado — é informação geral, não consultoria jurídica ou médica sobre sua situação específica. Apenas um advogado ou profissional médico licenciado que tenha analisado seu caso pode aconselhá-lo.',
        },
        {
          en: 'No attorney–client relationship is created by using this site, by submitting a form, or by talking with us. That relationship begins only if and when you and an attorney sign an agreement directly.',
          es: 'No se crea ninguna relación abogado–cliente por usar este sitio, enviar un formulario o hablar con nosotros. Esa relación comienza únicamente si y cuando tú y un abogado firman un acuerdo directamente.',
          pt: 'Nenhuma relação advogado–cliente é criada pelo uso deste site, pelo envio de um formulário ou por falar conosco. Essa relação começa apenas se e quando você e um advogado assinarem um acordo diretamente.',
        },
        {
          en: 'Because no attorney–client relationship exists with us, information you send through this site is not protected by attorney–client privilege. Do not send confidential or sensitive details you would not want shared with the professionals we may match you to.',
          es: 'Como no existe una relación abogado–cliente con nosotros, la información que envías a través de este sitio no está protegida por el privilegio abogado–cliente. No envíes detalles confidenciales o sensibles que no quisieras compartir con los profesionales a los que podríamos conectarte.',
          pt: 'Como não existe relação advogado–cliente conosco, as informações que você envia por este site não são protegidas pelo sigilo advogado–cliente. Não envie detalhes confidenciais ou sensíveis que você não gostaria de compartilhar com os profissionais aos quais possamos conectá-lo.',
        },
      ],
    },
    {
      heading: { en: 'Time limits on legal claims', es: 'Plazos legales para reclamaciones', pt: 'Prazos legais para reivindicações' },
      body: [
        {
          en: 'Legal claims are subject to strict deadlines (statutes of limitations) that vary by state and by type of claim. Submitting a form here does not preserve, extend, or toll any deadline, and we do not undertake to track deadlines for you. If your matter may be time-sensitive, consult a licensed attorney immediately rather than waiting to hear from us.',
          es: 'Las reclamaciones legales están sujetas a plazos estrictos (prescripción) que varían según el estado y el tipo de reclamación. Enviar un formulario aquí no preserva, extiende ni suspende ningún plazo, y no nos comprometemos a controlar plazos por ti. Si tu asunto puede ser urgente, consulta de inmediato a un abogado con licencia en lugar de esperar noticias nuestras.',
          pt: 'Reivindicações legais estão sujeitas a prazos rígidos (prescrição) que variam por estado e por tipo de reivindicação. Enviar um formulário aqui não preserva, estende nem suspende qualquer prazo, e não nos comprometemos a controlar prazos por você. Se seu caso puder ser urgente, consulte imediatamente um advogado licenciado em vez de esperar nosso contato.',
        },
      ],
    },
    {
      heading: { en: 'No guarantee of results or of a match', es: 'Sin garantía de resultados ni de conexión', pt: 'Sem garantia de resultados ou de conexão' },
      body: [
        {
          en: 'We do not guarantee that we will match you with an attorney or provider, that any professional will accept your case, or that any case will produce a recovery. Past results described anywhere on this site do not predict the outcome of your matter. Results are never guaranteed.',
          es: 'No garantizamos que te conectaremos con un abogado o proveedor, que algún profesional acepte tu caso, ni que algún caso produzca una compensación. Los resultados pasados descritos en cualquier parte de este sitio no predicen el resultado de tu asunto. Los resultados nunca están garantizados.',
          pt: 'Não garantimos que o conectaremos a um advogado ou prestador, que algum profissional aceitará seu caso, nem que algum caso resultará em indenização. Resultados anteriores descritos em qualquer parte deste site não preveem o resultado do seu caso. Os resultados nunca são garantidos.',
        },
      ],
    },
    {
      heading: { en: 'The professionals in our network', es: 'Los profesionales de nuestra red', pt: 'Os profissionais da nossa rede' },
      body: [
        {
          en: 'Attorneys and medical professionals in our network are independent — they are not our employees, partners, or agents. We do not control, supervise, or take responsibility for the services they provide, their fees, or their advice. Any agreement you make with them is between you and them.',
          es: 'Los abogados y profesionales médicos de nuestra red son independientes — no son nuestros empleados, socios ni agentes. No controlamos, supervisamos ni asumimos responsabilidad por los servicios que prestan, sus honorarios o su asesoría. Cualquier acuerdo que hagas con ellos es entre tú y ellos.',
          pt: 'Advogados e profissionais médicos da nossa rede são independentes — não são nossos funcionários, sócios ou agentes. Não controlamos, supervisionamos nem assumimos responsabilidade pelos serviços que prestam, seus honorários ou seus conselhos. Qualquer acordo que você faça com eles é entre você e eles.',
        },
        {
          en: 'You are free to choose any attorney or provider you wish, including one outside our network. A referral from us is an introduction, not an endorsement of any particular outcome, and you are never obligated to hire anyone we introduce you to.',
          es: 'Eres libre de elegir cualquier abogado o proveedor que desees, incluso fuera de nuestra red. Un referido de nuestra parte es una presentación, no un respaldo de ningún resultado en particular, y nunca estás obligado a contratar a nadie que te presentemos.',
          pt: 'Você é livre para escolher qualquer advogado ou prestador que desejar, inclusive fora da nossa rede. Uma indicação nossa é uma apresentação, não um endosso de qualquer resultado específico, e você nunca é obrigado a contratar ninguém que apresentemos.',
        },
      ],
    },
    {
      heading: { en: 'Your responsibilities', es: 'Tus responsabilidades', pt: 'Suas responsabilidades' },
      body: [
        {
          en: 'When you use this site, you agree to:',
          es: 'Al usar este sitio, aceptas:',
          pt: 'Ao usar este site, você concorda em:',
        },
        {
          list: [
            {
              en: 'Give accurate information about yourself and your situation, and submit only your own information or that of someone you are authorized to act for.',
              es: 'Dar información veraz sobre ti y tu situación, y enviar solo tu propia información o la de alguien en cuyo nombre estás autorizado a actuar.',
              pt: 'Fornecer informações verdadeiras sobre você e sua situação, e enviar apenas suas próprias informações ou as de alguém em nome de quem você está autorizado a agir.',
            },
            {
              en: 'Be at least 18 years old, or have a parent or guardian contact us on your behalf.',
              es: 'Tener al menos 18 años, o que un padre o tutor nos contacte en tu nombre.',
              pt: 'Ter pelo menos 18 anos, ou ter um pai ou responsável nos contatando em seu nome.',
            },
            {
              en: 'Use the site only for its intended purpose — not to send spam, submit false or automated inquiries, probe or interfere with the site’s security, scrape it, or copy its content for a competing service.',
              es: 'Usar el sitio solo para su propósito previsto — no para enviar spam, hacer consultas falsas o automatizadas, sondear o interferir con la seguridad del sitio, extraer sus datos, o copiar su contenido para un servicio competidor.',
              pt: 'Usar o site apenas para sua finalidade prevista — não para enviar spam, fazer consultas falsas ou automatizadas, sondar ou interferir na segurança do site, raspar seus dados, ou copiar seu conteúdo para um serviço concorrente.',
            },
          ],
        },
        {
          en: 'We limit how often submissions can come from the same connection, and we may decline, remove, or block any inquiry or visitor that appears abusive.',
          es: 'Limitamos la frecuencia con que pueden llegar envíos desde la misma conexión, y podemos rechazar, eliminar o bloquear cualquier consulta o visitante que parezca abusivo.',
          pt: 'Limitamos a frequência com que envios podem vir da mesma conexão, e podemos recusar, remover ou bloquear qualquer consulta ou visitante que pareça abusivo.',
        },
      ],
    },
    {
      heading: { en: 'Consent to be contacted', es: 'Consentimiento para ser contactado', pt: 'Consentimento para contato' },
      body: [
        {
          en: 'By submitting your phone number, you authorize Legal Connections and its service providers to contact you by phone call, text message, or WhatsApp at that number, including with automated technology. Consent is not a condition of receiving services. Message frequency varies; message and data rates may apply. Reply STOP to any message to unsubscribe.',
          es: 'Al enviar tu número de teléfono, autorizas a Legal Connections y a sus proveedores de servicio a contactarte por llamada, mensaje de texto o WhatsApp a ese número, incluso con tecnología automatizada. El consentimiento no es una condición para recibir servicios. La frecuencia de mensajes varía; pueden aplicar tarifas de mensajes y datos. Responde STOP a cualquier mensaje para cancelar.',
          pt: 'Ao enviar seu número de telefone, você autoriza a Legal Connections e seus prestadores de serviço a contatá-lo por ligação, mensagem de texto ou WhatsApp nesse número, inclusive com tecnologia automatizada. O consentimento não é condição para receber serviços. A frequência de mensagens varia; podem ser aplicadas tarifas de mensagens e dados. Responda STOP a qualquer mensagem para cancelar.',
        },
        {
          en: 'How we handle the information you send is described in our <a href="/privacy">Privacy Policy</a>, which forms part of these terms.',
          es: 'Cómo manejamos la información que envías se describe en nuestra <a href="/privacy">Política de Privacidad</a>, que forma parte de estos términos.',
          pt: 'Como tratamos as informações que você envia está descrito em nossa <a href="/privacy">Política de Privacidade</a>, que faz parte destes termos.',
        },
      ],
    },
    {
      heading: { en: 'Our content', es: 'Nuestro contenido', pt: 'Nosso conteúdo' },
      body: [
        {
          en: 'The name Legal Connections, the "Connected by Trust" tagline, our logos, and the text, design, and graphics on this site belong to us or our licensors and are protected by copyright and trademark law. You may view and print pages for your own personal use. Any other use — copying, republishing, or building a derivative service — requires our written permission.',
          es: 'El nombre Legal Connections, el lema "Conectados por la Confianza", nuestros logotipos y el texto, diseño y gráficos de este sitio nos pertenecen a nosotros o a nuestros licenciantes y están protegidos por las leyes de derechos de autor y marcas. Puedes ver e imprimir páginas para tu uso personal. Cualquier otro uso — copiar, republicar o construir un servicio derivado — requiere nuestro permiso por escrito.',
          pt: 'O nome Legal Connections, o slogan "Conectados pela Confiança", nossos logotipos e o texto, design e gráficos deste site pertencem a nós ou aos nossos licenciantes e são protegidos por direitos autorais e marcas registradas. Você pode visualizar e imprimir páginas para seu uso pessoal. Qualquer outro uso — copiar, republicar ou construir um serviço derivado — requer nossa permissão por escrito.',
        },
      ],
    },
    {
      heading: { en: 'Third-party services and links', es: 'Servicios y enlaces de terceros', pt: 'Serviços e links de terceiros' },
      body: [
        {
          en: 'This site links to and relies on services we do not control — WhatsApp for chat, our hosting and email providers, and any external pages we link to. Their terms and privacy policies govern your use of them, and we are not responsible for their content or availability.',
          es: 'Este sitio enlaza y depende de servicios que no controlamos — WhatsApp para el chat, nuestros proveedores de alojamiento y correo, y cualquier página externa a la que enlacemos. Sus términos y políticas de privacidad rigen tu uso de ellos, y no somos responsables de su contenido ni disponibilidad.',
          pt: 'Este site tem links e depende de serviços que não controlamos — WhatsApp para chat, nossos provedores de hospedagem e e-mail, e quaisquer páginas externas às quais façamos link. Os termos e políticas de privacidade deles regem seu uso, e não somos responsáveis por seu conteúdo ou disponibilidade.',
        },
      ],
    },
    {
      heading: { en: 'Availability of the site', es: 'Disponibilidad del sitio', pt: 'Disponibilidade do site' },
      body: [
        {
          en: 'We work to keep the site available, but we do not promise it will be uninterrupted or error-free. We may change, suspend, or discontinue any part of it at any time. If the site is unavailable and your matter is urgent, call us instead.',
          es: 'Trabajamos para mantener el sitio disponible, pero no prometemos que sea ininterrumpido ni libre de errores. Podemos cambiar, suspender o descontinuar cualquier parte en cualquier momento. Si el sitio no está disponible y tu asunto es urgente, llámanos.',
          pt: 'Trabalhamos para manter o site disponível, mas não prometemos que será ininterrupto ou livre de erros. Podemos alterar, suspender ou descontinuar qualquer parte a qualquer momento. Se o site estiver indisponível e seu caso for urgente, ligue para nós.',
        },
      ],
    },
    {
      heading: { en: 'Disclaimers and limits on liability', es: 'Descargos y límites de responsabilidad', pt: 'Isenções e limites de responsabilidade' },
      body: [
        {
          en: 'To the fullest extent the law allows, the site and the referral service are provided "as is" and "as available", without warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement.',
          es: 'En la máxima medida que permita la ley, el sitio y el servicio de referidos se proporcionan "tal cual" y "según disponibilidad", sin garantías de ningún tipo, expresas o implícitas, incluidas las de comerciabilidad, idoneidad para un fin particular y no infracción.',
          pt: 'Na máxima extensão permitida por lei, o site e o serviço de indicação são fornecidos "no estado em que se encontram" e "conforme disponibilidade", sem garantias de qualquer tipo, expressas ou implícitas, incluindo comerciabilidade, adequação a uma finalidade específica e não violação.',
        },
        {
          en: 'To the fullest extent the law allows, Legal Connections is not liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits or lost opportunity, arising out of your use of this site or of any referral — including the acts or omissions of any attorney or provider we introduce you to. Where liability cannot be excluded, our total liability is limited to one hundred U.S. dollars (US$100).',
          es: 'En la máxima medida que permita la ley, Legal Connections no es responsable de daños indirectos, incidentales, especiales, consecuentes o punitivos, ni de lucro cesante o pérdida de oportunidad, derivados de tu uso de este sitio o de cualquier referido — incluidos los actos u omisiones de cualquier abogado o proveedor que te presentemos. Cuando la responsabilidad no pueda excluirse, nuestra responsabilidad total se limita a cien dólares estadounidenses (US$100).',
          pt: 'Na máxima extensão permitida por lei, a Legal Connections não é responsável por danos indiretos, incidentais, especiais, consequenciais ou punitivos, nem por lucros cessantes ou perda de oportunidade, decorrentes do seu uso deste site ou de qualquer indicação — incluindo atos ou omissões de qualquer advogado ou prestador que apresentemos. Quando a responsabilidade não puder ser excluída, nossa responsabilidade total limita-se a cem dólares americanos (US$100).',
        },
        {
          en: 'Some jurisdictions do not allow certain exclusions, so parts of this section may not apply to you. Nothing here limits liability that cannot lawfully be limited.',
          es: 'Algunas jurisdicciones no permiten ciertas exclusiones, por lo que partes de esta sección pueden no aplicarte. Nada aquí limita la responsabilidad que no puede limitarse legalmente.',
          pt: 'Algumas jurisdições não permitem certas exclusões, portanto partes desta seção podem não se aplicar a você. Nada aqui limita a responsabilidade que não pode ser legalmente limitada.',
        },
      ],
    },
    {
      heading: { en: 'Indemnity', es: 'Indemnización', pt: 'Indenização' },
      body: [
        {
          en: 'You agree to indemnify and hold Legal Connections harmless from claims, losses, and reasonable legal costs arising out of your misuse of the site, your breach of these terms, or information you submitted that was false or that you had no right to submit.',
          es: 'Aceptas indemnizar y mantener indemne a Legal Connections frente a reclamaciones, pérdidas y costos legales razonables derivados de tu uso indebido del sitio, tu incumplimiento de estos términos, o información que enviaste que era falsa o que no tenías derecho a enviar.',
          pt: 'Você concorda em indenizar e isentar a Legal Connections de reivindicações, perdas e custos legais razoáveis decorrentes do uso indevido do site, do descumprimento destes termos, ou de informações que você enviou que eram falsas ou que não tinha o direito de enviar.',
        },
      ],
    },
    {
      heading: { en: 'Governing law and disputes', es: 'Ley aplicable y disputas', pt: 'Lei aplicável e disputas' },
      body: [
        {
          en: `These terms are governed by the laws of the State of ${LEGAL_ENTITY.state.en}, without regard to its conflict-of-laws rules. Any dispute arising out of these terms or your use of the site will be brought in the state or federal courts located in ${LEGAL_ENTITY.state.en}, and you and we consent to their jurisdiction.`,
          es: `Estos términos se rigen por las leyes del Estado de ${LEGAL_ENTITY.state.es}, sin considerar sus normas de conflicto de leyes. Cualquier disputa derivada de estos términos o de tu uso del sitio se presentará ante los tribunales estatales o federales ubicados en ${LEGAL_ENTITY.state.es}, y tú y nosotros aceptamos su jurisdicción.`,
          pt: `Estes termos são regidos pelas leis do Estado da ${LEGAL_ENTITY.state.pt}, sem considerar suas regras de conflito de leis. Qualquer disputa decorrente destes termos ou do seu uso do site será apresentada aos tribunais estaduais ou federais localizados na ${LEGAL_ENTITY.state.pt}, e você e nós aceitamos sua jurisdição.`,
        },
        {
          en: 'Before filing anything, please contact us — most issues are resolved faster with a phone call or an email.',
          es: 'Antes de presentar cualquier acción, por favor contáctanos — la mayoría de los asuntos se resuelven más rápido con una llamada o un correo.',
          pt: 'Antes de entrar com qualquer ação, entre em contato conosco — a maioria das questões é resolvida mais rápido com uma ligação ou um e-mail.',
        },
      ],
    },
    {
      heading: { en: 'Changes to these terms', es: 'Cambios a estos términos', pt: 'Alterações nestes termos' },
      body: [
        {
          en: 'We may update these terms as the service changes. The "Last updated" date at the top shows when. Continuing to use the site after a change means you accept the updated terms.',
          es: 'Podemos actualizar estos términos a medida que el servicio cambie. La fecha de "Última actualización" en la parte superior indica cuándo. Seguir usando el sitio después de un cambio significa que aceptas los términos actualizados.',
          pt: 'Podemos atualizar estes termos conforme o serviço mudar. A data de "Última atualização" no topo indica quando. Continuar a usar o site após uma alteração significa que você aceita os termos atualizados.',
        },
      ],
    },
    {
      heading: { en: 'General', es: 'General', pt: 'Geral' },
      body: [
        {
          en: 'If any part of these terms is found unenforceable, the rest stays in effect. Our not enforcing a provision is not a waiver of it. These terms, together with the Privacy Policy, are the entire agreement between you and us about the site.',
          es: 'Si alguna parte de estos términos resulta inexigible, el resto sigue vigente. Que no hagamos cumplir una disposición no significa que renunciemos a ella. Estos términos, junto con la Política de Privacidad, constituyen el acuerdo completo entre tú y nosotros sobre el sitio.',
          pt: 'Se alguma parte destes termos for considerada inexequível, o restante permanece em vigor. O fato de não aplicarmos uma disposição não constitui renúncia a ela. Estes termos, junto com a Política de Privacidade, constituem o acordo integral entre você e nós sobre o site.',
        },
      ],
    },
  ],
};

export const LEGAL_DOCS = { privacy, terms };
