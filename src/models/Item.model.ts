export interface Item {
    itemId: number;
    itemName: string;
    itemPrice: number;
    itemDescription: string;
    itemRate: number;
    commentCount: number;
    countUsage: number;
    quantity: number;
    discount: number;
};

export interface ResponseData {
    content: Item[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        unpaged: boolean;
        paged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
};
