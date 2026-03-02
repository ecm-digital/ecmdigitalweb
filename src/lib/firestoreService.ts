'use client';

import { db, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    limit,
    where,
    onSnapshot,
    Timestamp,
    serverTimestamp,
} from 'firebase/firestore';

// ─── Types ───────────────────────────────────────────────────

export interface Project {
    id: string;
    userId?: string;
    title: string;
    status: 'Planowanie' | 'W trakcie' | 'Testowanie' | 'Ukończone';
    progress: number;
    color: string;
    createdAt: Timestamp;
}

export interface UserFile {
    id: string;
    userId?: string;
    projectId?: string;
    name: string;
    size: string;
    type: 'PDF' | 'XLS' | 'IMG' | 'DOC' | 'OTHER';
    url: string;
    createdAt: Timestamp;
}

export interface UserStats {
    activeProjects: number;
    completedTasks: number;
    cooperationMonths: number;
    investmentValue: number;
    videoUrl?: string;
    videoTitle?: string;
}

// ─── CRM Types ───────────────────────────────────────────────

export type ClientStatus = 'Lead' | 'Prospekt' | 'Klient' | 'VIP';

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    status: ClientStatus;
    notes: string;
    value: number;
    source: string;
    service?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface AgencyService {
    title: string;
    description: string;
    icon?: string;
}

export interface AgencyProduct {
    name: string;
    description: string;
    price: string;
    link?: string;
}

export interface GoogleAdsConfig {
    clientId: string;
    clientSecret: string;
    developerToken: string;
    refreshToken: string;
    customerId: string;
}

export interface AgencySettings {
    agencyName: string;
    tagline: string;
    logoUrl?: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    socialLinks: {
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        twitter?: string;
    };
    services?: AgencyService[];
    products?: AgencyProduct[];
    googleAds?: GoogleAdsConfig;
    updatedAt: Timestamp;
}

export type OfferStatus = 'Robocza' | 'Wysłana' | 'Zaakceptowana' | 'Odrzucona';

export interface OfferItem {
    service: string;
    description: string;
    price: number;
}

export interface Offer {
    id: string;
    clientId: string;
    clientName: string;
    title: string;
    status: OfferStatus;
    totalPrice: number;
    items: OfferItem[];
    validUntil: string;
    notes: string;
    createdAt: Timestamp;
    videoUrl?: string;
}

export type CampaignStatus = 'Planowana' | 'Aktywna' | 'Wstrzymana' | 'Zakończona';

export interface Campaign {
    id: string;
    name: string;
    platform: string;
    status: CampaignStatus;
    budget: number;
    spent: number;
    clicks: number;
    conversions: number;
    cpa: number;
    clientId: string;
    clientName: string;
    startDate: string;
    endDate: string;
    externalId?: string; // Google Ads Campaign ID
    lastSync?: Timestamp;
    createdAt: Timestamp;
}

export type KanbanColumn = 'todo' | 'inprogress' | 'review' | 'done';

export interface KanbanTask {
    id: string;
    title: string;
    description: string;
    column: KanbanColumn;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    clientId?: string;
    clientName: string;
    deadline?: string;
    createdAt: Timestamp;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'lead' | 'offer' | 'payment';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    read: boolean;
    link?: string;
    createdAt: Timestamp;
}

export interface Meeting {
    id: string;
    title: string;
    date: string;
    time: string;
    clientId?: string;
    clientName?: string;
    type: 'call' | 'video' | 'meeting';
    duration: number;
    notes: string;
    createdAt: Timestamp;
}

export interface ServiceData {
    id: string;
    slug: string;
    icon: string;
    gradient: string;
    features: string[];
    techs: string[];
    price: string;
    internalKnowledge?: string;
    translations: {
        pl: {
            title: string;
            subtitle: string;
            long: string;
            features: string[];
            metaTitle?: string;
            metaDescription?: string;
        };
        en?: {
            title: string;
            subtitle: string;
            long: string;
            features: string[];
            metaTitle?: string;
            metaDescription?: string;
        };
    };
    updatedAt: Timestamp;
}

export interface CaseStudyStat {
    value: string;
    label: string;
}

export interface CaseStudyTestimonial {
    quote: string;
    author: string;
    role: string;
}

export interface CaseStudy {
    id: string;
    slug: string;
    color: string;
    coverImage?: string;
    image?: string;         // legacy
    featured?: boolean;
    order?: number;
    year?: string;
    duration?: string;
    translations: {
        [lang: string]: {
            category: string;
            title: string;
            client?: string;
            industry?: string;
            description: string;
            challenge?: string;
            solution?: string;
            results?: string;
            resultsStats?: CaseStudyStat[];
            technologies?: string[];
            testimonial?: CaseStudyTestimonial;
            metaTitle?: string;
            metaDescription?: string;
        };
    };
    updatedAt: Timestamp;
}

// ─── Communication Types ─────────────────────────────────────

export interface Comment {
    id: string;
    parentId: string; // Project ID or Offer ID
    userId: string;
    userName: string;
    userRole: 'client' | 'agent';
    text: string;
    createdAt: Timestamp;
}

export type TicketStatus = 'Otwarty' | 'W trakcie' | 'Oczekuje' | 'Zamknięty';
export type TicketPriority = 'Niski' | 'Normalny' | 'Wysoki' | 'Krytyczny';

export interface SupportTicket {
    id: string;
    userId: string;
    clientName: string;
    subject: string;
    message: string;
    status: TicketStatus;
    priority: TicketPriority;
    reply?: string;
    repliedAt?: any;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// ─── User Dashboard Functions ───────────────────────────────

export async function getUserProjects(userId: string): Promise<Project[]> {
    const q = query(collection(db, 'user_projects'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
}

export async function getUserFiles(userId: string): Promise<UserFile[]> {
    const q = query(collection(db, 'user_files'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserFile));
}

export async function getProjectFiles(projectId: string): Promise<UserFile[]> {
    const q = query(collection(db, 'user_files'), where('projectId', '==', projectId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserFile));
}

export async function uploadProjectFile(projectId: string, file: File, userId: string = 'admin'): Promise<UserFile> {
    const storageRef = ref(storage, `project_files/${projectId}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    let type: 'PDF' | 'XLS' | 'IMG' | 'DOC' | 'OTHER' = 'OTHER';
    if (file.type.includes('pdf')) type = 'PDF';
    else if (file.type.includes('image')) type = 'IMG';
    else if (file.type.includes('sheet') || file.type.includes('excel')) type = 'XLS';
    else if (file.type.includes('word') || file.type.includes('document')) type = 'DOC';

    const fileData: Omit<UserFile, 'id' | 'createdAt'> = {
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type,
        url,
        projectId,
        userId
    };

    const docRef = await addDoc(collection(db, 'user_files'), {
        ...fileData,
        createdAt: serverTimestamp()
    });

    return {
        id: docRef.id,
        ...fileData,
        createdAt: Timestamp.now()
    } as UserFile;
}


export async function getUserStats(userId: string): Promise<UserStats | null> {
    const docRef = doc(db, 'user_stats', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as UserStats : null;
}

export async function getUserOffers(clientId: string): Promise<Offer[]> {
    const q = query(collection(db, 'agency_offers'), where('clientId', '==', clientId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Offer));
}

export async function getUserCampaigns(clientId: string): Promise<Campaign[]> {
    const q = query(collection(db, 'agency_campaigns'), where('clientId', '==', clientId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
}

export async function getProjects(): Promise<Project[]> {
    const q = query(collection(db, 'user_projects'), orderBy('createdAt', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
}

export async function addProject(data: Omit<Project, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'user_projects'), {
        ...data,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<void> {
    await updateDoc(doc(db, 'user_projects', id), data);
}

export async function deleteProject(id: string): Promise<void> {
    await deleteDoc(doc(db, 'user_projects', id));
}

export async function getFiles(): Promise<UserFile[]> {
    const q = query(collection(db, 'user_files'), orderBy('createdAt', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserFile));
}

// ─── Clients CRUD ───────────────────────────────────────────

const CLIENTS = 'agency_clients';

export async function getClients(): Promise<Client[]> {
    const q = query(collection(db, CLIENTS), orderBy('createdAt', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
}

export async function getLeads(): Promise<Client[]> {
    const q = query(collection(db, CLIENTS), where('status', '==', 'Lead'), orderBy('createdAt', 'desc'), limit(20));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
}

export async function getClient(id: string): Promise<Client | null> {
    const docSnap = await getDoc(doc(db, CLIENTS, id));
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Client) : null;
}

export async function getClientsWithStatus(status: ClientStatus): Promise<Client[]> {
    const q = query(collection(db, CLIENTS), where('status', '==', status), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
}

export async function addClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, CLIENTS), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
    return docRef.id;
}

export async function updateClient(id: string, data: Partial<Client>): Promise<void> {
    await updateDoc(doc(db, CLIENTS, id), { ...data, updatedAt: Timestamp.now() });
}

export async function deleteClient(id: string): Promise<void> {
    await deleteDoc(doc(db, CLIENTS, id));
}

export async function addLead(data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    service?: string;
    message: string;
    source: string;
}): Promise<string> {
    const clientId = await addClient({
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        company: data.company || '',
        status: 'Lead',
        notes: data.message,
        value: 0,
        source: data.source,
        service: data.service,
    });

    // Automatically trigger notification for new lead
    await addNotification({
        title: 'Nowy Lead ze strony 🚀',
        message: `Nowe zapytanie od: ${data.name} (${data.source}). Usługa: ${data.service || 'Brak'}`,
        type: 'lead',
        link: `/admin/clients`
    });

    return clientId;
}

// ─── Offers CRUD ─────────────────────────────────────────────

const OFFERS = 'agency_offers';

export async function getOffers(): Promise<Offer[]> {
    const q = query(collection(db, OFFERS), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Offer));
}

export async function addOffer(data: Omit<Offer, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, OFFERS), {
        ...data,
        createdAt: Timestamp.now(),
    });
    return docRef.id;
}

export async function updateOffer(id: string, data: Partial<Offer>): Promise<void> {
    await updateDoc(doc(db, OFFERS, id), data);
}

export async function deleteOffer(id: string): Promise<void> {
    await deleteDoc(doc(db, OFFERS, id));
}

export async function deleteDocById(coll: string, id: string): Promise<void> {
    await deleteDoc(doc(db, coll, id));
}

// ─── Campaigns CRUD ──────────────────────────────────────────

const CAMPAIGNS = 'agency_campaigns';

export async function getCampaigns(): Promise<Campaign[]> {
    const q = query(collection(db, CAMPAIGNS), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
}

export async function addCampaign(data: Omit<Campaign, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, CAMPAIGNS), {
        ...data,
        createdAt: Timestamp.now(),
    });
    return docRef.id;
}

export async function updateCampaign(id: string, data: Partial<Campaign>): Promise<void> {
    await updateDoc(doc(db, CAMPAIGNS, id), data);
}

export async function deleteCampaign(id: string): Promise<void> {
    await deleteDoc(doc(db, CAMPAIGNS, id));
}

// ─── Kanban CRUD ─────────────────────────────────────────────

const KANBAN = 'agency_kanban';

export async function getKanbanTasks(): Promise<KanbanTask[]> {
    const q = query(collection(db, KANBAN), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as KanbanTask));
}

export async function addKanbanTask(data: Omit<KanbanTask, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, KANBAN), {
        ...data,
        createdAt: Timestamp.now(),
    });
    return docRef.id;
}

export async function updateKanbanTask(id: string, data: Partial<KanbanTask>): Promise<void> {
    await updateDoc(doc(db, KANBAN, id), data);
}

export async function deleteKanbanTask(id: string): Promise<void> {
    await deleteDoc(doc(db, KANBAN, id));
}

// ─── Meetings CRUD ───────────────────────────────────────────

const MEETINGS = 'agency_meetings';

export async function getMeetings(): Promise<Meeting[]> {
    const q = query(collection(db, MEETINGS), orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Meeting));
}

export async function addMeeting(data: Omit<Meeting, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, MEETINGS), {
        ...data,
        createdAt: Timestamp.now(),
    });
    return docRef.id;
}

export async function updateMeeting(id: string, data: Partial<Meeting>): Promise<void> {
    await updateDoc(doc(db, MEETINGS, id), data);
}

export async function deleteMeeting(id: string): Promise<void> {
    await deleteDoc(doc(db, MEETINGS, id));
}

// ─── Agency Settings ─────────────────────────────────────────

const SETTINGS = 'agency_settings';

export async function getAgencySettings(): Promise<AgencySettings | null> {
    const docRef = doc(db, SETTINGS, 'global');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as AgencySettings;
    }
    return null;
}

export async function updateAgencySettings(data: Partial<AgencySettings>): Promise<void> {
    const docRef = doc(db, SETTINGS, 'global');
    await setDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
    }, { merge: true });
}

// ─── Agency Services CRUD ────────────────────────────────────

const AGENCY_SERVICES = 'agency_services';

export async function getAgencyServices(): Promise<ServiceData[]> {
    const q = query(collection(db, AGENCY_SERVICES), orderBy('slug', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceData));
}

export async function getAgencyService(slug: string): Promise<ServiceData | null> {
    const q = query(collection(db, AGENCY_SERVICES), where('slug', '==', slug), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const d = querySnapshot.docs[0];
    return { id: d.id, ...d.data() } as ServiceData;
}

export async function updateAgencyService(id: string, data: Partial<ServiceData>): Promise<void> {
    await updateDoc(doc(db, AGENCY_SERVICES, id), {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

export async function addAgencyService(data: Omit<ServiceData, 'id' | 'updatedAt'>): Promise<string> {
    const docRef = doc(db, AGENCY_SERVICES, data.slug);
    await setDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function deleteAgencyService(id: string): Promise<void> {
    await deleteDoc(doc(db, AGENCY_SERVICES, id));
}

// ─── Case Studies CRUD ────────────────────────────────────────
const CASE_STUDIES = 'agency_case_studies';

export async function getCaseStudies(): Promise<CaseStudy[]> {
    const q = query(collection(db, CASE_STUDIES), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CaseStudy));
}

export async function addCaseStudy(data: Omit<CaseStudy, 'id' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, CASE_STUDIES), {
        ...data,
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function updateCaseStudy(id: string, data: Partial<CaseStudy>): Promise<void> {
    await updateDoc(doc(db, CASE_STUDIES, id), {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteCaseStudy(id: string): Promise<void> {
    await deleteDoc(doc(db, CASE_STUDIES, id));
}

// ─── Seeding ────────────────────────────────────────────────

export async function seedCampaigns(): Promise<void> {
    const campaignsCount = (await getCampaigns()).length;
    if (campaignsCount > 0) return;

    const mockCampaigns: Omit<Campaign, 'id' | 'createdAt'>[] = [
        {
            name: 'Google Ads - Lead Gen Q1',
            platform: 'Google Ads',
            status: 'Aktywna',
            budget: 5000,
            spent: 1250,
            clicks: 850,
            conversions: 42,
            cpa: 29.76,
            clientId: 'system',
            clientName: 'ECM Digital Internal',
            startDate: '2026-01-01',
            endDate: '2026-03-31',
        },
        {
            name: 'Meta Ads - Brand Awareness',
            platform: 'Meta Ads',
            status: 'Planowana',
            budget: 3000,
            spent: 0,
            clicks: 0,
            conversions: 0,
            cpa: 0,
            clientId: 'system',
            clientName: 'ECM Digital Internal',
            startDate: '2026-02-15',
            endDate: '2026-04-15',
        },
        {
            name: 'LinkedIn - B2B Outreach',
            platform: 'LinkedIn Ads',
            status: 'Aktywna',
            budget: 8000,
            spent: 4200,
            clicks: 1200,
            conversions: 18,
            cpa: 233.33,
            clientId: 'system',
            clientName: 'ECM Digital Internal',
            startDate: '2026-01-15',
            endDate: '2026-05-31',
        },
    ];

    for (const campaign of mockCampaigns) {
        await addCampaign(campaign);
    }
}

export async function seedCaseStudies(): Promise<void> {
    const existingCases = await getCaseStudies();

    // Only seed if there are NO case studies at all - never delete existing ones!
    if (existingCases.length > 0) {
        return;
    }

    const realEstateCase: Omit<CaseStudy, 'id' | 'updatedAt'> = {
        slug: 'automatyzacja-nieruchomosci',
        color: '#eab308',
        order: 1,
        featured: true,
        translations: {
            pl: {
                category: 'Agent AI & Automatyzacja',
                title: 'Automatyzacja Leadów dla Agencji Nieruchomości',
                description: 'Wdrożenie inteligentnego asystenta AI, który obsługuje zapytania 24/7, kwalifikuje klientów i automatycznie umawia prezentacje luksusowych apartamentów.',
                results: '400% wzrost umówionych prezentacji'
            },
            en: {
                category: 'AI Agents & Automation',
                title: 'Lead Automation for Real Estate Agency',
                description: 'Implementation of a smart AI assistant that handles inquiries 24/7, qualifies clients, and automatically schedules luxury apartment viewings.',
                results: '400% increase in scheduled viewings'
            }
        }
    };

    console.log('[Seed] No case studies found, seeding initial Real Estate case...');
    await addCaseStudy(realEstateCase);
}

export async function seedUserData(userId: string, clientName: string): Promise<void> {
    const projects = await getUserProjects(userId);
    if (projects.length > 0) return;

    // Create client record in agency_clients
    await setDoc(doc(db, 'agency_clients', userId), {
        name: clientName,
        email: '',
        phone: '',
        company: '',
        status: 'Klient',
        notes: 'Nowy użytkownik platformy',
        value: 0,
        source: 'Własny',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    await setDoc(doc(db, 'user_stats', userId), {
        activeProjects: 2,
        completedTasks: 12,
        cooperationMonths: 6,
        investmentValue: 45000,
        updatedAt: serverTimestamp(),
    });

    const mockProjects: Omit<Project, 'id' | 'createdAt'>[] = [
        { title: 'Kampania Google Ads - Q1', status: 'W trakcie', progress: 65, color: '#3b82f6', userId } as any,
        { title: 'Rebranding Firmy', status: 'Planowanie', progress: 20, color: '#8b5cf6', userId } as any,
    ];

    for (const p of mockProjects) {
        await addDoc(collection(db, 'user_projects'), { ...p, createdAt: Timestamp.now() });
    }

    const mockFiles: Omit<UserFile, 'id' | 'createdAt'>[] = [
        { name: 'Raport Styczeń.pdf', size: '2.4 MB', type: 'PDF', url: '#', userId } as any,
        { name: 'Strategia Marki.pdf', size: '5.1 MB', type: 'PDF', url: '#', userId } as any,
        { name: 'Logo_Final.png', size: '1.2 MB', type: 'IMG', url: '#', userId } as any,
    ];

    for (const f of mockFiles) {
        await addDoc(collection(db, 'user_files'), { ...f, createdAt: Timestamp.now() });
    }
}

// Notifications
export async function addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'notifications'), {
        ...notification,
        read: false,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function getNotifications(limitCount: number = 20): Promise<Notification[]> {
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
}

export async function markNotificationRead(id: string): Promise<void> {
    const docRef = doc(db, 'notifications', id);
    await updateDoc(docRef, { read: true });
}
// ─── Communication Functions ─────────────────────────────────

export async function addComment(comment: Omit<Comment, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'portal_comments'), {
        ...comment,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function getComments(parentId: string): Promise<Comment[]> {
    const q = query(
        collection(db, 'portal_comments'),
        where('parentId', '==', parentId),
        orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
}

export function subscribeToComments(parentId: string, callback: (comments: Comment[]) => void) {
    const q = query(
        collection(db, 'portal_comments'),
        where('parentId', '==', parentId),
        orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
        const comments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Comment));
        callback(comments);
    });
}
// ─── AI Assistant Persistence ────────────────────────────────
const AI_CHATS = 'ai_chats';
const AI_FEEDBACK = 'ai_feedback';

export async function saveAIChatMessage(data: {
    sessionId: string;
    role: 'user' | 'bot';
    text: string;
    lang: string;
    userId?: string;
}): Promise<string> {
    const docRef = await addDoc(collection(db, AI_CHATS), {
        ...data,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function submitAIFeedback(data: {
    messageId: string;
    sessionId: string;
    helpful: boolean;
    userId?: string;
}): Promise<string> {
    const docRef = await addDoc(collection(db, AI_FEEDBACK), {
        ...data,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function getAIChatHistory(sessionId: string, limitCount: number = 10): Promise<any[]> {
    const q = query(
        collection(db, AI_CHATS),
        where('sessionId', '==', sessionId),
        orderBy('createdAt', 'asc'),
        limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getLatestAISessions(limitCount: number = 20): Promise<any[]> {
    const q = query(
        collection(db, AI_CHATS),
        orderBy('createdAt', 'desc'),
        limit(limitCount * 5) // Fetch more to allow grouping
    );
    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Group by sessionId
    const sessionsMap: Record<string, any> = {};
    messages.forEach((m: any) => {
        if (!sessionsMap[m.sessionId]) {
            sessionsMap[m.sessionId] = {
                sessionId: m.sessionId,
                lastMessage: m.text,
                lastActivity: m.createdAt,
                lang: m.lang,
                messageCount: 0
            };
        }
        sessionsMap[m.sessionId].messageCount++;
    });

    return Object.values(sessionsMap).slice(0, limitCount);
}

export async function getAIFeedbackStats(): Promise<any[]> {
    const q = query(collection(db, AI_FEEDBACK), orderBy('createdAt', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ─── AIOS Activity Log (Unified) ─────────────────────────────

const AIOS_LOG = 'ai_chat_logs';

export interface AIOSLogEntry {
    source: 'chatbot' | 'admin-assistant' | 'offer-intelligence' | 'meeting-intelligence' | 'daily-brief' | 'system';
    role: 'user' | 'bot' | 'system';
    text: string;
    lang: string;
    userId?: string;
    sessionId?: string;
    metadata?: Record<string, any>;
    createdAt?: any;
}

export async function logAIOSActivity(entry: Omit<AIOSLogEntry, 'createdAt'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, AIOS_LOG), {
            ...entry,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (e) {
        console.error('[AIOS Log] Error:', e);
        return '';
    }
}

export async function getAIOSLogs(hours: number = 24, limitCount: number = 100): Promise<AIOSLogEntry[]> {
    try {
        const since = Timestamp.fromDate(new Date(Date.now() - hours * 60 * 60 * 1000));
        const q = query(
            collection(db, AIOS_LOG),
            where('createdAt', '>=', since),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
    } catch (e) {
        console.error('[AIOS Log] Fetch error:', e);
        return [];
    }
}

// ─── Support System ──────────────────────────────────────────

const TICKETS = 'agency_support_tickets';

export async function getSupportTickets(): Promise<SupportTicket[]> {
    const q = query(collection(db, TICKETS), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket));
}

export async function getUserSupportTickets(userId: string): Promise<SupportTicket[]> {
    const q = query(collection(db, TICKETS), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket));
}

export async function addSupportTicket(data: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, TICKETS), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
    return docRef.id;
}

export async function updateSupportTicket(id: string, data: Partial<SupportTicket>): Promise<void> {
    await updateDoc(doc(db, TICKETS, id), {
        ...data,
        updatedAt: serverTimestamp()
    });
}

export async function deleteSupportTicket(id: string): Promise<void> {
    await deleteDoc(doc(db, TICKETS, id));
}

// ─── Context OS (AIOS Core) ─────────────────────────────────

const CONTEXT_OS = 'context_os';

export interface ContextOSData {
    toneOfVoice: string;
    sops: string;
    businessGoals: string;
    meetingNotes: string;
    customInstructions: string;
    updatedAt?: any;
}

const DEFAULT_CONTEXT: ContextOSData = {
    toneOfVoice: `ECM Digital komunikuje się profesjonalnie ale przyjaźnie. Używamy języka korzyści. Unikamy żargonu technicznego w rozmowach z klientami. Jesteśmy ekspertami AI i automatyzacji w regionie DACH i Polsce.`,
    sops: `1. Nowy Lead → Odpowiedź w ciągu 2h\n2. Oferta → Tworzenie kalkulacji w AdminPanel → Wysyłka PDF\n3. Reklamacja → Bilet Support → Priorytet wysoki\n4. Case Study → Po zakończeniu projektu, klient potwierdza dane`,
    businessGoals: `Q1 2026: 15 nowych klientów, 200k PLN przychodu\nQ2 2026: Uruchomienie SaaS dla klientów\nRoczny cel: 800k PLN, 50 klientów aktywnych`,
    meetingNotes: '',
    customInstructions: '',
};

export async function getContextOS(): Promise<ContextOSData> {
    const docRef = doc(db, CONTEXT_OS, 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as ContextOSData;
    }
    // Seed defaults
    await setDoc(docRef, { ...DEFAULT_CONTEXT, updatedAt: serverTimestamp() });
    return DEFAULT_CONTEXT;
}

export async function saveContextOS(data: Partial<ContextOSData>): Promise<void> {
    const docRef = doc(db, CONTEXT_OS, 'main');
    await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

// ─── Testimonials ─────────────────────────────────────────────

const TESTIMONIALS = 'testimonials';

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    text: string;
    order?: number;
    active?: boolean;
    createdAt?: any;
}

export async function getTestimonials(): Promise<Testimonial[]> {
    const q = query(collection(db, TESTIMONIALS), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
}

export async function addTestimonial(data: Omit<Testimonial, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, TESTIMONIALS), { ...data, createdAt: serverTimestamp() });
    return docRef.id;
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>): Promise<void> {
    await updateDoc(doc(db, TESTIMONIALS, id), data);
}

export async function deleteTestimonial(id: string): Promise<void> {
    await deleteDoc(doc(db, TESTIMONIALS, id));
}

// ─── Blog Preview (featured posts on homepage) ────────────────

const BLOG_POSTS = 'blog_posts';

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    icon: string;
    color: string;
    featured?: boolean;
    order?: number;
    createdAt?: any;
}

export async function getFeaturedBlogPosts(limitCount: number = 3): Promise<BlogPost[]> {
    const q = query(
        collection(db, BLOG_POSTS),
        where('featured', '==', true),
        orderBy('order', 'asc'),
        limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
}

export async function addBlogPost(data: Omit<BlogPost, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, BLOG_POSTS), { ...data, createdAt: serverTimestamp() });
    return docRef.id;
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<void> {
    await updateDoc(doc(db, BLOG_POSTS, id), data);
}

export async function deleteBlogPost(id: string): Promise<void> {
    await deleteDoc(doc(db, BLOG_POSTS, id));
}
