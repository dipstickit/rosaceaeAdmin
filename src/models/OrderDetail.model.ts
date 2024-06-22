export interface OrderDetail {
    orderDetailId: number;
    quantity: number;
    price: number;
    itemId: number;
    itemName: number;
    customerName: string;
    itemTypeId: number;
}

export interface OrderDetailResponse {
    content: OrderDetail[];
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
}
