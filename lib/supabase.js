const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function supabaseGet(path) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    next: { revalidate: 3600 }, // ISR: rebuild every hour
  });
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  return res.json();
}

export async function getDeployedProducts() {
  return supabaseGet(
    '/rest/v1/built_projects?status=eq.deployed&select=*,scout_problems(problem_summary,software_solution),evaluations(eli17,marketing_one_liner,target_audience,pricing_suggestion,marketing_plan,sellability_score,overall_score)&order=created_at.desc'
  );
}

export async function getProductBySlug(slug) {
  const products = await supabaseGet(
    `/rest/v1/built_projects?project_name=eq.${slug}&status=eq.deployed&select=*,scout_problems(problem_summary,software_solution,url,source,community),evaluations(eli17,marketing_one_liner,target_audience,pricing_suggestion,marketing_plan,suggested_mvp,overall_score,demand_score,competition_score,feasibility_score,monetization_score,sellability_score)`
  );
  return products[0] || null;
}

export async function getMarketingContent(projectId) {
  const content = await supabaseGet(
    `/rest/v1/marketing_content?built_project_id=eq.${projectId}&select=seo_post&limit=1`
  );
  return content[0] || null;
}

export async function getProductInsights(projectId) {
  const insights = await supabaseGet(
    `/rest/v1/product_insights?project_id=eq.${projectId}&order=created_at.desc&limit=1`
  );
  return insights[0] || null;
}
