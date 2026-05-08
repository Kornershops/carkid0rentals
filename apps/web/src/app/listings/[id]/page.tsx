import { MOCK_LISTINGS } from "@/data/mock-listings";
import ListingDetailPage from "./listing-client";

export function generateStaticParams() {
  return MOCK_LISTINGS.map((l) => ({ id: l.id }));
}

export default function Page() {
  return <ListingDetailPage />;
}
