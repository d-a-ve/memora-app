export interface PasswordResetResponseType {
  $id: string;
  $createdAt: string;
  userId: string;
  secret: string;
  expire: string;
}
