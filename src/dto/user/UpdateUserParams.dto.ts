export interface UpdateUserParams {
  firstName?: string;
  lastName?: string;
  gender?: string;
  address?: string | null;
  phone?: string | null;
  title?: string | null;
  avatarUrl?: string | null;
  dob?: Date;
}
