import { z } from "zod";

export const ucapanSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Ucapan & doa wajib diisi.")
    .max(500, "Ucapan & doa maksimal 500 karakter."),
});

export type UcapanInput = z.infer<typeof ucapanSchema>;
