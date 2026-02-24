import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SwapRequest {
    id: bigint;
    to: Principal;
    status: SwapRequestStatus;
    from: Principal;
    timestamp: bigint;
}
export interface Message {
    content: string;
    recipient: Principal;
    sender: Principal;
    timestamp: bigint;
}
export interface UserProfile {
    experienceLevel: ExperienceLevel;
    verified: boolean;
    jobRole: string;
    name: string;
    currentCity: string;
    preferredCity: string;
    companyName: string;
    salaryRange: string;
}
export enum ExperienceLevel {
    junior = "junior",
    midLevel = "midLevel",
    senior = "senior"
}
export enum SwapRequestStatus {
    pending = "pending",
    rejected = "rejected",
    accepted = "accepted"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acceptSwapRequest(requestId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    blockUser(user: Principal): Promise<void>;
    findMatches(): Promise<Array<Principal>>;
    getAllConversations(): Promise<Array<Principal>>;
    getAllData(): Promise<[Array<[Principal, UserProfile]>, Array<SwapRequest>, Array<[Principal, Principal, Array<Message>]>]>;
    getAllUsers(): Promise<Array<[Principal, UserProfile]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMessagesWith(recipient: Principal): Promise<Array<Message>>;
    getSwapRequests(): Promise<Array<SwapRequest>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    rejectSwapRequest(requestId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(recipient: Principal, content: string): Promise<void>;
    sendSwapRequest(recipient: Principal): Promise<void>;
    verifyProfile(user: Principal): Promise<void>;
}
