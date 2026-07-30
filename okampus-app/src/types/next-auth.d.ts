import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accèssToken?: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    accèssToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    accèssToken?: string;
  }
}
