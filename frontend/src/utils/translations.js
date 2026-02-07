// Traductions pour l'interface multilingue avec support du dialecte tunisien
export const translations = {
  'ar-TN': {
    // Interface générale
    'login': 'دخول',
    'register': 'تسجيل',
    'logout': 'خروج',
    'home': 'الرئيسية',
    'users': 'المستخدمين',
    'user_management': 'إدارة المستخدمين',
    
    // Formulaires
    'full_name': 'الاسم الكامل',
    'email': 'البريد الإلكتروني',
    'password': 'كلمة المرور',
    'role': 'الدور',
    'required': 'مطلوب',
    
    // Rôles
    'consultant': 'مستشار',
    'chef': 'رئيس مشروع',
    'responsable': 'مسؤول',
    
    // Actions
    'create': 'إنشاء',
    'edit': 'تعديل',
    'delete': 'حذف',
    'save': 'حفظ',
    'cancel': 'إلغاء',
    'submit': 'إرسال',
    
    // Messages vocaux tunisiens
    'voice_instructions': {
      'page_login': 'صفحة الدخول. املأ بياناتك باش تدخل لـ TILI.',
      'page_register': 'صفحة التسجيل. املأ الاستمارة باش تعمل حسابك في TILI.',
      'page_users': 'صفحة إدارة المستخدمين. شوف قائمة المستخدمين ودير حساباتهم.',
      'field_name': 'حقل الاسم الكامل. قول اسمك الكامل.',
      'field_email': 'حقل البريد الإلكتروني. قول إيميلك.',
      'field_password': 'حقل كلمة المرور. قول كلمة المرور متاعك.',
      'select_role': 'اختار الدور متاع المستخدم في المؤسسة.',
      'creating_user': 'قاعد نعمل المستخدم...',
      'user_created': 'المستخدم تعمل بنجاح.',
      'updating_user': 'قاعد نحدث المستخدم...',
      'user_updated': 'المستخدم تحدث بنجاح.',
      'login_progress': 'قاعد ندخل...',
      'login_success': 'دخلت بنجاح. راهي تحولك للوحة التحكم.',
      'register_progress': 'قاعد نعمل الحساب...',
      'register_success': 'الحساب تعمل بنجاح. راهي تحولك للوحة التحكم.',
      'modal_create': 'استمارة إنشاء مستخدم فتحت. املأ المعلومات المطلوبة.',
      'modal_edit': 'تعديل المستخدم {name}. غير المعلومات اللي تحب.',
      'role_consultant': 'مستشار مختار. عندو صلاحية قراءة فقط.',
      'role_chef': 'رئيس مشروع مختار. ينجم يدير المستخدمين.',
      'role_responsable': 'مسؤول مختار. عندو صلاحية كاملة لكل الوظائف.'
    },
    
    // Instructions
    'voice_help': 'اضغط Alt + V للكتابة بالصوت',
    'speak_now': 'احكي دلوقتي...',
    'voice_not_supported': 'التعرف على الصوت مش مدعوم في المتصفح هذا'
  },
  
  'fr-FR': {
    // Interface générale
    'login': 'Connexion',
    'register': 'Inscription',
    'logout': 'Déconnexion',
    'home': 'Accueil',
    'users': 'Utilisateurs',
    'user_management': 'Gestion des utilisateurs',
    
    // Formulaires
    'full_name': 'Nom complet',
    'email': 'Email',
    'password': 'Mot de passe',
    'role': 'Rôle',
    'required': 'Obligatoire',
    
    // Rôles
    'consultant': 'Consultant',
    'chef': 'Chef de projet',
    'responsable': 'Responsable',
    
    // Actions
    'create': 'Créer',
    'edit': 'Modifier',
    'delete': 'Supprimer',
    'save': 'Enregistrer',
    'cancel': 'Annuler',
    'submit': 'Soumettre',
    
    // Messages vocaux
    'voice_instructions': {
      'page_login': 'Page de connexion. Remplissez vos identifiants pour vous connecter à TILI.',
      'page_register': 'Page d\'inscription. Remplissez le formulaire pour créer votre compte TILI.',
      'page_users': 'Page de gestion des utilisateurs. Consultez la liste des utilisateurs et gérez leurs comptes.',
      'field_name': 'Champ nom complet. Dites votre nom complet.',
      'field_email': 'Champ email. Dites votre email.',
      'field_password': 'Champ mot de passe. Dites votre mot de passe.',
      'select_role': 'Sélectionnez le rôle de l\'utilisateur dans l\'organisation.',
      'creating_user': 'Création de l\'utilisateur en cours...',
      'user_created': 'Nouvel utilisateur créé avec succès.',
      'updating_user': 'Mise à jour de l\'utilisateur en cours...',
      'user_updated': 'Utilisateur mis à jour avec succès.',
      'login_progress': 'Connexion en cours...',
      'login_success': 'Connexion réussie. Redirection vers le tableau de bord.',
      'register_progress': 'Création du compte en cours...',
      'register_success': 'Compte créé avec succès. Redirection vers le tableau de bord.',
      'modal_create': 'Formulaire de création d\'utilisateur ouvert. Remplissez les informations requises.',
      'modal_edit': 'Modification de l\'utilisateur {name}. Modifiez les informations nécessaires.',
      'role_consultant': 'Consultant sélectionné. Accès limité en lecture.',
      'role_chef': 'Chef de projet sélectionné. Peut gérer les utilisateurs.',
      'role_responsable': 'Responsable sélectionné. Accès complet à toutes les fonctionnalités.'
    },
    
    // Instructions
    'voice_help': 'Appuyez sur Alt + V pour la saisie vocale',
    'speak_now': 'Parlez maintenant...',
    'voice_not_supported': 'Reconnaissance vocale non disponible sur ce navigateur'
  },
  
  'ar': {
    // Interface générale (Arabe standard)
    'login': 'تسجيل الدخول',
    'register': 'التسجيل',
    'logout': 'تسجيل الخروج',
    'home': 'الرئيسية',
    'users': 'المستخدمون',
    'user_management': 'إدارة المستخدمين',
    
    // Formulaires
    'full_name': 'الاسم الكامل',
    'email': 'البريد الإلكتروني',
    'password': 'كلمة المرور',
    'role': 'الدور',
    'required': 'مطلوب',
    
    // Rôles
    'consultant': 'مستشار',
    'chef': 'رئيس مشروع',
    'responsable': 'مسؤول',
    
    // Actions
    'create': 'إنشاء',
    'edit': 'تعديل',
    'delete': 'حذف',
    'save': 'حفظ',
    'cancel': 'إلغاء',
    'submit': 'إرسال',
    
    // Messages vocaux
    'voice_instructions': {
      'page_login': 'صفحة تسجيل الدخول. املأ بياناتك لتسجيل الدخول إلى TILI.',
      'page_register': 'صفحة التسجيل. املأ النموذج لإنشاء حسابك في TILI.',
      'page_users': 'صفحة إدارة المستخدمين. اطلع على قائمة المستخدمين وأدر حساباتهم.',
      'field_name': 'حقل الاسم الكامل. قل اسمك الكامل.',
      'field_email': 'حقل البريد الإلكتروني. قل بريدك الإلكتروني.',
      'field_password': 'حقل كلمة المرور. قل كلمة المرور الخاصة بك.',
      'select_role': 'اختر دور المستخدم في المؤسسة.',
      'creating_user': 'جاري إنشاء المستخدم...',
      'user_created': 'تم إنشاء المستخدم بنجاح.',
      'updating_user': 'جاري تحديث المستخدم...',
      'user_updated': 'تم تحديث المستخدم بنجاح.',
      'login_progress': 'جاري تسجيل الدخول...',
      'login_success': 'تم تسجيل الدخول بنجاح. جاري التوجيه إلى لوحة التحكم.',
      'register_progress': 'جاري إنشاء الحساب...',
      'register_success': 'تم إنشاء الحساب بنجاح. جاري التوجيه إلى لوحة التحكم.',
      'modal_create': 'تم فتح نموذج إنشاء المستخدم. املأ المعلومات المطلوبة.',
      'modal_edit': 'تعديل المستخدم {name}. عدل المعلومات اللازمة.',
      'role_consultant': 'تم اختيار مستشار. وصول محدود للقراءة فقط.',
      'role_chef': 'تم اختيار رئيس مشروع. يمكنه إدارة المستخدمين.',
      'role_responsable': 'تم اختيار مسؤول. وصول كامل لجميع الوظائف.'
    },
    
    // Instructions
    'voice_help': 'اضغط Alt + V للإدخال الصوتي',
    'speak_now': 'تحدث الآن...',
    'voice_not_supported': 'التعرف على الصوت غير متاح في هذا المتصفح'
  }
};

// Fonction utilitaire pour obtenir une traduction
export const t = (key, language = 'ar-TN', params = {}) => {
  const keys = key.split('.');
  let value = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      break;
    }
  }
  
  // Si la traduction n'existe pas, essayer le français comme fallback
  if (!value && language !== 'fr-FR') {
    return t(key, 'fr-FR', params);
  }
  
  // Remplacer les paramètres dans le texte
  if (typeof value === 'string' && Object.keys(params).length > 0) {
    return value.replace(/\{(\w+)\}/g, (match, param) => params[param] || match);
  }
  
  return value || key;
};

export default translations;