// --- User Types ---

export enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    OTHER = 'Other',
}

export enum RoomStatus {
    HAVE_ROOM = 'I have Room',
    NEED_ROOM = 'I need Room',
}

export interface User {
    uid: string;
    fullName: string;
    phoneNumber: string;
    displayName?: string;
    email?: string;
    age?: number;
    city?: string;
    gender?: Gender;
    roomStatus?: string;
    hometown?: string;
    introduction?: string;
    workSchedule?: string;
    maritalStatus?: string;
    interests?: string[];
    foodHabits?: string;
    smokingHabits?: string;
    drinkingHabits?: string;
    petsPreference?: string;
    roomCleaning?: string;
    guestFrequency?: string;
    partyingFrequency?: string;
    howFastNeedsRoommate?: string;
    howLongNeedsRoommate?: string;
    isActive?: boolean;
    profileCompleted?: boolean;
    profilePictureUrl?: string;
    isPremium?: boolean;
    premiumPlanType?: string;
    premiumExpiryDate?: Date;
    fcmToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
    lastLoginAt?: Date;
}

// --- Room Types ---

export enum UserType {
    TENANT = 'Tenant',
    OWNER = 'Owner',
}

export interface Room {
    id: string;
    userId: string;
    userType: UserType;
    city: string;
    sizeOfPlace: string;
    nearbyLandmark: string;
    rentPerHead: number;
    amenities: string[];
    description: string;
    imageUrls?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

// --- Used Item Types ---

export enum ItemCondition {
    NEW = 'New',
    LIKE_NEW = 'Like new',
    GOOD = 'Good',
    FAIR = 'Fair',
    POOR = 'Poor',
}

export interface UsedItem {
    id: string;
    userId: string;
    brandName: string;
    itemCategory: string;
    itemType: string;
    condition: ItemCondition;
    city: string;
    price: number;
    description: string;
    imageUrls?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

// --- Notification Types ---

export enum NotificationType {
    MESSAGE = 'message',
    ROOM_INQUIRY = 'room_inquiry',
    ROOM_UPDATE = 'room_update',
    SYSTEM = 'system',
}

export interface NotificationData {
    type: NotificationType;
    chatId?: string;
    senderId?: string;
}

export interface Notification {
    id: string;
    receiverId: string;
    title: string;
    body: string;
    data: NotificationData;
    read: boolean;
    createdAt?: Date;
}

// --- Admin Types ---

export interface Admin {
    id: string;
    name: string;
    email: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
    lastLoginAt?: Date;
}

export interface AdminLoginResponse {
    admin: Admin;
    accessToken: string;
    message: string;
}

// --- Report Types ---

export enum ReportStatus {
    PENDING = 'pending',
    REVIEWED = 'reviewed',
    ACTION_TAKEN = 'actionTaken',
    DISMISSED = 'dismissed',
}

export enum ReportType {
    USER = 'user',
    ROOM = 'room',
    ITEM = 'item',
    MESSAGE = 'message',
}

export enum ReportReason {
    INAPPROPRIATE_CONTENT = 'inappropriateContent',
    HARASSMENT = 'harassment',
    SPAM = 'spam',
    FAKE_PROFILE = 'fakeProfile',
    SCAM = 'scam',
    OFFENSIVE_LANGUAGE = 'offensiveLanguage',
    INAPPROPRIATE_PHOTOS = 'inappropriatePhotos',
    OTHER = 'other',
}

export interface Report {
    id: string;
    reporterId: string;
    reporterName?: string;
    type: ReportType;
    targetId: string;
    targetName?: string;
    reason: ReportReason;
    description?: string;
    screenshotUrls?: string[];
    status: ReportStatus;
    adminNotes?: string;
    createdAt?: Date;
    updatedAt?: Date;
    reviewedAt?: Date;
}

// --- Support Types ---

export enum SupportTicketStatus {
    OPEN = 'open',
    IN_PROGRESS = 'inProgress',
    RESOLVED = 'resolved',
    CLOSED = 'closed',
}

export enum SupportCategory {
    ACCOUNT_ISSUE = 'accountIssue',
    TECHNICAL_PROBLEM = 'technicalProblem',
    PAYMENT_ISSUE = 'paymentIssue',
    REPORT_USER = 'reportUser',
    FEATURE_REQUEST = 'featureRequest',
    OTHER = 'other',
}

export interface SupportTicket {
    id: string;
    userId: string;
    userEmail: string;
    userName?: string;
    category: SupportCategory;
    subject: string;
    description: string;
    attachmentUrls?: string[];
    status: SupportTicketStatus;
    adminResponse?: string;
    createdAt?: Date;
    updatedAt?: Date;
    resolvedAt?: Date;
}

// --- Notify Types ---

export interface Notify {
    id: string;
    title: string;
    description?: string;
    createdAt?: Date;
}

export interface CreateNotifyDto {
    title: string;
    description?: string;
}

export interface UpdateNotifyDto {
    title?: string;
    description?: string;
}
