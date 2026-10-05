"""
Generate clean, professional architecture and comparison diagrams for Sprint 05 report.
Outputs PNGs to diagrams/ folder.
"""

import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

os.makedirs("diagrams", exist_ok=True)
plt.rcParams['font.sans-serif'] = 'DejaVu Sans, Arial, Helvetica'
plt.rcParams['font.family'] = 'sans-serif'


def create_api_architecture_diagram():
    fig, ax = plt.subplots(figsize=(10.5, 6.2), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Title
    ax.text(50, 96, "Corg.ly OpenAPI 3.0 System Architecture & Dual Renderers",
            ha='center', va='center', fontsize=13, fontweight='bold', color='#1E3A8A')
    ax.text(50, 92, "(Contract-First Specification, Dual Renderers & Illustrative Backend Architecture)",
            ha='center', va='center', fontsize=8.5, style='italic', color='#64748B')

    # 1. API Consumers
    c_box = patches.FancyBboxPatch((3, 56), 21, 28, boxstyle="round,pad=0.8", ec="#3B82F6", fc="#EFF6FF", lw=1.5)
    ax.add_patch(c_box)
    ax.text(13.5, 78, "API Consumers", ha='center', va='center', fontsize=10.5, fontweight='bold', color='#1E40AF')
    ax.text(13.5, 68, "• Mobile Client App\n• IoT Smart Feeder\n• Third-Party Devs", ha='center', va='center', fontsize=8.5, color='#334155')

    # 2. Central Contract-First Specification (Separated from Renderers)
    spec_box = patches.FancyBboxPatch((3, 10), 21, 38, boxstyle="round,pad=0.8", ec="#D97706", fc="#FFFBEB", lw=1.5)
    ax.add_patch(spec_box)
    ax.text(13.5, 42, "Single Source\nof Truth", ha='center', va='center', fontsize=10.5, fontweight='bold', color='#B45309')
    ax.text(13.5, 30, "OpenAPI 3.0.3 Spec\n(docs/openapi/\nopenapi.yaml)", ha='center', va='center', fontsize=8.5, fontweight='bold', color='#92400E')
    ax.text(13.5, 17, "Validated by:\n@redocly/cli 2.57.0\n0 Errors, 0 Warnings", ha='center', va='center', fontsize=7.5, color='#78350F')

    # 3. Dual Renderers Box (Consumes the Spec)
    r_box = patches.FancyBboxPatch((28, 10), 22, 38, boxstyle="round,pad=0.8", ec="#10B981", fc="#ECFDF5", lw=1.5)
    ax.add_patch(r_box)
    ax.text(39, 42, "Dual Renderers\n(Documentation)", ha='center', va='center', fontsize=10.5, fontweight='bold', color='#065F46')
    ax.text(39, 30, "Swagger UI\n(Try-It-Out Sandbox)\npublic/swagger.html\n\nRedoc\n(3-Panel Reference)\npublic/index.html", ha='center', va='center', fontsize=8, color='#047857')
    ax.text(39, 15, "Public Host:\nGitHub Pages", ha='center', va='center', fontsize=7.5, style='italic', color='#1F2937')

    # 4. API Gateway / Prism Mock Server
    g_box = patches.FancyBboxPatch((28, 54), 22, 32, boxstyle="round,pad=0.8", ec="#8B5CF6", fc="#F5F3FF", lw=1.5)
    ax.add_patch(g_box)
    ax.text(39, 79, "API Gateway / Mock\n(Prism / Express)", ha='center', va='center', fontsize=10.5, fontweight='bold', color='#5B21B6')
    ax.text(39, 67, "• JWT Bearer Auth (RFC 7519)\n• Prism Mock (Port 4010)\n• OpenAPI Schema Validation\n• Multipart Handler (10MB)", ha='center', va='center', fontsize=7.8, color='#4C1D95')

    # 5. Illustrative Backend Microservices
    b_box = patches.FancyBboxPatch((55, 10), 42, 76, boxstyle="round,pad=0.8", ec="#94A3B8", fc="#F8FAFC", lw=1.2, ls="--")
    ax.add_patch(b_box)
    ax.text(76, 82, "Illustrative Backend Architecture (Жишиг архитектур)", ha='center', va='center', fontsize=9.5, fontweight='bold', color='#475569')

    # Pet Service
    s_box = patches.FancyBboxPatch((58, 48), 36, 28, boxstyle="round,pad=0.6", ec="#F59E0B", fc="#FFFFFF", lw=1.2)
    ax.add_patch(s_box)
    ax.text(76, 70, "Pet & Media Microservice", ha='center', va='center', fontsize=9.5, fontweight='bold', color='#92400E')
    ax.text(76, 58, "• POST /pets | GET /pets/{id}\n• POST /pets/upload-photo (Multipart)\n• PostgreSQL 16 (Profiles) & S3 (Photos)", ha='center', va='center', fontsize=8, color='#78350F')

    # Audio & Webhook Service
    a_box = patches.FancyBboxPatch((58, 15), 36, 28, boxstyle="round,pad=0.6", ec="#EC4899", fc="#FFFFFF", lw=1.2)
    ax.add_patch(a_box)
    ax.text(76, 37, "AI Audio & Webhook Dispatcher", ha='center', va='center', fontsize=9.5, fontweight='bold', color='#9D174D')
    ax.text(76, 25, "• POST /audio/translate-bark (Neural AI)\n• POST /webhooks/subscribe (HMAC-SHA256)\n• GET /audio/translations/{id} (Audit)", ha='center', va='center', fontsize=8, color='#831843')

    # Arrows
    arrow_props = dict(arrowstyle="->", lw=1.5, color="#475569")
    # Consumers to Gateway
    ax.annotate("", xy=(28, 70), xytext=(24, 70), arrowprops=arrow_props)
    # Spec to Renderers
    ax.annotate("", xy=(28, 29), xytext=(24, 29), arrowprops=dict(arrowstyle="->", lw=1.5, color="#D97706", ls=":"))
    # Swagger to Gateway (Try-It-Out)
    ax.annotate("", xy=(39, 54), xytext=(39, 48), arrowprops=arrow_props)
    # Gateway to Services
    ax.annotate("", xy=(58, 62), xytext=(50, 68), arrowprops=arrow_props)
    ax.annotate("", xy=(58, 29), xytext=(50, 60), arrowprops=arrow_props)

    plt.tight_layout()
    fig.savefig("diagrams/w5-api-architecture.png", dpi=300, bbox_inches='tight')
    plt.close()


def create_bhatti_principles_radar():
    fig, ax = plt.subplots(figsize=(8, 5.5), dpi=300, subplot_kw=dict(polar=True))
    categories = ['Explained\n(p. 87)', 'Concise\n(p. 90)', 'Clear\n(p. 92)', 'Usable\n(p. 93)', 'Trustworthy\n(p. 94)']
    N = len(categories)
    angles = [n / float(N) * 2 * 3.14159265 for n in range(N)]
    angles += angles[:1]

    # Chad's legacy scores (Week 5 baseline)
    legacy_scores = [1.0, 2.0, 2.0, 1.0, 1.0]
    legacy_scores += legacy_scores[:1]

    # Refactored scores (Whole star average: 4.8 / 5.0 = 96%)
    # Sample 1: 5, 4, 5, 5, 5
    # Sample 2: 4, 5, 5, 5, 5
    # Sample 3: 5, 5, 4, 5, 5
    # Metric averages: Explained=4.67, Concise=4.67, Clear=4.67, Usable=5.0, Trustworthy=5.0
    refactored_scores = [4.67, 4.67, 4.67, 5.0, 5.0]
    refactored_scores += refactored_scores[:1]

    ax.set_theta_offset(3.14159265 / 2)
    ax.set_theta_direction(-1)
    plt.xticks(angles[:-1], categories, size=9.5, color='#1E293B', weight='bold')
    ax.set_rlabel_position(0)
    plt.yticks([1, 2, 3, 4, 5], ["1", "2", "3", "4", "5"], color="#64748B", size=8)
    plt.ylim(0, 5.2)

    # Plot Chad Legacy
    ax.plot(angles, legacy_scores, linewidth=2, linestyle='--', color='#EF4444', label="Chad's Legacy Code (Bhatti p. 83)")
    ax.fill(angles, legacy_scores, '#EF4444', alpha=0.15)

    # Plot Refactored
    ax.plot(angles, refactored_scores, linewidth=2.5, linestyle='solid', color='#10B981', label="Refactored Code Samples (4.80/5.00 Stars, 96%)")
    ax.fill(angles, refactored_scores, '#10B981', alpha=0.25)

    plt.title("Bhatti's 5 Principles Code Sample Audit: Before vs After Rework", size=11, color='#1E3A8A', weight='bold', y=1.1)
    plt.legend(loc='lower right', bbox_to_anchor=(1.25, -0.1), fontsize=8.5)
    plt.tight_layout()
    fig.savefig("diagrams/w5-bhatti-audit-matrix.png", dpi=300, bbox_inches='tight')
    plt.close()


def create_renderer_comparison_diagram():
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5.5), dpi=300)

    # Swagger UI panel
    ax1.set_xlim(0, 100)
    ax1.set_ylim(0, 100)
    ax1.axis('off')
    ax1.set_title("Swagger UI (Interactive Sandbox)", fontsize=11, fontweight='bold', color='#0284C7', pad=10)

    box1 = patches.FancyBboxPatch((5, 5), 90, 88, boxstyle="round,pad=1", ec="#0284C7", fc="#F0F9FF", lw=1.5)
    ax1.add_patch(box1)

    # Header bar
    ax1.add_patch(patches.Rectangle((8, 80), 84, 10, fc="#1B1B1B"))
    ax1.text(12, 85, "Swagger UI Top Bar", color="white", fontsize=9, fontweight='bold', va='center')
    ax1.text(78, 85, "[Authorize]", color="#49CC90", fontsize=8, fontweight='bold', va='center')

    # Endpoint Accordion 1
    ax1.add_patch(patches.Rectangle((8, 62), 84, 15, fc="#E8F6F0", ec="#49CC90", lw=1))
    ax1.add_patch(patches.Rectangle((10, 65), 18, 9, fc="#49CC90"))
    ax1.text(19, 69.5, "POST", color="white", fontsize=8, fontweight='bold', ha='center', va='center')
    ax1.text(32, 69.5, "/v1/pets/upload-photo", color="#3B4151", fontsize=8, fontweight='bold', va='center')
    ax1.text(80, 69.5, "[Try it out]", color="#3B82F6", fontsize=7.5, va='center')

    # Sandbox interactive panel
    ax1.add_patch(patches.Rectangle((8, 30), 84, 29, fc="#FFFFFF", ec="#CBD5E1", lw=1))
    ax1.text(12, 53, "Parameters & Request Body:", fontsize=8, fontweight='bold', color="#1E293B")
    ax1.text(12, 45, "• pet_id: 'corgi_98231'\n• photo_file: [Browse...] einstein.jpg", fontsize=7.5, color="#475569")
    ax1.add_patch(patches.Rectangle((12, 33), 30, 8, fc="#4990E2"))
    ax1.text(27, 37, "Execute Request", color="white", fontsize=7.5, fontweight='bold', ha='center', va='center')

    # Responses Box
    ax1.add_patch(patches.Rectangle((8, 9), 84, 18, fc="#F8FAFC", ec="#E2E8F0", lw=1))
    ax1.text(12, 22, "Server Response (200 OK):", fontsize=7.5, fontweight='bold', color="#10B981")
    ax1.text(12, 14, '{\n  "photo_url": "https://media.corg.ly/photos/corgi_98231.jpg", ...\n}', fontsize=6.5, family='monospace', color="#334155")

    # Redoc panel
    ax2.set_xlim(0, 100)
    ax2.set_ylim(0, 100)
    ax2.axis('off')
    ax2.set_title("Redoc (3-Panel Reference View)", fontsize=11, fontweight='bold', color='#9333EA', pad=10)

    box2 = patches.FancyBboxPatch((5, 5), 90, 88, boxstyle="round,pad=1", ec="#9333EA", fc="#FAF5FF", lw=1.5)
    ax2.add_patch(box2)

    # Col 1: Navigation
    ax2.add_patch(patches.Rectangle((8, 9), 24, 81, fc="#263238"))
    ax2.text(20, 84, "Search API...", color="#90A4AE", fontsize=7, ha='center', style='italic')
    ax2.text(10, 75, "OVERVIEW\n• Introduction\n• Authentication\n\nPETS\n• Register Pet\n• Get Pet Profile\n• Upload Photo\n\nTRANSLATION\n• Translate Bark", color="#ECEFF1", fontsize=7)

    # Col 2: Documentation Prose
    ax2.add_patch(patches.Rectangle((34, 9), 32, 81, fc="#FFFFFF", ec="#E2E8F0", lw=1))
    ax2.text(36, 84, "Upload Pet Photo", fontsize=8.5, fontweight='bold', color="#1E293B")
    ax2.text(36, 75, "POST /v1/pets/upload-photo", fontsize=7, color="#059669", family='monospace')
    ax2.text(36, 62, "Accepts binary image\nupload (JPEG/PNG).\nValidates resolution and\nstrips EXIF metadata.\n\nAuthorizations:\n• BearerAuth (JWT)", fontsize=7, color="#475569")
    ax2.text(36, 32, "Request Form-Data:\n• pet_id (string)\n• photo_file (binary)\n\nResponses:\n• 200 OK (Uploaded)\n• 400 Bad Request\n• 413 File Too Large", fontsize=6.8, color="#334155")

    # Col 3: Payloads & Code
    ax2.add_patch(patches.Rectangle((68, 9), 24, 81, fc="#1E293B"))
    ax2.text(80, 84, "Request Samples", color="#38BDF8", fontsize=7.5, fontweight='bold', ha='center')
    ax2.text(70, 75, "Python / requests:\n\nimport requests\nres = requests.post(\n  url, files=files\n)", color="#E2E8F0", fontsize=6.2, family='monospace')
    ax2.text(80, 48, "Response Sample (200)", color="#4ADE80", fontsize=7, fontweight='bold', ha='center')
    ax2.text(70, 38, '{\n "photo_url": "...",\n "pet_id": "...",\n "file_size": 1482910\n}', color="#CBD5E1", fontsize=6, family='monospace')

    plt.tight_layout()
    fig.savefig("diagrams/w5-swagger-vs-redoc.png", dpi=300, bbox_inches='tight')
    plt.close()


def create_ci_pipeline_diagram():
    fig, ax = plt.subplots(figsize=(10.5, 4.2), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    ax.text(50, 93, "Automated CI/CD Pipeline: Validation, Executable Tests & GitHub Pages Deploy",
            ha='center', va='center', fontsize=11.5, fontweight='bold', color='#1E3A8A')

    steps = [
        ("Git Push / PR\nTrigger", "main / master", "#F1F5F9", "#64748B"),
        ("Redocly Linter\n(US-5.1)", "redocly lint\n0 Errors, 0 Warnings", "#EFF6FF", "#3B82F6"),
        ("Redoc Standalone\nBuild (US-5.3)", "redocly build-docs\npublic/index.html", "#F5F3FF", "#8B5CF6"),
        ("Executable Code\nTests (Bhatti p.96)", "python -m unittest\n3/3 Tests Passed", "#ECFDF5", "#10B981"),
        ("GitHub Pages\nDeploy (US-5.4)", "actions/deploy-pages\nLive Public URLs", "#FEF3C7", "#D97706")
    ]

    for i, (title, sub, fc, ec) in enumerate(steps):
        x = 3 + i * 19.5
        box = patches.FancyBboxPatch((x, 22), 17.5, 56, boxstyle="round,pad=0.8", ec=ec, fc=fc, lw=1.5)
        ax.add_patch(box)
        ax.text(x + 8.75, 62, title, ha='center', va='center', fontsize=8.8, fontweight='bold', color='#0F172A')
        ax.text(x + 8.75, 40, sub, ha='center', va='center', fontsize=7.6, color='#334155', style='italic')

        if i < len(steps) - 1:
            ax.annotate("", xy=(x + 19.5, 50), xytext=(x + 17.5, 50),
                        arrowprops=dict(arrowstyle="->", lw=1.8, color="#475569"))

    plt.tight_layout()
    fig.savefig("diagrams/w5-ci-pipeline.png", dpi=300, bbox_inches='tight')
    plt.close()


if __name__ == "__main__":
    create_api_architecture_diagram()
    create_bhatti_principles_radar()
    create_renderer_comparison_diagram()
    create_ci_pipeline_diagram()
    print("All diagrams regenerated successfully!")
