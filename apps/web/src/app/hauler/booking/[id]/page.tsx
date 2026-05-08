import { MOCK_LISTINGS } from "@/data/mock-listings";
import HaulerBookingPage from "./hauler-booking-client";

export function generateStaticParams() {
  return MOCK_LISTINGS.filter(l => l.category === 'heavy-haul').map((v) => ({ id: v.id }));
}

export default function Page() {
  return <HaulerBookingPage />;
}
