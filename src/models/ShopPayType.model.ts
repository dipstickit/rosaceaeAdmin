export interface ShopPayType {
  userId: number;
  shopPayId: number;
  email: string;
  accountName: string;
  bankName: string;
  bankAccountNumber: string;
  money: number;
  status: boolean;
}

export interface ShopPayTypeResponse {
  content: ShopPayType[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
