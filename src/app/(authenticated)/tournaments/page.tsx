import TournamentsClient from "@/app/(authenticated)/tournaments/client";
import { api, HydrateClient } from "@/trpc/server";

export default async function Tournaments() {
  await api.tournaments.getAll.prefetch()
  return (
    <HydrateClient>
      <TournamentsClient />
    </HydrateClient>
  )
}
