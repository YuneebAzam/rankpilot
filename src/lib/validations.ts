import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const createWorkspaceSchema = z.object({
  name: z.string().min(2, "Workspace name is too short").max(60),
});
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;

export const createSiteSchema = z.object({
  name: z.string().min(2, "Site name is too short").max(80),
  url: z.string().url("Enter a valid URL (including https://)"),
  industry: z.string().max(80).optional().or(z.literal("")),
  audience: z.string().max(200).optional().or(z.literal("")),
});
export type CreateSiteInput = z.infer<typeof createSiteSchema>;

// All fields optional — used for partial brand-voice updates.
export const updateSiteSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  url: z.string().url("Enter a valid URL").optional(),
  industry: z.string().max(80).optional().or(z.literal("")),
  audience: z.string().max(200).optional().or(z.literal("")),
  tone: z.string().max(200).optional().or(z.literal("")),
  guidelines: z.string().max(2000).optional().or(z.literal("")),
  bannedWords: z.string().max(500).optional().or(z.literal("")),
  preferredCta: z.string().max(120).optional().or(z.literal("")),
});
export type UpdateSiteInput = z.infer<typeof updateSiteSchema>;

export const inviteMemberSchema = z.object({
  workspaceId: z.string().min(1),
  email: z.string().email("Enter a valid email"),
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
});
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
