import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    username: string;
    email: string;
    role: 'user' | 'admin' | 'moderator';
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    total_racism_score?: number;
    flagged_posts_count?: number;
}

export interface Post {
    id: number;
    user_id: number;
    content: string;
    racism_score: number;
    is_approved: boolean;
    is_hidden: boolean;
    likes_count: number;
    views_count: number;
    reports: Report[];
    is_liked_by_user?: boolean; // Optional because it might not always be included
    edited_by_admin: boolean;
    admin_editor_id: number | null;
    admin_edited_at: string | null;
    original_content: string | null;
    created_at: string;
    updated_at: string;
    user: User;
    adminEditor?: User;
}

export interface Report {
    id: number;
    user_id: number;
    post_id: number;
    reason: string;
    reported_by: number;
    is_racism_report: boolean;
    created_at: string;
    updated_at: string;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export interface ReportFormData {
    reason: string;
    is_racism_report: boolean;
}
