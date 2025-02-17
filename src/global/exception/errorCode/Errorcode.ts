export enum ErrorCode {

    //User
    USER_ACCOUNTID_ALREADY_EXIST = 'U001',
    USER_NICKNAME_ALREADY_EXIST = 'U002',
    USER_NOT_FOUND = 'U003',
    USER_INVALID_PASSWROD = 'U004',
    USER_INVALID_PROVINCE = 'U005',
    USER_INVALID_CITY = 'U006',

    // Refresh Token(JWT)
    REFRESH_TOKEN_INVALID = 'JWT001',
    REFRESH_TOKEN_EXPIRED = 'JWT002',

    //Region
    PARENT_REGION_NOT_FOUND = 'R001',
    REGION_NOT_FOUND = 'R002',

    //Board
    BOARD_NOT_FOUND = 'B001',
    BOARD_STATUS_NOT_FOUND = 'B002',
    BOARD_STATUS_FORBIDDEN = 'B003',
    
    //pagination
    PAGE_NOT_EXIST = 'P001',
}