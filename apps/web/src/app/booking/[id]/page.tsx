import { MOCK_LISTINGS } from "@/data/mock-listings";
import BookingPage from "./booking-client";

export function generateStaticParams() {
  return MOCK_LISTINGS.map((v) => ({ id: v.id }));
}

export default function Page() {
  return <BookingPage />;
}
