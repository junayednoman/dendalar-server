import z from "zod";
import { emailZod, passwordZod } from "../../validation/global.validation";
import { ReferralSource, UserPurpose, UserStatus } from "@prisma/client";

const commonSignupFields = {
  email: emailZod,
  password: passwordZod,
  name: z.string().min(1, "Name is required").trim(),
};

export const userSignUpZod = z.object({
  ...commonSignupFields,
  role: z.literal("USER"),
  purpose: z.enum([
    UserPurpose.BOOST_CAREER,
    UserPurpose.CONNECT_WITH_PEOPLE,
    UserPurpose.HIGHER_EDUCATION,
    UserPurpose.JUST_FOR_FUN,
    UserPurpose.OTHER,
  ]),
  referralSource: z.enum([
    ReferralSource.FACEBOOK,
    ReferralSource.INSTAGRAM,
    ReferralSource.TIKTOK,
    ReferralSource.OTHER,
  ]),
  age: z.coerce.number().int().min(1).max(99).optional(),
});

export type TSignup = z.infer<typeof userSignUpZod>;

export const loginZodSchema = z.object({
  email: emailZod,
  password: passwordZod,
  fcmToken: z.string().optional(),
  isMobileApp: z.boolean().default(false),
});

export type TLoginInput = z.infer<typeof loginZodSchema>;

export const googleLoginSchema = z.object({
  email: emailZod,
  name: z.string(),
  image: z.string(),
  fcmToken: z.string(),
  role: z.enum(["PLAYER", "COACH", "SCOUT", "PARENT"]),
});

export type TGoogleLoginInput = z.infer<typeof googleLoginSchema>;

export const resetPasswordZod = z.object({
  email: emailZod,
  password: passwordZod,
  resetToken: z.string().min(1, "Reset token is required"),
});

export type TResetPasswordInput = z.infer<typeof resetPasswordZod>;

export const changePasswordZod = z.object({
  oldPassword: passwordZod,
  newPassword: passwordZod,
});

export type TChangePasswordInput = z.infer<typeof changePasswordZod>;

export const changeAccountStatusZod = z.object({
  status: z
    .enum([UserStatus.ACTIVE, UserStatus.DELETED, UserStatus.BLOCKED])
    .default("ACTIVE")
    .transform(val => val.toUpperCase()),
});
