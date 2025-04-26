import TournamentsClient from "@/app/(authenticated)/tournaments/client";
import Navbar from "@/components/navbar";
import { api, HydrateClient } from "@/trpc/server";

export default async function Tournaments() {
  await api.tournaments.getAll.prefetch()
  return (
    <HydrateClient>
      <Navbar />
      <TournamentsClient />
    </HydrateClient>
  )
}
