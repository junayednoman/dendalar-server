import z from "zod";

export const mascotFieldNames = [
  "splash1",
  "splash2",
  "splash3",
  "courseBuilding",
  "referralSource",
  "createProfile",
  "avatar",
  "signupSuccess",
  "login",
  "forgetPassword",
  "verificationSuccess",
  "setNewPassword",
  "passwordSaved",
  "levelLocked",
  "questionAvatar",
  "hint",
  "congrats",
  "vocabularyComingSoon",
  "booksComingSoon",
  "editProfile",
] as const;

export const removeMascotFieldZod = z.object({
  field: z.enum(mascotFieldNames),
});

export type TMascotFieldName = (typeof mascotFieldNames)[number];
export type RemoveMascotFieldZod = z.infer<typeof removeMascotFieldZod>;
