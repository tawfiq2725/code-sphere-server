import { UserInterface } from "../../domain/interface/User";
import { Person } from "../../domain/entities/User";

import { admin } from "../../firebase";

import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
} from "../../utils/tokenUtility";

export class LoginUser {
  constructor(private userRepository: UserInterface) {}

  public async execute(
    email: string,
    password: string
  ): Promise<{ user: Person; accessToken: string; refreshToken: string }> {
    console.log("email", email);
    console.log("password", password);
    const user = await this.userRepository.findByEmail(email);
    console.log("user", user);
    if (!user) {
      throw new Error("User not found");
    }

    const isBlocked = user.isBlocked;
    if (isBlocked) {
      throw new Error("User is blocked");
    }

    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const payload: TokenPayload = {
      id: user._id || "",
      email: user.email,
      role: user.role,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);

    return { user, accessToken, refreshToken };
  }
}

export class GoogleAuth {
  constructor(private userRepository: UserInterface) {}

  public async execute(idToken: string): Promise<{
    user: Person;
    isNewUser: boolean;
    accessToken?: string;
    refreshToken?: string;
  }> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { email, name, uid, picture } = decodedToken;
      if (!email || !name || !uid) {
        throw new Error("Invalid Google Token");
      }

      let userData: {
        name: string;
        email: string | undefined;
        googleId: string;
        isVerified: boolean;
        profile?: string;
      } = {
        email,
        name,
        googleId: uid,
        isVerified: true,
      };
      if (picture) {
        userData.profile = picture;
      }

      const { user, isNewUser } = await this.userRepository.googleAuthLogin(
        userData
      );
      const payload: TokenPayload = {
        id: user._id || "",
        email: user.email,
        role: user.role,
      };
      if (!isNewUser) {
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        console.log("accessToken", accessToken);
        console.log("refreshToken", refreshToken);
        return { user, isNewUser, accessToken, refreshToken };
      } else {
        console.log("User created successfully. Proceeding to role selection.");
        return { user, isNewUser };
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
      throw new Error("Google Auth Error");
    }
  }
}

export class setRole {
  constructor(private userRepository: UserInterface) {}
  public async execute(
    userId: string,
    role: string
  ): Promise<{ user: Person; accessToken: string; refreshToken: string }> {
    const userData = await this.userRepository.setRole(userId, role);
    if (!userData) {
      throw new Error("User not found");
    }
    const payload: TokenPayload = {
      id: userData._id || "",
      email: userData.email,
      role: userData.role,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);

    return { user: userData, accessToken, refreshToken };
  }
}
