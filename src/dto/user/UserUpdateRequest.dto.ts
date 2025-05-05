export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  gender?: string;
  dob?: string; // String in DTO, converted to Date in service
  address?: string;
  phone?: string;
  title?: string;
  avatarUrl?: string;
}
