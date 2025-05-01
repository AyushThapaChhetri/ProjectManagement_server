import { Example } from "tsoa";

export class RefreshTokenRequest {
  @Example(
    "8fc59bfb4b3952be60d003d40ec97343bda2b3d3d4600e3c6574f2a0d789696ddf8896bdf29c21a1092d78a884193230a4ee97a2dabb52c972ee605be980d1a2"
  )
  refreshToken!: string;
}

export class RefreshTokenResponseData {
  @Example(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmMTRmNmFiZS0yYWMwLTRjOTYtYWNhYi1iZjEyYmUzN2MzMjgiLCJpYXQiOjE3NDU4MTQxMTUsImV4cCI6MTc0NTgxNTAxNX0.H0R3aIgNavPHuelTMYO7j-UzL3CIB1J9LMctAA9Wubs"
  )
  accessToken!: string;
  @Example(
    "8fc59bfb4b3952be60d003d40ec97343bda2b3d3d4600e3c6574f2a0d789696ddf8896bdf29c21a1092d78a884193230a4ee97a2dabb52c972ee605be980d1a2"
  )
  refreshToken!: string;
}

export class RefreshTokenResponse {
  @Example("Token Refreshed Successfully")
  message!: string;

  data!: RefreshTokenResponseData;

  @Example(200)
  statusCode!: number;
}
