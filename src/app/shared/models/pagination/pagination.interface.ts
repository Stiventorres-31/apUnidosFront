export interface pagination_interface {
    data: any[];
    links: Links;
    meta: Meta;
    first_page_url?: string;
    last_page_url?: string
    total?: number;
}



export interface Links {
    first: string;
    last: string;
    prev?: string;
    next?: string;
}

export interface Meta {
    current_page: number;
    from: number;
    last_page: number;
    links: Link[];
    path: string;
    total?: number;
    per_page?: number;
    to?: number;
}

export interface Link {
    url: null | string;
    label: string;
    active: boolean;
}