import { z } from "zod";

export const createMatchSchema = z.object({
  opponentName: z
    .string()
    .trim()
    .min(1, "Informe o nome do adversário.")
    .max(80, "O nome deve ter no máximo 80 caracteres."),

  firstServer: z.enum(["PLAYER", "OPPONENT"]),
});

export type CreateMatchFormData = z.infer<typeof createMatchSchema>;
