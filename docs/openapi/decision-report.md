# Comparative Evaluation & Decision Report: Swagger UI vs. Redoc

**Author:** Ts. Saruulchimeg (23B1NUM1396)  
**Course:** Software Project Documentation (Sprint 05)  
**Topic:** Dual Renderer Trade-Off Analysis (Chinchilla Ch. 4 & 6 / Bhatti Ch. 7)

---

### 100-Word Decision Report (Official English Text)

Our comparative evaluation demonstrates distinct operational trade-offs between Swagger UI and Redoc for API documentation. Redoc provides superior layout readability through its responsive three-panel architecture, cleanly separating navigation hierarchy, explanatory prose, and synchronized request-response schemas. Furthermore, its instantaneous client-side full-text search across all parameters and models drastically minimizes cognitive overhead during reading workflows. Conversely, Swagger UI excels in sandbox utility through its interactive Try-It-Out console, enabling real-time JWT authentication, live multipart file execution, and direct HTTP inspection. Therefore, our team adopts Redoc for public reference documentation while maintaining Swagger UI internally within staging environments for rapid integration testing and debugging. (100 words)

---

### Монгол орчуулга ба тайлбар

Бидний үнэлгээгээр Swagger UI болон Redoc системүүд нь эрс ялгаатай давуу талуудтай байна. Redoc нь навигаци, тайлбар бичвэр, өгөгдлийн бүтцийг зэрэгцүүлэн харуулдаг 3 баганат зохион байгуулалт болон клиент талын агшин зуурын бүрэн хайлтын системийнхээ ачаар баримт уншиж буй хөгжүүлэгчийн танин мэдэхүйн ачааллыг үлэмж хэмжээгээр бууруулдаг. Харин Swagger UI нь JWT токен оруулах, multipart файлыг шууд дамжуулах, хүсэлт хариултыг шууд хянах "Try-It-Out" интерактив хамгаалагдсан орчноороо туршилт хийхэд давуу юм. Иймд манай баг нийтийн техникийн лавлахад Redoc-ийг, харин хөгжүүлэлтийн дотоод туршилтад Swagger UI-ийг хослуулан ашиглахаар эцсийн шийдвэр гаргав.

---

### Detailed Evaluation Matrix

| Metric / Dimension | Swagger UI | Redoc | Architectural Winner & Rationale |
|---|---|---|---|
| **Layout Readability & Structure** | Single-column collapsible accordion; causes vertical sprawl and excessive scrolling on large APIs. | Clean 3-panel layout (Left: Navigation, Center: Reference prose, Right: Code samples & JSON models). | **Redoc**: Implements Stripe-like technical reading experience; prevents visual clutter. |
| **Search Performance** | Basic endpoint tag filter; relies primarily on browser `Ctrl+F`; cannot index deep schema fields. | Instant in-memory client full-text search indexing endpoints, descriptions, parameters, and schema fields. | **Redoc**: Sub-millisecond keyword lookup with highlighted search matches. |
| **"Try-It-Out" Sandbox Testing** | Native interactive execution engine; supports Bearer JWT modals, file uploads, parameter forms, and cURL generation. | Static reference only; no built-in HTTP execution engine without third-party plugins. | **Swagger UI**: Indispensable for manual QA, staging smoke tests, and developer sandbox trials. |
| **Code Sample Presentation** | Embedded inside request body tabs; limited language tabs out-of-the-box. | Persistent right-hand dark panel showing synchronized request/response samples in multiple languages. | **Redoc**: Developer ergonomics match modern developer portal expectations. |
| **Deployment & Footprint** | Dynamic JavaScript bundle requiring client-side DOM rendering and spec fetching. | Generates zero-dependency standalone single-file HTML via `@redocly/cli build-docs` (150 KiB). | **Redoc**: Extremely lightweight, CDN-cacheable, perfect for static CI/CD pipelines. |
| **Public Deployment URLs** | `https://saruul3339.github.io/ICSI438-pd/swagger.html` | `https://saruul3339.github.io/ICSI438-pd/` | Dual hosting deployed via GitHub Actions Pages. |
