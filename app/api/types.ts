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
    fcmToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
    lastLogin?: Date;
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
