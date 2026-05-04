import { OperatingHub } from "@/store/use-store";

export const HUB_DATA: Record<string, OperatingHub[]> = {
  Nigeria: ["Lagos", "Abuja", "Port Harcourt", "Kano", "Kaduna", "Enugu", "Warri"],
  Kenya: ["Nairobi"],
  "South Africa": ["Johannesburg"],
  Ghana: ["Accra"],
  Egypt: ["Cairo"],
};

export const ALL_HUBS = Object.values(HUB_DATA).flat();

export const COUNTRY_LIST = Object.keys(HUB_DATA);
