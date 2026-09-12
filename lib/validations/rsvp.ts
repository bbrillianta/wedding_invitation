import { z } from "zod";

export const ucapanSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi.").max(100, "Nama terlalu panjang."),
  message: z
    .string()
    .trim()
    .min(1, "Ucapan & doa wajib diisi.")
    .max(500, "Ucapan & doa maksimal 500 karakter."),
});

export type UcapanInput = z.infer<typeof ucapanSchema>;
