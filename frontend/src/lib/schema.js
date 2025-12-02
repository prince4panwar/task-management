import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .nonempty("Email must be required")
    .email("Email is not valid"),
  password: z
    .string()
    .nonempty("Password must be required")
    .min(8, "Password must be at least 8 characters long"),
});

export const registerFormSchema = z.object({
  name: z
    .string()
    .nonempty("Name must be required")
    .min(3, "Name must be at least 3 characters or more"),
  email: z
    .string()
    .nonempty("Email must be required")
    .email("Email is not valid"),
  password: z
    .string()
    .nonempty("Password must be required")
    .min(8, "Password must be at least 8 characters long"),
  pic: z
    .any()
    .optional()
    .refine(
      (file) => !file?.[0] || file?.[0]?.size <= 2 * 1024 * 1024,
      "Max file size is 2MB"
    )
    .refine(
      (file) =>
        !file?.[0] ||
        ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
          file?.[0]?.type
        ),
      "Only .jpg, .jpeg, .png, .webp formats are supported"
    ),
});

export const profileUpdateFormSchema = z.object({
  name: z
    .string()
    .nonempty("Name must be required")
    .min(3, "Name must be at least 3 characters or more"),
  pic: z
    .any()
    .optional()
    .refine(
      (file) => !file?.[0] || file?.[0]?.size <= 2 * 1024 * 1024,
      "Max file size is 2MB"
    )
    .refine(
      (file) =>
        !file?.[0] ||
        ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
          file?.[0]?.type
        ),
      "Only .jpg, .jpeg, .png, .webp formats are supported"
    ),
});

export const createTaskFormSchema = z.object({
  title: z
    .string()
    .nonempty("Title must be required")
    .min(5, "Title must be at least 5 characters long")
    .max(125, "Title must be at most 125 characters long"),
  description: z
    .string()
    .nonempty("Description must be required")
    .min(5, "Description must be at least 5 characters long"),
  status: z.string(),
  image: z
    .any()
    .optional()
    .refine(
      (file) => !file?.[0] || file?.[0]?.size <= 2 * 1024 * 1024,
      "Max file size is 2MB"
    )
    .refine(
      (file) =>
        !file?.[0] ||
        ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
          file?.[0]?.type
        ),
      "Only .jpg, .jpeg, .png, .webp formats are supported"
    ),
});
