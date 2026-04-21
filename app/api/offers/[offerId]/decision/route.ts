import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

type Decision = "accept" | "reject";

function isDecision(value: unknown): value is Decision {
  return value === "accept" || value === "reject";
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ offerId: string }> }
) {
  const { offerId } = await context.params;

  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    // ignore
  }

  const decision = (body as { decision?: unknown } | null)?.decision;
  if (!isDecision(decision)) {
    return NextResponse.json(
      { error: 'Missing/invalid "decision" (accept|reject).' },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: offer, error: offerError } = await supabase
    .from("offers")
    .select("id, listing_id, offer_amount")
    .eq("id", offerId)
    .single();

  if (offerError || !offer) {
    return NextResponse.json({ error: "Offer not found." }, { status: 404 });
  }

  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("id, user_id, price")
    .eq("id", offer.listing_id)
    .single();

  if (listingError || !listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  if (listing.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  if (decision === "reject") {
    const { error: statusError } = await supabase
      .from("offers")
      .update({ status: "rejected" })
      .eq("id", offerId);

    if (statusError) {
      const { error: deleteError } = await supabase
        .from("offers")
        .delete()
        .eq("id", offerId);

      if (deleteError) {
        return NextResponse.json(
          { error: "Failed to reject offer." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ ok: true });
  }

  // accept
  const { error: listingUpdateError } = await supabase
    .from("listings")
    .update({ price: offer.offer_amount })
    .eq("id", listing.id);

  if (listingUpdateError) {
    return NextResponse.json(
      { error: "Failed to update listing price." },
      { status: 500 }
    );
  }

  const { error: acceptedError } = await supabase
    .from("offers")
    .update({ status: "accepted" })
    .eq("id", offerId);

  if (!acceptedError) {
    await supabase
      .from("offers")
      .update({ status: "rejected" })
      .eq("listing_id", listing.id)
      .neq("id", offerId);
  } else {
    // If `status` column doesn't exist, keep the accepted offer, remove other offers as fallback.
    await supabase
      .from("offers")
      .delete()
      .eq("listing_id", listing.id)
      .neq("id", offerId);
  }

  return NextResponse.json({ ok: true });
}
