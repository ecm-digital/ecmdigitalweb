'use client';

import { db } from './firebase';
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
    title: string;
    status: 'Planowanie' | 'W trakcie' | 'Testowanie' | 'Ukończone';
    progress: number;
    color: string;
    createdAt: Timestamp;
}

export interface UserFile {
    id: string;
    name: string;
    size: string;
    type: 'PDF' | 'XLS' | 'IMG' | 'DOC';
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
    translations: {
        pl: {
            title: string;
            subtitle: string;
            long: string;
            features: string[];
        };
        en?: {
            title: string;
            subtitle: string;
            long: string;
            features: string[];
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
