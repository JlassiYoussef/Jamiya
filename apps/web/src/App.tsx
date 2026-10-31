import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import './App.css'

type Locale = 'en' | 'fr' | 'ar'
type Section =
  | 'dashboard'
  | 'members'
  | 'events'
  | 'volunteers'
  | 'documents'
  | 'finance'
  | 'reports'
type IconName =
  | 'grid'
  | 'users'
  | 'calendar'
  | 'heart'
  | 'file'
  | 'wallet'
  | 'chart'
  | 'search'
  | 'bell'
  | 'plus'
  | 'arrow'
  | 'chevron'
  | 'menu'
  | 'close'
  | 'check'
  | 'clock'
  | 'location'
  | 'download'
  | 'globe'

type Member = {
  id: string
  name: string
  email: string
  status: 'active' | 'pending' | 'expired'
  joinedAt: string
  membershipStartsAt: string | null
  membershipEndsAt: string | null
}

type UserRole = 'president' | 'administrator' | 'treasurer' | 'member' | 'volunteer'
type AuthUser = {
  id: string
  associationId: string
  associationName: string
  memberId: string | null
  name: string
  email: string
  role: UserRole
}
type AuthSession = { token: string; user: AuthUser }

type EventStatus = 'published' | 'draft'
type EventStatuses = Record<'garden' | 'cuisine' | 'assembly', EventStatus>

const copy = {
  en: {
    association: 'Association office',
    overview: 'Overview',
    dashboard: 'Dashboard',
    community: 'Community',
    members: 'Members',
    events: 'Events',
    volunteers: 'Volunteers',
    resources: 'Resources',
    documents: 'Documents',
    finance: 'Finance',
    insights: 'Insights',
    reports: 'Reports',
    search: 'Search members...',
    greeting: 'Good morning',
    welcome: 'Good morning, Youssef',
    welcomeNote: 'Here’s what’s happening across your association.',
    today: 'Today',
    loginTitle: 'Welcome back',
    loginDescription: 'Sign in to your association workspace.',
    associationSlug: 'Association workspace',
    signIn: 'Sign in',
    signingIn: 'Signing in…',
    invalidCredentials: 'Check your association, email, and password.',
    apiUnavailable: 'Could not reach the Jamiya service. Check that the API is running.',
    addMember: 'Add a member',
    membersLabel: 'Members',
    activeMembers: 'Active members',
    upcomingEvents: 'Upcoming events',
    volunteerHours: 'Volunteer hours',
    compared: 'vs. last month',
    thisMonth: 'This month',
    memberActivity: 'Membership at a glance',
    activityNote: 'A steady community, growing together.',
    seeMembers: 'View all members',
    recentMembers: 'Recently joined',
    recentNote: 'Your newest community members',
    viewAll: 'View all',
    active: 'Active',
    pending: 'Pending',
    expired: 'Expired',
    nextEvent: 'Next on the calendar',
    eventName: 'Community garden, together',
    eventDate: 'Saturday, 24 October · 09:30',
    eventLocation: 'Jardins de Carthage, Tunis',
    eventSeats: '18 of 30 places filled',
    eventAction: 'View event details',
    month: 'October 2026',
    week: 'This week',
    tasks: 'A few things to follow up',
    membershipReview: 'Membership renewals',
    membershipReviewNote: '12 members are due to renew this month',
    applications: 'Volunteer applications',
    applicationsNote: '4 applications are waiting for review',
    financeReview: 'Monthly expenses',
    financeReviewNote: 'Review and categorize 3 new transactions',
    dueSoon: 'Due soon',
    needsReview: 'Needs review',
    newTransaction: 'New',
    name: 'Name',
    email: 'Email',
    status: 'Status',
    joined: 'Joined',
    memberAdded: 'Member added successfully',
    memberUpdated: 'Member updated successfully',
    memberDeleted: 'Member deleted',
    memberLoadError: 'Could not load members. Try again.',
    memberSaveError: 'Could not save the member. Try again.',
    duplicateEmail: 'A member with this email already exists in the association.',
    loadingMembers: 'Loading members…',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    signOut: 'Sign out',
    password: 'Password',
    rolePresident: 'Association president',
    roleAdministrator: 'Association administrator',
    roleTreasurer: 'Treasurer',
    roleMember: 'Member',
    roleVolunteer: 'Volunteer',
    memberStatus: 'Membership status',
    membershipStart: 'Membership starts',
    membershipEnd: 'Membership ends',
    deleteConfirmation: 'Delete this member? This action cannot be undone.',
    editMemberTitle: 'Update member details',
    statusActive: 'Active',
    statusPending: 'Pending',
    statusExpired: 'Expired',
    addMemberTitle: 'Welcome someone new',
    addMemberDescription: 'Add a person to your association membership.',
    fullName: 'Full name',
    emailAddress: 'Email address',
    cancel: 'Cancel',
    saveMember: 'Add member',
    nameRequired: 'Please enter a name and a valid email address.',
    emptyMembers: 'No members match your search.',
    allMembers: 'All members',
    memberCount: 'people in your community',
    manageMembers: 'People who make your association what it is.',
    allEvents: 'Events & gatherings',
    eventsDescription: 'Bring your community together, one gathering at a time.',
    volunteersTitle: 'Volunteers',
    volunteersDescription: 'The people who bring your projects to life.',
    documentsTitle: 'Shared documents',
    documentsDescription: 'A considered home for your association’s important files.',
    financeTitle: 'Financial overview',
    financeDescription: 'A clear picture of income and expenses, month by month.',
    reportsTitle: 'Reports & insights',
    reportsDescription: 'Understand the momentum behind your community.',
    allStatuses: 'All statuses',
    upcoming: 'Upcoming',
    published: 'Published',
    draft: 'Draft',
    publishEvent: 'Publish',
    moveToDraft: 'Move to draft',
    attendees: 'attending',
    volunteerApplicationsTitle: 'Applications to review',
    approve: 'Approve',
    decline: 'Decline',
    applicationApproved: 'Application approved',
    applicationDeclined: 'Application declined',
    opportunity: 'Opportunity',
    applicant: 'Applicant',
    date: 'Date',
    decision: 'Decision',
    documentsCount: 'documents',
    category: 'Category',
    updated: 'Last updated',
    openDocument: 'Open',
    income: 'Income',
    expenses: 'Expenses',
    balance: 'Net balance',
    transaction: 'Transaction',
    amount: 'Amount',
    type: 'Type',
    reportMembers: 'Membership growth',
    reportEvents: 'Events held',
    reportParticipation: 'Community participation',
    fiscalNote: 'A simple view of your association’s financial activity.',
    memberGrowthNote: 'Membership over the past six months',
    eventDistribution: 'Participation by activity',
    notificationTitle: 'You’re all caught up',
    notifications: 'Notifications',
    notificationText: 'New updates from your association will show here.',
    close: 'Close',
    language: 'Language',
    profile: 'Association administrator',
    accountMenu: 'Account',
    noApplications: 'No applications are waiting for review.',
    siteLabel: 'TUNIS · EST. 2014',
    sunday: 'SUN',
    monday: 'MON',
    tuesday: 'TUE',
    wednesday: 'WED',
    thursday: 'THU',
    friday: 'FRI',
    saturday: 'SAT',
  },
  fr: {
    association: 'Espace association',
    overview: 'Vue d’ensemble',
    dashboard: 'Tableau de bord',
    community: 'Communauté',
    members: 'Membres',
    events: 'Événements',
    volunteers: 'Bénévoles',
    resources: 'Ressources',
    documents: 'Documents',
    finance: 'Finances',
    insights: 'Analyses',
    reports: 'Rapports',
    search: 'Rechercher un membre...',
    greeting: 'Bonjour',
    welcome: 'Bonjour, Youssef',
    welcomeNote: 'Voici les nouvelles de votre association.',
    today: 'Aujourd’hui',
    loginTitle: 'Ravi de vous revoir',
    loginDescription: 'Connectez-vous à l’espace de votre association.',
    associationSlug: 'Espace de l’association',
    signIn: 'Se connecter',
    signingIn: 'Connexion…',
    invalidCredentials: 'Vérifiez votre association, votre e-mail et votre mot de passe.',
    apiUnavailable: 'Le service Jamiya est inaccessible. Vérifiez que l’API est démarrée.',
    addMember: 'Ajouter un membre',
    membersLabel: 'Membres',
    activeMembers: 'Membres actifs',
    upcomingEvents: 'Événements à venir',
    volunteerHours: 'Heures bénévoles',
    compared: 'vs. le mois dernier',
    thisMonth: 'Ce mois-ci',
    memberActivity: 'Votre communauté en bref',
    activityNote: 'Une communauté qui grandit, ensemble.',
    seeMembers: 'Voir tous les membres',
    recentMembers: 'Nouveaux membres',
    recentNote: 'Les dernières personnes arrivées',
    viewAll: 'Tout voir',
    active: 'Actif',
    pending: 'En attente',
    expired: 'Expiré',
    nextEvent: 'À venir dans votre agenda',
    eventName: 'Jardin partagé, ensemble',
    eventDate: 'Samedi 24 octobre · 09 h 30',
    eventLocation: 'Jardins de Carthage, Tunis',
    eventSeats: '18 places prises sur 30',
    eventAction: 'Voir les détails',
    month: 'Octobre 2026',
    week: 'Cette semaine',
    tasks: 'Quelques points à suivre',
    membershipReview: 'Renouvellements',
    membershipReviewNote: '12 membres à renouveler ce mois-ci',
    applications: 'Candidatures bénévoles',
    applicationsNote: '4 candidatures à examiner',
    financeReview: 'Dépenses du mois',
    financeReviewNote: '3 nouvelles opérations à classer',
    dueSoon: 'À renouveler',
    needsReview: 'À examiner',
    newTransaction: 'Nouveau',
    name: 'Nom',
    email: 'E-mail',
    status: 'Statut',
    joined: 'Inscription',
    memberAdded: 'Membre ajouté avec succès',
    memberUpdated: 'Membre mis à jour',
    memberDeleted: 'Membre supprimé',
    memberLoadError: 'Impossible de charger les membres. Réessayez.',
    memberSaveError: 'Impossible d’enregistrer le membre. Réessayez.',
    duplicateEmail: 'Un membre avec cette adresse existe déjà dans l’association.',
    loadingMembers: 'Chargement des membres…',
    actions: 'Actions',
    edit: 'Modifier',
    delete: 'Supprimer',
    signOut: 'Se déconnecter',
    password: 'Mot de passe',
    rolePresident: 'Président·e de l’association',
    roleAdministrator: 'Administrateur·rice',
    roleTreasurer: 'Trésorier·ère',
    roleMember: 'Membre',
    roleVolunteer: 'Bénévole',
    memberStatus: 'Statut d’adhésion',
    membershipStart: 'Début de l’adhésion',
    membershipEnd: 'Fin de l’adhésion',
    deleteConfirmation: 'Supprimer ce membre ? Cette action est irréversible.',
    editMemberTitle: 'Modifier les informations',
    statusActive: 'Actif',
    statusPending: 'En attente',
    statusExpired: 'Expiré',
    addMemberTitle: 'Bienvenue à une nouvelle personne',
    addMemberDescription: 'Ajoutez une personne aux membres de votre association.',
    fullName: 'Nom complet',
    emailAddress: 'Adresse e-mail',
    cancel: 'Annuler',
    saveMember: 'Ajouter',
    nameRequired: 'Saisissez un nom et une adresse e-mail valide.',
    emptyMembers: 'Aucun membre ne correspond à votre recherche.',
    allMembers: 'Tous les membres',
    memberCount: 'personnes dans votre communauté',
    manageMembers: 'Les personnes qui font vivre votre association.',
    allEvents: 'Événements & rencontres',
    eventsDescription: 'Rassemblez votre communauté, rencontre après rencontre.',
    volunteersTitle: 'Bénévoles',
    volunteersDescription: 'Les personnes qui donnent vie à vos projets.',
    documentsTitle: 'Documents partagés',
    documentsDescription: 'Un espace organisé pour les fichiers importants.',
    financeTitle: 'Vue financière',
    financeDescription: 'Une vision claire des recettes et dépenses.',
    reportsTitle: 'Rapports & analyses',
    reportsDescription: 'Comprenez l’élan de votre communauté.',
    allStatuses: 'Tous les statuts',
    upcoming: 'À venir',
    published: 'Publié',
    draft: 'Brouillon',
    publishEvent: 'Publier',
    moveToDraft: 'Repasser en brouillon',
    attendees: 'participants',
    volunteerApplicationsTitle: 'Candidatures à examiner',
    approve: 'Accepter',
    decline: 'Refuser',
    applicationApproved: 'Candidature acceptée',
    applicationDeclined: 'Candidature refusée',
    opportunity: 'Mission',
    applicant: 'Candidat·e',
    date: 'Date',
    decision: 'Décision',
    documentsCount: 'documents',
    category: 'Catégorie',
    updated: 'Modifié',
    openDocument: 'Ouvrir',
    income: 'Recettes',
    expenses: 'Dépenses',
    balance: 'Solde net',
    transaction: 'Opération',
    amount: 'Montant',
    type: 'Type',
    reportMembers: 'Croissance des membres',
    reportEvents: 'Événements réalisés',
    reportParticipation: 'Participation communautaire',
    fiscalNote: 'Une vue simple de l’activité financière de votre association.',
    memberGrowthNote: 'Évolution des adhésions sur six mois',
    eventDistribution: 'Participation par activité',
    notificationTitle: 'Tout est à jour',
    notifications: 'Notifications',
    notificationText: 'Les nouvelles de votre association apparaîtront ici.',
    close: 'Fermer',
    language: 'Langue',
    profile: 'Administration',
    accountMenu: 'Compte',
    noApplications: 'Aucune candidature en attente.',
    siteLabel: 'TUNIS · DEPUIS 2014',
    sunday: 'DIM',
    monday: 'LUN',
    tuesday: 'MAR',
    wednesday: 'MER',
    thursday: 'JEU',
    friday: 'VEN',
    saturday: 'SAM',
  },
  ar: {
    association: 'مساحة الجمعية',
    overview: 'نظرة عامة',
    dashboard: 'لوحة المعلومات',
    community: 'المجتمع',
    members: 'الأعضاء',
    events: 'الفعاليات',
    volunteers: 'المتطوعون',
    resources: 'الموارد',
    documents: 'الوثائق',
    finance: 'المالية',
    insights: 'التحليلات',
    reports: 'التقارير',
    search: 'ابحث عن عضو...',
    greeting: 'صباح الخير',
    welcome: 'صباح الخير، يوسف',
    welcomeNote: 'إليك آخر مستجدات جمعيتك.',
    today: 'اليوم',
    loginTitle: 'مرحباً بعودتك',
    loginDescription: 'سجّل الدخول إلى مساحة جمعيتك.',
    associationSlug: 'مساحة الجمعية',
    signIn: 'تسجيل الدخول',
    signingIn: 'جارٍ تسجيل الدخول…',
    invalidCredentials: 'تحقق من الجمعية والبريد الإلكتروني وكلمة المرور.',
    apiUnavailable: 'تعذر الاتصال بخدمة جمعية. تحقق من تشغيل الخادم.',
    addMember: 'إضافة عضو',
    membersLabel: 'الأعضاء',
    activeMembers: 'الأعضاء النشطون',
    upcomingEvents: 'الفعاليات القادمة',
    volunteerHours: 'ساعات التطوع',
    compared: 'مقارنة بالشهر الماضي',
    thisMonth: 'هذا الشهر',
    memberActivity: 'مجتمعنا في لمحة',
    activityNote: 'مجتمع ينمو معاً.',
    seeMembers: 'عرض جميع الأعضاء',
    recentMembers: 'الأعضاء الجدد',
    recentNote: 'أحدث المنضمين إلى مجتمعنا',
    viewAll: 'عرض الكل',
    active: 'نشط',
    pending: 'قيد الانتظار',
    expired: 'منتهي',
    nextEvent: 'الفعالية القادمة',
    eventName: 'حديقتنا المشتركة',
    eventDate: 'السبت، ٢٤ أكتوبر · ٠٩:٣٠',
    eventLocation: 'حدائق قرطاج، تونس',
    eventSeats: '١٨ من ٣٠ مقعداً محجوز',
    eventAction: 'عرض تفاصيل الفعالية',
    month: 'أكتوبر ٢٠٢٦',
    week: 'هذا الأسبوع',
    tasks: 'أمور تستحق المتابعة',
    membershipReview: 'تجديد العضوية',
    membershipReviewNote: '١٢ عضواً بحاجة إلى التجديد هذا الشهر',
    applications: 'طلبات التطوع',
    applicationsNote: '٤ طلبات بانتظار المراجعة',
    financeReview: 'مصروفات الشهر',
    financeReviewNote: '٣ معاملات جديدة للتصنيف',
    dueSoon: 'قريباً',
    needsReview: 'تحتاج مراجعة',
    newTransaction: 'جديد',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    status: 'الحالة',
    joined: 'تاريخ الانضمام',
    memberAdded: 'تمت إضافة العضو بنجاح',
    memberUpdated: 'تم تحديث بيانات العضو',
    memberDeleted: 'تم حذف العضو',
    memberLoadError: 'تعذر تحميل الأعضاء. حاول مرة أخرى.',
    memberSaveError: 'تعذر حفظ العضو. حاول مرة أخرى.',
    duplicateEmail: 'يوجد عضو بهذا البريد الإلكتروني في الجمعية.',
    loadingMembers: 'جارٍ تحميل الأعضاء…',
    actions: 'الإجراءات',
    edit: 'تعديل',
    delete: 'حذف',
    signOut: 'تسجيل الخروج',
    password: 'كلمة المرور',
    rolePresident: 'رئيس الجمعية',
    roleAdministrator: 'مدير الجمعية',
    roleTreasurer: 'أمين المال',
    roleMember: 'عضو',
    roleVolunteer: 'متطوع',
    memberStatus: 'حالة العضوية',
    membershipStart: 'بداية العضوية',
    membershipEnd: 'نهاية العضوية',
    deleteConfirmation: 'هل تريد حذف هذا العضو؟ لا يمكن التراجع عن هذا الإجراء.',
    editMemberTitle: 'تحديث بيانات العضو',
    statusActive: 'نشط',
    statusPending: 'قيد الانتظار',
    statusExpired: 'منتهية',
    addMemberTitle: 'نرحب بعضو جديد',
    addMemberDescription: 'أضف شخصاً إلى أعضاء جمعيتك.',
    fullName: 'الاسم الكامل',
    emailAddress: 'البريد الإلكتروني',
    cancel: 'إلغاء',
    saveMember: 'إضافة العضو',
    nameRequired: 'يرجى إدخال الاسم وبريد إلكتروني صالح.',
    emptyMembers: 'لا يوجد أعضاء يطابقون بحثك.',
    allMembers: 'جميع الأعضاء',
    memberCount: 'شخصاً في مجتمعك',
    manageMembers: 'الأشخاص الذين يمنحون جمعيتك روحها.',
    allEvents: 'الفعاليات واللقاءات',
    eventsDescription: 'نجمع مجتمعنا لقاءً بعد لقاء.',
    volunteersTitle: 'المتطوعون',
    volunteersDescription: 'أشخاص يمنحون مشاريعكم الحياة.',
    documentsTitle: 'الوثائق المشتركة',
    documentsDescription: 'مساحة منظمة لملفات جمعيتكم المهمة.',
    financeTitle: 'نظرة مالية',
    financeDescription: 'صورة واضحة للإيرادات والمصروفات.',
    reportsTitle: 'التقارير والتحليلات',
    reportsDescription: 'اكتشفوا نبض مجتمعكم.',
    allStatuses: 'كل الحالات',
    upcoming: 'قادم',
    published: 'منشور',
    draft: 'مسودة',
    publishEvent: 'نشر',
    moveToDraft: 'إعادة إلى المسودة',
    attendees: 'مشاركاً',
    volunteerApplicationsTitle: 'طلبات بانتظار المراجعة',
    approve: 'قبول',
    decline: 'رفض',
    applicationApproved: 'تم قبول الطلب',
    applicationDeclined: 'تم رفض الطلب',
    opportunity: 'الفرصة',
    applicant: 'المتقدم',
    date: 'التاريخ',
    decision: 'القرار',
    documentsCount: 'وثائق',
    category: 'التصنيف',
    updated: 'آخر تحديث',
    openDocument: 'فتح',
    income: 'الإيرادات',
    expenses: 'المصروفات',
    balance: 'الرصيد الصافي',
    transaction: 'المعاملة',
    amount: 'المبلغ',
    type: 'النوع',
    reportMembers: 'نمو العضوية',
    reportEvents: 'الفعاليات المنجزة',
    reportParticipation: 'المشاركة المجتمعية',
    fiscalNote: 'نظرة مبسطة إلى النشاط المالي لجمعيتكم.',
    memberGrowthNote: 'تطور العضوية خلال الأشهر الستة الماضية',
    eventDistribution: 'المشاركة حسب النشاط',
    notificationTitle: 'لا توجد تحديثات جديدة',
    notifications: 'الإشعارات',
    notificationText: 'ستظهر هنا آخر أخبار جمعيتكم.',
    close: 'إغلاق',
    language: 'اللغة',
    profile: 'إدارة الجمعية',
    accountMenu: 'الحساب',
    noApplications: 'لا توجد طلبات بانتظار المراجعة.',
    siteLabel: 'تونس · منذ ٢٠١٤',
    sunday: 'الأحد',
    monday: 'الإثنين',
    tuesday: 'الثلاثاء',
    wednesday: 'الأربعاء',
    thursday: 'الخميس',
    friday: 'الجمعة',
    saturday: 'السبت',
  },
} satisfies Record<Locale, Record<string, string>>

type Translation = typeof copy.en

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'

class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function apiRequest<T>(
  path: string,
  token?: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  } catch {
    throw new ApiError('Service unavailable.', 0)
  }

  const text = await response.text()
  const body: unknown = text ? JSON.parse(text) : undefined
  if (!response.ok) {
    const message =
      typeof body === 'object' && body !== null && 'message' in body &&
      typeof body.message === 'string'
        ? body.message
        : 'Request failed.'
    throw new ApiError(message, response.status)
  }
  return body as T
}

function roleLabel(role: UserRole, t: Translation): string {
  const labels: Record<UserRole, keyof Translation> = {
    president: 'rolePresident',
    administrator: 'roleAdministrator',
    treasurer: 'roleTreasurer',
    member: 'roleMember',
    volunteer: 'roleVolunteer',
  }
  return t[labels[role]]
}

function memberColor(email: string): string {
  const colors = ['rose', 'blue', 'ochre', 'sage']
  const index = [...email].reduce((total, character) => total + character.charCodeAt(0), 0)
  return colors[index % colors.length]
}

const navGroups: { heading: keyof typeof copy.en; items: { id: Section; icon: IconName; label: keyof typeof copy.en }[] }[] = [
  { heading: 'overview', items: [{ id: 'dashboard', icon: 'grid', label: 'dashboard' }] },
  {
    heading: 'community',
    items: [
      { id: 'members', icon: 'users', label: 'members' },
      { id: 'events', icon: 'calendar', label: 'events' },
      { id: 'volunteers', icon: 'heart', label: 'volunteers' },
    ],
  },
  {
    heading: 'resources',
    items: [
      { id: 'documents', icon: 'file', label: 'documents' },
      { id: 'finance', icon: 'wallet', label: 'finance' },
    ],
  },
  { heading: 'insights', items: [{ id: 'reports', icon: 'chart', label: 'reports' }] },
]

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.4" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.4" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.4" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.4" /></>,
    users: <><path d="M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20" /><circle cx="9" cy="7" r="4" /><path d="M22 20v-1.5a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /><path d="m9 15 2 2 4-4" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>,
    wallet: <><rect x="2.5" y="5" width="19" height="15" rx="2.5" /><path d="M2.5 9h19M16 14h2.5" /><path d="M5 5V3.8A1.8 1.8 0 0 1 7.2 2H19" /></>,
    chart: <><path d="M3 3v18h18" /><path d="m7 14 4-4 4 3 6-7" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    location: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  }

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

function App() {
  const [locale, setLocale] = useState<Locale>('fr')
  const [section, setSection] = useState<Section>('dashboard')
  const [token, setToken] = useState(() =>
    typeof window === 'undefined' ? '' : window.sessionStorage.getItem('jamiya-token') ?? '',
  )
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const authLoading = Boolean(token) && !authUser
  const [loginPending, setLoginPending] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [membersLoading, setMembersLoading] = useState(Boolean(token))
  const [memberError, setMemberError] = useState('')
  const [eventStatuses, setEventStatuses] = useState<EventStatuses>({
    garden: 'published',
    cuisine: 'published',
    assembly: 'draft',
  })
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [noticeOpen, setNoticeOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [formError, setFormError] = useState('')
  const [applications, setApplications] = useState([
    { name: 'Sami Ben Youssef', initials: 'SB', opportunity: 'Community garden', submitted: 'Today', color: 'blue' },
    { name: 'Lina Mabrouk', initials: 'LM', opportunity: 'Saturday workshops', submitted: 'Yesterday', color: 'rose' },
    { name: 'Fares Jaziri', initials: 'FJ', opportunity: 'Community garden', submitted: 'Oct 16', color: 'ochre' },
  ])
  const t = copy[locale]
  const isRtl = locale === 'ar'

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    let cancelled = false
    if (!token) {
      return
    }

    apiRequest<{ user: AuthUser }>('/auth/me', token)
      .then(({ user }) => {
        if (!cancelled) setAuthUser(user)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        window.sessionStorage.removeItem('jamiya-token')
        setToken('')
        setAuthUser(null)
        setMembersLoading(false)
        setLoginError(
          error instanceof ApiError && error.status === 401
            ? t.invalidCredentials
            : t.apiUnavailable,
        )
      })
    return () => {
      cancelled = true
    }
  }, [t.apiUnavailable, t.invalidCredentials, token])

  useEffect(() => {
    if (!token || !authUser) {
      return
    }
    let cancelled = false
    apiRequest<Member[]>('/members', token)
      .then((loadedMembers) => {
        if (!cancelled) setMembers(loadedMembers)
      })
      .catch(() => {
        if (!cancelled) setMemberError(t.memberLoadError)
      })
      .finally(() => {
        if (!cancelled) setMembersLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [authUser, t.memberLoadError, token])

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLocaleLowerCase()
    if (!term) return members
    return members.filter((member) =>
      `${member.name} ${member.email}`.toLocaleLowerCase().includes(term),
    )
  }, [members, search])

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3000)
  }

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const associationSlug = String(formData.get('associationSlug') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')
    setLoginPending(true)
    setLoginError('')
    try {
      const session = await apiRequest<AuthSession>('/auth/login', undefined, {
        method: 'POST',
        body: JSON.stringify({ associationSlug, email, password }),
      })
      window.sessionStorage.setItem('jamiya-token', session.token)
      setMembersLoading(true)
      setMemberError('')
      setToken(session.token)
      setAuthUser(session.user)
    } catch (error) {
      setLoginError(
        error instanceof ApiError && error.status > 0
          ? t.invalidCredentials
          : t.apiUnavailable,
      )
    } finally {
      setLoginPending(false)
    }
  }

  const signOut = async () => {
    try {
      if (token) await apiRequest('/auth/logout', token, { method: 'POST' })
    } catch {
      setLoginError(t.apiUnavailable)
    } finally {
      window.sessionStorage.removeItem('jamiya-token')
      setToken('')
      setAuthUser(null)
      setMembers([])
      setMembersLoading(false)
      setSection('dashboard')
    }
  }

  const saveMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) return
    const formData = new FormData(event.currentTarget)
    const memberDetails = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      status: String(formData.get('status') ?? 'active'),
      membershipStartsAt: String(formData.get('membershipStartsAt') ?? '') || null,
      membershipEndsAt: String(formData.get('membershipEndsAt') ?? '') || null,
    }
    setFormError('')
    try {
      if (editingMember) {
        const updated = await apiRequest<Member>(
          `/members/${encodeURIComponent(editingMember.id)}`,
          token,
          { method: 'PATCH', body: JSON.stringify(memberDetails) },
        )
        setMembers((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        )
        showToast(t.memberUpdated)
      } else {
        const created = await apiRequest<Member>('/members', token, {
          method: 'POST',
          body: JSON.stringify(memberDetails),
        })
        setMembers((current) => [created, ...current])
        showToast(t.memberAdded)
      }
      setIsAddOpen(false)
      setEditingMember(null)
    } catch (error) {
      setFormError(
        error instanceof ApiError && error.status === 409
          ? t.duplicateEmail
          : t.memberSaveError,
      )
    }
  }

  const deleteMember = async (member: Member) => {
    if (!token || !window.confirm(t.deleteConfirmation)) return
    setMemberError('')
    try {
      await apiRequest(`/members/${encodeURIComponent(member.id)}`, token, {
        method: 'DELETE',
      })
      setMembers((current) => current.filter((item) => item.id !== member.id))
      showToast(t.memberDeleted)
    } catch {
      setMemberError(t.memberSaveError)
    }
  }

  const toggleEventStatus = (id: keyof EventStatuses) => {
    setEventStatuses((current) => ({
      ...current,
      [id]: current[id] === 'draft' ? 'published' : 'draft',
    }))
  }

  const sectionTitle = (key: Section) => {
    const labels: Record<Section, keyof typeof copy.en> = {
      dashboard: 'dashboard',
      members: 'allMembers',
      events: 'allEvents',
      volunteers: 'volunteersTitle',
      documents: 'documentsTitle',
      finance: 'financeTitle',
      reports: 'reportsTitle',
    }
    return t[labels[key]]
  }

  const sectionDescription = (key: Section) => {
    const labels: Partial<Record<Section, keyof typeof copy.en>> = {
      members: 'manageMembers',
      events: 'eventsDescription',
      volunteers: 'volunteersDescription',
      documents: 'documentsDescription',
      finance: 'financeDescription',
      reports: 'reportsDescription',
    }
    const label = labels[key]
    return label ? t[label] : t.welcomeNote
  }

  const chooseSection = (id: Section) => {
    setSection(id)
    setMobileNavOpen(false)
    setSearch('')
  }

  const today = new Intl.DateTimeFormat(
    locale === 'ar' ? 'ar-TN' : locale === 'fr' ? 'fr-TN' : 'en-TN',
    { weekday: 'long', day: 'numeric', month: 'long' },
  ).format(new Date())
  const canManageMembers =
    authUser?.role === 'president' || authUser?.role === 'administrator'
  const activeMemberCount = members.filter((member) => member.status === 'active').length

  if (authLoading) {
    return <div className="auth-loading" aria-live="polite">{t.loadingMembers}</div>
  }
  if (!authUser) {
    return (
      <LoginScreen
        t={t}
        locale={locale}
        isRtl={isRtl}
        error={loginError}
        pending={loginPending}
        onLocaleChange={setLocale}
        onSubmit={signIn}
      />
    )
  }

  return (
    <div className={`app-shell${mobileNavOpen ? ' nav-open' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {mobileNavOpen && (
        <button
          className="mobile-scrim"
          aria-label={t.close}
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <aside className="sidebar" aria-label={t.association}>
        <a className="brand" href="#dashboard" onClick={(event) => { event.preventDefault(); chooseSection('dashboard') }}>
          <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
          <span className="brand-copy">
            <strong>jamiya</strong>
            <small>{t.association}</small>
          </span>
        </a>

        <div className="association-switcher">
          <span className="association-seal" aria-hidden="true">ن</span>
          <span className="association-name">
            <strong>{authUser.associationName}</strong>
            <small>{t.siteLabel}</small>
          </span>
          <Icon name="chevron" size={15} />
        </div>

        <nav className="side-nav" aria-label={t.overview}>
          {navGroups.map((group) => (
            <div className="nav-group" key={group.heading}>
              <p className="nav-heading">{t[group.heading]}</p>
              {group.items.map((item) => (
                <button
                  className={`nav-link${section === item.id ? ' is-active' : ''}`}
                  key={item.id}
                  onClick={() => chooseSection(item.id)}
                  aria-current={section === item.id ? 'page' : undefined}
                >
                  <Icon name={item.icon} size={18} />
                  <span>{t[item.label]}</span>
                  {item.id === 'volunteers' && <span className="nav-count">4</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="note-spark" aria-hidden="true">✳</span>
            <p>« La solidarité est la tendresse des peuples. »</p>
            <small>— Gioconda Belli</small>
          </div>
          <button className="profile-button sign-out-button" onClick={signOut}>
            <span className="profile-avatar">{authUser.name.split(/\s+/).map((part) => part[0]?.toUpperCase()).slice(0, 2).join('')}</span>
            <span className="profile-copy"><strong>{authUser.name}</strong><small>{roleLabel(authUser.role, t)}</small></span>
            <span className="sign-out-label">{t.signOut}</span>
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            aria-label={t.overview}
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            <Icon name={mobileNavOpen ? 'close' : 'menu'} />
          </button>
          <div className="breadcrumb"><span>{authUser.associationName}</span><span className="breadcrumb-separator">/</span><strong>{sectionTitle(section)}</strong></div>
          <div className="topbar-actions">
            <label className="search-box">
              <Icon name="search" size={17} />
              <input
                aria-label={t.search}
                placeholder={t.search}
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  if (event.target.value) setSection('members')
                }}
              />
              <kbd>⌘ K</kbd>
            </label>
            <div className="language-switch" role="group" aria-label={t.language}>
              {(['fr', 'en', 'ar'] as const).map((language) => (
                <button
                  key={language}
                  className={locale === language ? 'selected' : ''}
                  aria-pressed={locale === language}
                  onClick={() => setLocale(language)}
                >
                  {language.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="notification-wrap">
              <button
                className={`icon-button notification-button${noticeOpen ? ' pressed' : ''}`}
                aria-label={t.notifications}
                aria-expanded={noticeOpen}
                onClick={() => setNoticeOpen((open) => !open)}
              >
                <Icon name="bell" size={19} />
              </button>
              {noticeOpen && (
                <div className="notification-popover">
                  <div className="popover-icon"><Icon name="check" size={19} /></div>
                  <strong>{t.notificationTitle}</strong>
                  <p>{t.notificationText}</p>
                  <button onClick={() => setNoticeOpen(false)}>{t.close}</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="page-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-rule" /> {section === 'dashboard' ? t.today : t.association}</div>
              <h1>{section === 'dashboard' ? `${t.greeting}, ${authUser.name.split(/\s+/)[0]}` : sectionTitle(section)}</h1>
              <p className="page-subtitle">{section === 'dashboard' ? t.welcomeNote : sectionDescription(section)}</p>
            </div>
            <div className="heading-actions">
              {section === 'dashboard' && <span className="date-chip"><Icon name="calendar" size={15} />{today}</span>}
              {canManageMembers && (section === 'dashboard' || section === 'members') && (
                <button className="button-primary" onClick={() => { setFormError(''); setEditingMember(null); setIsAddOpen(true) }}>
                  <Icon name="plus" size={17} />{t.addMember}
                </button>
              )}
            </div>
          </div>

          {section === 'dashboard' && (
            <>
              <section className="stat-grid" aria-label={t.overview}>
                <StatCard label={t.activeMembers} value={String(activeMemberCount)} change="" icon="users" tone="green" footnote={t.membersLabel} />
                <StatCard label={t.upcomingEvents} value="06" change="+2" icon="calendar" tone="amber" footnote={t.thisMonth} />
                <StatCard label={t.volunteerHours} value="184" change="+18%" icon="heart" tone="clay" footnote={t.compared} />
                <article className="stat-card stat-highlight">
                  <div className="stat-topline"><span>{t.membersLabel}</span><span className="highlight-seal">ن</span></div>
                  <strong className="stat-value">{members.length}</strong>
                  <div className="stat-bottom"><span className="stat-change">+8.4%</span><span>{t.compared}</span></div>
                  <div className="mini-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
                </article>
              </section>

              <section className="dashboard-grid">
                <article className="panel activity-panel">
                  <div className="panel-heading">
                    <div><p className="panel-kicker">{t.thisMonth}</p><h2>{t.memberActivity}</h2><p className="panel-description">{t.activityNote}</p></div>
                    <button className="text-link" onClick={() => chooseSection('members')}>{t.seeMembers}<Icon name="arrow" size={15} /></button>
                  </div>
                  <div className="chart-legend"><span><i className="legend-dot primary-dot" /> {t.active}</span><span><i className="legend-dot muted-dot" /> {t.pending}</span><span className="chart-total">{members.length} <small>{t.membersLabel.toLocaleLowerCase()}</small></span></div>
                  <MembershipChart locale={locale} />
                </article>

                <article className="event-feature">
                  <div className="event-art">
                    <span className="event-tag"><span /> {t.nextEvent}</span>
                    <div className="garden-illustration" aria-hidden="true">
                      <span className="sun-disc" /><span className="hill hill-back" /><span className="hill hill-front" />
                      <span className="plant plant-one"><i /><i /><b /></span>
                      <span className="plant plant-two"><i /><i /><b /></span>
                      <span className="plant plant-three"><i /><i /><b /></span>
                      <span className="ground-line" />
                    </div>
                    <span className="art-caption">ENSEMBLE, ON CULTIVE</span>
                  </div>
                  <div className="event-info">
                    <p className="event-date-label">{t.eventDate}</p>
                    <h2>{t.eventName}</h2>
                    <p className="event-location"><Icon name="location" size={15} />{t.eventLocation}</p>
                    <div className="event-footer"><span className="seat-progress"><i /></span><span>{t.eventSeats}</span></div>
                    <button className="event-link" onClick={() => chooseSection('events')}>{t.eventAction}<Icon name="arrow" size={15} /></button>
                  </div>
                </article>

                <article className="panel recent-panel">
                  <div className="panel-heading compact-heading">
                    <div><p className="panel-kicker">{t.recentNote}</p><h2>{t.recentMembers}</h2></div>
                    <button className="quiet-link" onClick={() => chooseSection('members')}>{t.viewAll}<Icon name="arrow" size={14} /></button>
                  </div>
                  {membersLoading ? <p className="table-feedback">{t.loadingMembers}</p> : (
                    <MemberTable members={members.slice(0, 4)} t={t} compact onSelect={() => chooseSection('members')} />
                  )}
                </article>

                <article className="panel followup-panel">
                  <div className="panel-heading compact-heading"><div><p className="panel-kicker">{t.thisMonth}</p><h2>{t.tasks}</h2></div><span className="task-count">03</span></div>
                  <button className="followup-row" onClick={() => chooseSection('members')}>
                    <span className="task-icon task-icon-amber"><Icon name="clock" size={17} /></span>
                    <span className="followup-copy"><strong>{t.membershipReview}</strong><small>{t.membershipReviewNote}</small></span>
                    <span className="task-status status-amber">{t.dueSoon}</span>
                  </button>
                  <button className="followup-row" onClick={() => chooseSection('volunteers')}>
                    <span className="task-icon task-icon-green"><Icon name="heart" size={17} /></span>
                    <span className="followup-copy"><strong>{t.applications}</strong><small>{t.applicationsNote}</small></span>
                    <span className="task-status status-green">{t.needsReview}</span>
                  </button>
                  <button className="followup-row" onClick={() => chooseSection('finance')}>
                    <span className="task-icon task-icon-clay"><Icon name="wallet" size={17} /></span>
                    <span className="followup-copy"><strong>{t.financeReview}</strong><small>{t.financeReviewNote}</small></span>
                    <span className="task-status status-clay">{t.newTransaction}</span>
                  </button>
                </article>
              </section>
            </>
          )}

          {section === 'members' && (
            <section className="panel full-panel">
              <div className="panel-heading table-heading">
                <div><p className="panel-kicker">{members.length} {t.memberCount}</p><h2>{t.allMembers}</h2></div>
                <label className="table-search"><Icon name="search" size={16} /><input aria-label={t.search} placeholder={t.search} value={search} onChange={(event) => setSearch(event.target.value)} /></label>
              </div>
              {memberError && <p className="form-error member-feedback" role="alert">{memberError}</p>}
              {membersLoading ? <p className="table-feedback">{t.loadingMembers}</p> : (
                <MemberTable
                  members={filteredMembers}
                  t={t}
                  canManage={canManageMembers}
                  onEdit={(member) => { setEditingMember(member); setFormError(''); setIsAddOpen(true) }}
                  onDelete={deleteMember}
                />
              )}
            </section>
          )}

          {section === 'events' && <EventsView t={t} eventStatuses={eventStatuses} onToggleStatus={toggleEventStatus} />}

          {section === 'volunteers' && (
            <section className="panel full-panel">
              <div className="panel-heading table-heading">
                <div><p className="panel-kicker">{applications.length} {t.needsReview}</p><h2>{t.volunteerApplicationsTitle}</h2></div>
                <span className="soft-tag green-tag">{t.active}</span>
              </div>
              {applications.length ? (
                <div className="table-scroll"><table className="data-table"><thead><tr><th>{t.applicant}</th><th>{t.opportunity}</th><th>{t.date}</th><th>{t.decision}</th></tr></thead><tbody>
                  {applications.map((application) => <tr key={application.name}>
                    <td><PersonCell name={application.name} initials={application.initials} color={application.color} /></td><td>{application.opportunity}</td><td>{application.submitted}</td>
                    <td><div className="row-actions"><button className="small-action accept-action" onClick={() => { setApplications((current) => current.filter((item) => item.name !== application.name)); showToast(t.applicationApproved) }}>{t.approve}</button><button className="small-action decline-action" onClick={() => { setApplications((current) => current.filter((item) => item.name !== application.name)); showToast(t.applicationDeclined) }}>{t.decline}</button></div></td>
                  </tr>)}
                </tbody></table></div>
              ) : <EmptyState message={t.noApplications} />}
            </section>
          )}

          {section === 'documents' && <DocumentsView t={t} />}
          {section === 'finance' && <FinanceView t={t} />}
          {section === 'reports' && <ReportsView t={t} locale={locale} />}

          <footer className="page-footer"><span>JAMIYA <i>✳</i> ASSOCIATION NOUR</span><span>DES COMMUNAUTÉS PLUS FORTES, ENSEMBLE.</span></footer>
        </div>
      </main>

      {isAddOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsAddOpen(false) }}>
          <section className="modal member-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button className="modal-close" aria-label={t.close} onClick={() => { setIsAddOpen(false); setEditingMember(null) }}><Icon name="close" size={18} /></button>
            <div className="modal-mark"><Icon name="users" size={21} /></div>
            <p className="panel-kicker">{t.association}</p>
            <h2 id="modal-title">{editingMember ? t.editMemberTitle : t.addMemberTitle}</h2>
            <p className="modal-description">{t.addMemberDescription}</p>
            <form onSubmit={saveMember}>
              <label>{t.fullName}<input name="name" autoFocus autoComplete="name" required maxLength={120} defaultValue={editingMember?.name} placeholder="e.g. Amira Ben Salem" /></label>
              <label>{t.emailAddress}<input name="email" type="email" autoComplete="email" required maxLength={254} defaultValue={editingMember?.email} placeholder="amira@example.tn" /></label>
              <label>{t.memberStatus}
                <select name="status" defaultValue={editingMember?.status ?? 'active'}>
                  <option value="active">{t.statusActive}</option>
                  <option value="pending">{t.statusPending}</option>
                  <option value="expired">{t.statusExpired}</option>
                </select>
              </label>
              <div className="membership-date-fields">
                <label>{t.membershipStart}<input name="membershipStartsAt" type="date" defaultValue={editingMember?.membershipStartsAt ?? ''} /></label>
                <label>{t.membershipEnd}<input name="membershipEndsAt" type="date" defaultValue={editingMember?.membershipEndsAt ?? ''} /></label>
              </div>
              {formError && <p className="form-error" role="alert">{formError}</p>}
              <div className="modal-actions"><button type="button" className="button-secondary" onClick={() => { setIsAddOpen(false); setEditingMember(null) }}>{t.cancel}</button><button type="submit" className="button-primary">{t.saveMember}<Icon name="arrow" size={15} /></button></div>
            </form>
          </section>
        </div>
      )}
      {toast && <div className="toast" role="status"><span><Icon name="check" size={16} /></span>{toast}</div>}
    </div>
  )
}

function LoginScreen({
  t,
  locale,
  isRtl,
  error,
  pending,
  onLocaleChange,
  onSubmit,
}: {
  t: Translation
  locale: Locale
  isRtl: boolean
  error: string
  pending: boolean
  onLocaleChange: (locale: Locale) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <main className="login-shell" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="login-frame">
        <header className="login-header">
          <a className="brand login-brand" href="/" aria-label="Jamiya">
            <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
            <span className="brand-copy"><strong>jamiya</strong><small>{t.association}</small></span>
          </a>
          <div className="language-switch" role="group" aria-label={t.language}>
            {(['fr', 'en', 'ar'] as const).map((language) => (
              <button
                key={language}
                className={locale === language ? 'selected' : ''}
                aria-pressed={locale === language}
                onClick={() => onLocaleChange(language)}
              >
                {language.toUpperCase()}
              </button>
            ))}
          </div>
        </header>
        <section className="login-panel" aria-labelledby="login-title">
          <p className="panel-kicker">{t.association}</p>
          <h1 id="login-title">{t.loginTitle}</h1>
          <p className="login-description">{t.loginDescription}</p>
          <form onSubmit={onSubmit}>
            <label>
              {t.associationSlug}
              <input name="associationSlug" autoComplete="organization" required defaultValue="association-nour" />
            </label>
            <label>
              {t.emailAddress}
              <input name="email" type="email" autoComplete="username" required maxLength={254} />
            </label>
            <label>
              {t.password}
              <input name="password" type="password" autoComplete="current-password" required maxLength={1024} />
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button type="submit" className="button-primary login-submit" disabled={pending}>
              {pending ? t.signingIn : t.signIn}<Icon name="arrow" size={16} />
            </button>
          </form>
        </section>
        <footer className="login-footer">JAMIYA <i>✳</i> DES COMMUNAUTÉS PLUS FORTES, ENSEMBLE.</footer>
      </div>
    </main>
  )
}

function StatCard({ label, value, change, icon, tone, footnote }: { label: string; value: string; change?: string; icon: IconName; tone: string; footnote: string }) {
  return (
    <article className="stat-card">
      <div className="stat-topline"><span>{label}</span><span className={`stat-icon ${tone}`}><Icon name={icon} size={17} /></span></div>
      <strong className="stat-value">{value}</strong>
      <div className="stat-bottom">{change && <span className="stat-change">{change}</span>}<span>{footnote}</span></div>
      <span className={`stat-decoration decoration-${tone}`} aria-hidden="true" />
    </article>
  )
}

function MembershipChart({ locale }: { locale: Locale }) {
  const labels = locale === 'ar' ? ['ماي', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر'] : locale === 'fr' ? ['MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT'] : ['MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT']
  return (
    <div className="chart-wrap">
      <div className="chart-y-labels"><span>320</span><span>280</span><span>240</span><span>200</span></div>
      <svg className="membership-chart" viewBox="0 0 620 176" role="img" aria-label={locale === 'ar' ? 'نمو العضوية خلال الأشهر الستة الماضية' : locale === 'fr' ? 'Évolution des membres ces six derniers mois' : 'Membership growth over the last six months'}>
        <defs><linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#387662" stopOpacity=".22" /><stop offset="100%" stopColor="#387662" stopOpacity="0" /></linearGradient></defs>
        {[20, 62, 104, 146].map((y) => <line key={y} x1="8" x2="610" y1={y} y2={y} className="chart-grid-line" />)}
        <path d="M10 131 C58 124 70 112 120 118 S188 103 230 107 S288 84 330 94 S390 69 430 77 S490 52 530 63 S579 39 608 32 L608 150 L10 150 Z" fill="url(#areaFill)" />
        <path d="M10 131 C58 124 70 112 120 118 S188 103 230 107 S288 84 330 94 S390 69 430 77 S490 52 530 63 S579 39 608 32" className="chart-line" />
        <circle cx="608" cy="32" r="5" className="chart-last-point" />
        <circle cx="608" cy="32" r="10" className="chart-last-halo" />
      </svg>
      <div className="chart-x-labels">{labels.map((label) => <span key={label}>{label}</span>)}</div>
    </div>
  )
}

function MemberTable({
  members,
  t,
  compact = false,
  onSelect,
  canManage = false,
  onEdit,
  onDelete,
}: {
  members: Member[]
  t: Translation
  compact?: boolean
  onSelect?: () => void
  canManage?: boolean
  onEdit?: (member: Member) => void
  onDelete?: (member: Member) => void
}) {
  if (!members.length) return <EmptyState message={t.emptyMembers} />
  const dateLocale = t === copy.ar ? 'ar-TN' : t === copy.fr ? 'fr-TN' : 'en-TN'
  return (
    <div className={`table-scroll${compact ? ' compact-scroll' : ''}`}>
      <table className="data-table">
        <thead><tr><th>{t.name}</th>{!compact && <th>{t.email}</th>}<th>{t.status}</th><th>{t.joined}</th>{canManage && !compact && <th>{t.actions}</th>}</tr></thead>
        <tbody>{members.map((member) => (
          <tr key={member.id} onClick={onSelect} className={onSelect ? 'clickable-row' : undefined}>
            <td><PersonCell name={member.name} initials={memberInitials(member.name)} email={compact ? member.email : undefined} color={memberColor(member.email)} /></td>
            {!compact && <td className="muted-cell">{member.email}</td>}
            <td><span className={`status-pill ${member.status}`}><i />{t[member.status]}</span></td>
            <td className="muted-cell">{new Intl.DateTimeFormat(dateLocale, { dateStyle: 'medium' }).format(new Date(member.joinedAt))}</td>
            {canManage && !compact && (
              <td>
                <div className="row-actions">
                  <button type="button" className="small-action" aria-label={`${t.edit}: ${member.name}`} onClick={(event) => { event.stopPropagation(); onEdit?.(member) }}>{t.edit}</button>
                  <button type="button" className="small-action decline-action" aria-label={`${t.delete}: ${member.name}`} onClick={(event) => { event.stopPropagation(); onDelete?.(member) }}>{t.delete}</button>
                </div>
              </td>
            )}
          </tr>
        ))}</tbody>
      </table>
    </div>
  )
}

function memberInitials(name: string): string {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('')
}

function PersonCell({ name, initials, email, color }: { name: string; initials: string; email?: string; color: string }) {
  return <span className="person-cell"><span className={`person-avatar avatar-${color}`}>{initials}</span><span className="person-text"><strong>{name}</strong>{email && <small>{email}</small>}</span></span>
}

function EventsView({ t, eventStatuses, onToggleStatus }: { t: Translation; eventStatuses: EventStatuses; onToggleStatus: (id: keyof EventStatuses) => void }) {
  const [eventFilter, setEventFilter] = useState<'all' | 'published' | 'draft'>('all')
  const events = [
    { id: 'garden' as const, name: t.eventName, date: t.eventDate, location: t.eventLocation, attendees: 18, capacity: 30, status: eventStatuses.garden },
    { id: 'cuisine' as const, name: 'Atelier de cuisine du terroir', date: 'Wednesday, 28 October · 16:00', location: 'Maison de la culture, La Marsa', attendees: 22, capacity: 24, status: eventStatuses.cuisine },
    { id: 'assembly' as const, name: 'Assemblée des membres', date: 'Saturday, 7 November · 10:00', location: 'Centre culturel, Tunis', attendees: 0, capacity: 80, status: eventStatuses.assembly },
  ]
  const visibleEvents = eventFilter === 'all' ? events : events.filter((event) => event.status === eventFilter)
  return (
    <section className="panel full-panel">
      <div className="panel-heading table-heading">
        <div><p className="panel-kicker">{events.length} {t.upcoming}</p><h2>{t.allEvents}</h2></div>
        <div className="filter-tabs" role="group" aria-label={t.allStatuses}>
          {(['all', 'published', 'draft'] as const).map((filter) => <button key={filter} className={eventFilter === filter ? 'selected' : ''} aria-pressed={eventFilter === filter} onClick={() => setEventFilter(filter)}>{filter === 'all' ? t.allStatuses : t[filter]}</button>)}
        </div>
      </div>
      <div className="event-list">
        {visibleEvents.map((event, index) => (
          <article className="event-row" key={event.name}>
            <div className={`event-date-block event-date-${index}`}><span>{index === 0 ? '24' : index === 1 ? '28' : '07'}</span><small>{index === 2 ? 'NOV' : 'OCT'}</small></div>
            <div className="event-row-main"><div className="event-row-title"><h3>{event.name}</h3><span className={`soft-tag ${event.status === 'draft' ? 'amber-tag' : 'green-tag'}`}>{event.status === 'draft' ? t.draft : t.published}</span></div><p><Icon name="clock" size={15} />{event.date}</p><p><Icon name="location" size={15} />{event.location}</p></div>
            <div className="event-capacity"><strong>{event.attendees}<small> / {event.capacity}</small></strong><span>{t.attendees}</span><i><b style={{ width: `${event.attendees / event.capacity * 100}%` }} /></i></div>
            <button className="small-action event-status-action" aria-label={`${event.status === 'draft' ? t.publishEvent : t.moveToDraft}: ${event.name}`} onClick={() => onToggleStatus(event.id)}>{event.status === 'draft' ? t.publishEvent : t.moveToDraft}</button>
          </article>
        ))}
      </div>
    </section>
  )
}

function DocumentsView({ t }: { t: Translation }) {
  const docs = [
    { name: 'Statuts de l’association', category: 'Administration', date: '12 Oct 2026', type: 'PDF', color: 'rose' },
    { name: 'Rapport d’activité · 2025', category: 'Rapports', date: '08 Oct 2026', type: 'PDF', color: 'blue' },
    { name: 'Budget prévisionnel', category: 'Finances', date: '02 Oct 2026', type: 'XLS', color: 'sage' },
    { name: 'Convention — Jardins partagés', category: 'Partenariats', date: '26 Sep 2026', type: 'PDF', color: 'ochre' },
  ]
  const [downloaded, setDownloaded] = useState('')
  return (
    <section className="panel full-panel">
      <div className="panel-heading table-heading"><div><p className="panel-kicker">{docs.length} {t.documentsCount}</p><h2>{t.documentsTitle}</h2></div><span className="soft-tag green-tag">{t.association}</span></div>
      <div className="table-scroll"><table className="data-table document-table"><thead><tr><th>{t.name}</th><th>{t.category}</th><th>{t.updated}</th><th>{t.type}</th><th /></tr></thead><tbody>
        {docs.map((doc) => <tr key={doc.name}><td><PersonCell name={doc.name} initials={doc.type} color={doc.color} /></td><td>{doc.category}</td><td className="muted-cell">{doc.date}</td><td><span className={`file-type ${doc.type.toLowerCase()}`}>{doc.type}</span></td><td><button className="download-button" onClick={() => setDownloaded(doc.name)} aria-label={`${t.openDocument}: ${doc.name}`}><Icon name={downloaded === doc.name ? 'check' : 'download'} size={17} /></button></td></tr>)}
      </tbody></table></div>
      {downloaded && <p className="inline-hint">{downloaded} — {t.openDocument}</p>}
    </section>
  )
}

function FinanceView({ t }: { t: Translation }) {
  const [kind, setKind] = useState<'all' | 'income' | 'expense'>('all')
  const transactions = [
    { name: 'Cotisations des membres', date: 'Oct 16, 2026', category: 'Membership', amount: '+ 450.000 TND', type: 'income' },
    { name: 'Matériel de jardinage', date: 'Oct 14, 2026', category: 'Community garden', amount: '− 186.500 TND', type: 'expense' },
    { name: 'Subvention municipale', date: 'Oct 10, 2026', category: 'Grant', amount: '+ 1,200.000 TND', type: 'income' },
    { name: 'Impression des affiches', date: 'Oct 08, 2026', category: 'Communications', amount: '− 72.000 TND', type: 'expense' },
  ]
  const filtered = kind === 'all' ? transactions : transactions.filter((transaction) => transaction.type === kind)
  return (
    <>
      <section className="finance-summary">
        <article className="finance-summary-card income-card"><span>{t.income} · OCT</span><strong>2,840.000 <small>TND</small></strong><i>↗ 12.4%</i></article>
        <article className="finance-summary-card expense-card"><span>{t.expenses} · OCT</span><strong>1,126.500 <small>TND</small></strong><i>↘ 4.2%</i></article>
        <article className="finance-summary-card balance-card"><span>{t.balance}</span><strong>1,713.500 <small>TND</small></strong><p>{t.fiscalNote}</p></article>
      </section>
      <section className="panel full-panel">
        <div className="panel-heading table-heading"><div><p className="panel-kicker">{t.thisMonth}</p><h2>{t.transaction}</h2></div><div className="filter-tabs" role="group" aria-label={t.type}>{(['all', 'income', 'expense'] as const).map((value) => <button key={value} className={kind === value ? 'selected' : ''} onClick={() => setKind(value)}>{value === 'all' ? t.allStatuses : value === 'income' ? t.income : t.expenses}</button>)}</div></div>
        <div className="table-scroll"><table className="data-table"><thead><tr><th>{t.transaction}</th><th>{t.category}</th><th>{t.date}</th><th>{t.amount}</th></tr></thead><tbody>{filtered.map((transaction) => <tr key={transaction.name}><td><strong className="transaction-name">{transaction.name}</strong></td><td>{transaction.category}</td><td className="muted-cell">{transaction.date}</td><td className={`money ${transaction.type}`}>{transaction.amount}</td></tr>)}</tbody></table></div>
      </section>
    </>
  )
}

function ReportsView({ t, locale }: { t: Translation; locale: Locale }) {
  return (
    <section className="reports-grid">
      <article className="panel report-panel"><p className="panel-kicker">{t.memberGrowthNote}</p><h2>{t.reportMembers}</h2><MembershipChart locale={locale} /><div className="report-footer"><strong>312</strong><span>+8.4% · {t.compared}</span></div></article>
      <article className="panel report-panel"><p className="panel-kicker">{t.thisMonth}</p><h2>{t.reportEvents}</h2><div className="report-big-number">06 <span>{t.upcoming}</span></div><div className="event-bars"><i style={{ height: '42%' }} /><i style={{ height: '68%' }} /><i style={{ height: '55%' }} /><i style={{ height: '86%' }} /><i style={{ height: '62%' }} /><i style={{ height: '100%' }} /></div><div className="chart-x-labels"><span>MAI</span><span>JUIN</span><span>JUIL</span><span>AOÛT</span><span>SEPT</span><span>OCT</span></div></article>
      <article className="panel report-panel report-wide"><p className="panel-kicker">{t.thisMonth}</p><h2>{t.eventDistribution}</h2><p className="panel-description">{t.reportParticipation}</p><div className="participation-list">{[['Community garden', '78%', 'green'], ['Ateliers culturels', '64%', 'amber'], ['Soutien scolaire', '52%', 'clay']].map(([name, value, color]) => <div className="participation-row" key={name}><span>{name}</span><i className={`participation-track ${color}`}><b style={{ width: value }} /></i><strong>{value}</strong></div>)}</div></article>
    </section>
  )
}

function EmptyState({ message }: { message: string }) {
  return <div className="empty-state"><span><Icon name="search" size={20} /></span><p>{message}</p></div>
}

export default App
