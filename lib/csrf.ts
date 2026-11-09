// Browsers attach cookies automatically, so protect every state-changing
// request, including login and logout, against cross-origin submission.
export function rejectCrossOriginMutation(req: Request): Response | null {
  const origin = req.headers.get("origin");
  const target = new URL(req.url).origin;
  const fetchSite = req.headers.get("sec-fetch-site");

  // Fail closed if Origin is absent or does not exactly match our origin.
  // This app's browser client always uses same-origin fetch for mutations.
  if (origin !== target || (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none")) {
    return Response.json(
      { success: false, message: "Cross-origin request rejected" },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  return null;
}
