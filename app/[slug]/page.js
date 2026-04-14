import Link from "next/link";
import { getProductBySlug, getMarketingContent, getDeployedProducts } from "../../lib/supabase";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not Found" };

  const evaluation = product.evaluations?.[0] || product.evaluations;
  const name = formatName(slug);

  return {
    title: `${name} — Free AI Tool | Aleko Tools`,
    description: product.tagline || evaluation?.eli17 || `${name} - a free AI-powered tool`,
    openGraph: {
      title: `${name} — Free AI Tool`,
      description: product.tagline || evaluation?.eli17 || "",
      type: "article",
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="container product-page">
        <Link href="/" className="back">← Back to all tools</Link>
        <h1>Product not found</h1>
      </div>
    );
  }

  const evaluation = product.evaluations?.[0] || product.evaluations;
  const problem = product.scout_problems;
  const name = formatName(slug);

  // Get marketing content (SEO blog post)
  let marketing = null;
  try {
    marketing = await getMarketingContent(product.id);
  } catch {}

  // Get other products for cross-sell
  let otherProducts = [];
  try {
    const all = await getDeployedProducts();
    otherProducts = all.filter((p) => p.id !== product.id).slice(0, 3);
  } catch {}

  return (
    <div className="container product-page">
      <Link href="/" className="back">← Back to all tools</Link>

      <h1>{name}</h1>
      <p className="page-tagline">{product.tagline || evaluation?.eli17 || ""}</p>

      {product.deploy_url && (
        <a href={product.deploy_url} target="_blank" rel="noopener" className="cta">
          Try it free →
        </a>
      )}

      <div className="info-grid">
        {evaluation?.target_audience && (
          <div className="info-card">
            <div className="label">Who is this for</div>
            <div className="value">{evaluation.target_audience}</div>
          </div>
        )}
        {evaluation?.pricing_suggestion && (
          <div className="info-card">
            <div className="label">Pricing</div>
            <div className="value">{evaluation.pricing_suggestion}</div>
          </div>
        )}
        {evaluation?.suggested_mvp && (
          <div className="info-card">
            <div className="label">What it does</div>
            <div className="value">{evaluation.suggested_mvp}</div>
          </div>
        )}
        {problem?.software_solution && (
          <div className="info-card">
            <div className="label">Problem it solves</div>
            <div className="value">{problem.software_solution}</div>
          </div>
        )}
      </div>

      {problem?.problem_summary && (
        <div className="content-section">
          <h2>The Problem</h2>
          <div className="body">{problem.problem_summary}</div>
          {problem.url && (
            <a
              href={problem.url}
              target="_blank"
              rel="noopener"
              style={{ fontSize: "12px", color: "var(--dim)", marginTop: "8px", display: "inline-block" }}
            >
              Original discussion →
            </a>
          )}
        </div>
      )}

      {evaluation?.marketing_plan && (
        <div className="content-section">
          <h2>How to Get Users</h2>
          <div className="body">{evaluation.marketing_plan}</div>
        </div>
      )}

      {marketing?.seo_post && (
        <div className="content-section">
          <h2>About {name}</h2>
          <div className="body">{marketing.seo_post}</div>
        </div>
      )}

      {otherProducts.length > 0 && (
        <div className="cross-sell">
          <h2>Also check out</h2>
          <div className="products">
            {otherProducts.map((p) => {
              const eval_ = p.evaluations?.[0] || p.evaluations;
              const score = eval_?.overall_score || 0;
              return (
                <Link href={`/${p.project_name}`} key={p.id} className="product-card">
                  <div className={`score ${score >= 7 ? "great" : "good"}`}>{score}</div>
                  <h3>{formatName(p.project_name)}</h3>
                  <div className="tagline">{p.tagline || eval_?.eli17 || ""}</div>
                  <div className="meta">
                    <span className="tag live">Live</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function formatName(slug) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
