import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get team data
  const { data: squadra } = await supabase
    .from("squadre")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (!squadra) {
    redirect("/registrazione");
  }

  // Get players
  const { data: giocatori } = await supabase
    .from("giocatori")
    .select("*")
    .eq("squadra_id", squadra.id)
    .order("created_at", { ascending: true });

  // Get results and count
  const { data: risultati } = await supabase
    .from("risultati")
    .select("*")
    .eq("squadra_id", squadra.id);

  const puntiTotali = (risultati || []).reduce((sum, r) => sum + r.punti, 0);
  const tappeGiocate = (risultati || []).length;

  return (
    <DashboardClient
      squadra={squadra}
      giocatori={giocatori || []}
      puntiTotali={puntiTotali}
      tappeGiocate={tappeGiocate}
    />
  );
}
