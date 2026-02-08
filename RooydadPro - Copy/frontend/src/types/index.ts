export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    phone: string;
    is_organizer: boolean;
    organization: number | null;
}

export interface Organization {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
    theme_color: 'indigo' | 'emerald' | 'rose' | 'amber' | 'blue';
    font_family: string;
}

export interface Instructor {
    id: number;
    name: string;
    expertise: string;
    bio: string;
    image: string | null;
    courses_count: number;
}

export interface Category {
    id: number;
    title: string;
}

export interface Event {
    id: number;
    title: string;
    category_details: Category;
    instructor_details: Instructor | null;
    organization_details: Organization;
    start_datetime: string;
    date_display: string;
    time_display: string;
    is_virtual: boolean;
    location: string | null;
    meeting_link: string | null;
    price: number;
    capacity: number;
    registered_count: number;
    image: string | null;
    description: string;
}

export interface Ticket {
    id: number;
    user: number;
    event: number;
    event_details: Event;
    ticket_code: string;
    status: 'paid' | 'pending' | 'cancelled';
    price_paid: number;
    purchase_date: string;
    is_present: boolean;
}