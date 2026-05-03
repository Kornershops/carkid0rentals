import { MOCK_FLEET } from "@/data/mock-fleet";
import VehicleDetailClient from "./vehicle-detail";

// Pre-render all vehicle pages at build time for static export
export function generateStaticParams() {
  return MOCK_FLEET.map((v) => ({ id: v.id }));
}

export default function VehicleDetailsPage() {
  return <VehicleDetailClient />;
}
