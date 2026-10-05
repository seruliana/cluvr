# US-1.3: "Curse of Knowledge" Self-Audit — Cluvr README

**Литературын эх сурвалж:** Bhatti et al., *Docs for Developers*, Ch. 1 p. 3 "The Curse of Knowledge" (Newton 1990; Camerer et al. 1989) & Ch. 3 p. 58 "State your most important information first"

**Тест хийсэн хэрэглэгч (persona):** Төгөлдөр — Junior Frontend Developer, CampusLoop Labs, Cluvr-ийн UI-г бие даан кодлодог

---

## 0. Контекст: Cluvr гэж юу вэ

Cluvr нь оюутны клубуудыг нэгтгэсэн, event/арга хэмжээнд бүртгүүлэх (apply хийх) боломжтой веб-платформ. Одоогийн README нь Vite-ийн стандарт template дээр үндэслэсэн бөгөөд Cluvr-д тусгайлсан мэдээлэл (Tailwind тохиргоо, hamburger menu логик) нэмж бичсэн хувилбар.

---

## 1. ЭХ ХУВИЛБАР (BEFORE) — Одоогийн README

```markdown
# Cluvr

Cluvr - оюутны клубуудын event/application-уудыг нэгтгэсэн платформ.

## Tech Stack

React + Vite ашигласан bolno HMR болон ESLint дүрмүүдтэй.

Currently, two official plugins are available:
- [@vitejs/plugin-react] uses Oxc
- [@vitejs/plugin-react-swc] uses SWC

## Getting Started

npm install
npm run dev

## Tailwind Configuration

Tailwind CSS ашиглахын тулд PostCSS pipeline-г тохируулж, tailwind.config.js
дотор content path-уудыг зааж өгөх шаардлагатай.

## Mobile Menu

Hamburger menu нь peer-* selector ашиглан toggle хийгддэг тул харгалзах
sibling элементийн class order чухал.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using
TypeScript with type-aware lint rules enabled.
```

---

## 2. AUDIT — "Jargon-only / Opaque" гэж тэмдэглэсэн өгүүлбэрүүд

Төгөлдөрийн pain point-той (Tailwind setup хэцүү, hamburger menu bug, docs хайлт удаашрах) шууд харьцуулж 4 өгүүлбэрийг шалгав (шаардлага ≥3):

| # | Эх өгүүлбэр | Tag | Яагаад Төгөлдөрт ойлгомжгүй вэ |
|---|---|---|---|
| 1 | *"Currently, two official plugins are available: @vitejs/plugin-react uses Oxc / @vitejs/plugin-react-swc uses SWC"* | **Jargon-only** | "Oxc", "SWC" гэдэг нь compiler/tooling нэр боловч тайлбаргүй. Аль нэгийг сонгох шаардлагатай юу, ялгаа нь юу вэ гэдэг эхлэгчид тодорхойгүй. Curse of knowledge: зохиогч эдгээрийг өдөр тутам ашигладаг тул "мэдэгдэхүйц" гэж бодсон. |
| 2 | *"Tailwind CSS ашиглахын тулд PostCSS pipeline-г тохируулж, tailwind.config.js дотор content path-уудыг зааж өгөх шаардлагатай"* | **Overly opaque** | "PostCSS pipeline", "content path" гэдэг нэр томьёог тайлбарлаагүй, ямар файл руу, ямар утга бичихийг заагаагүй. Энэ бол Төгөлдөрийн #1 pain point ("Lego байшин барихад кран авчирсантай адил") — яг тохиолдож буй friction. |
| 3 | *"Hamburger menu нь peer-* selector ашиглан toggle хийгддэг тул харгалзах sibling элементийн class order чухал"* | **Jargon-only** | Энэ өгүүлбэр Төгөлдөрийн бодит quote-той шууд холбоотой ("hamburger menu яагаад заримдаа нээгддэггүйг тайлбарлаагүй"). "peer-*", "sibling class order" гэдгийг тайлбарлаагүй бөгөөд хамгийн чухал зүйл — **юу хийхийг** заагаагүй, зөвхөн яагаад эвдэрдэг тухай tech-хийсвэрлэл өгсөн.
| 4 | *"...we recommend using TypeScript with type-aware lint rules enabled"* | **Overly opaque** | "type-aware lint rules" гэдэг нь ESLint-ийн дэвшилтэт ойлголт (typescript-eslint parserOptions.project). Шинэхэн хөгжүүлэгчид энэ нь юу хийдэг, яагаад хэрэгтэйг мэдэхгүй, зөвхөн нэр дурдсан. |

---

## 3. REWRITE — "Most Important Information First" дүрэм (Bhatti p. 58)

Хамгийн их friction үүсгэдэг **#3 (hamburger menu)** өгүүлбэрийг сонгов, учир нь энэ бол Төгөлдөрийн бодит бичсэн bug-тай шууд таарч байна.

### Асуудал (Before)
Өгүүлбэр эхлээд техникийн шалтгааныг (`peer-*` selector) тайлбарлаад, хэрэглэгчид хамгийн хэрэгтэй мэдээлэл болох **"юу хийхийг"** төгсгөлд нь ч гэсэн огт өгөхгүй орхисон. Уншигч эхлээд яагаад гэдгийг унших ёстой болж, шийдлийг олохоос өмнө математик шиг debug хийх шаардлагатай болно.

### Шинэ хувилбар (After) — хамгийн чухал мэдээлэл эхэнд

```markdown
## Mobile Menu

⚠️ Menu нээгдэхгүй бол: HTML дотор toggle-checkbox нь menu-тэй
шууд sibling (ижил түвшний, зэргэлдээ) байгаа эсэхийг эхлээд шалгана уу.

Жишээ нь:

✅ ЗӨВ (checkbox ба menu шууд sibling):
  <input type="checkbox" id="menu-toggle" class="peer hidden" />
  <nav class="hidden peer-checked:block">...</nav>

❌ БУРУУ (checkbox ба menu хооронд wrapper <div> орсон тул
   peer-checked ажиллахгүй):
  <input type="checkbox" id="menu-toggle" class="peer hidden" />
  <div>
    <nav class="hidden peer-checked:block">...</nav>
  </div>

Шалтгаан: Tailwind-ийн `peer-*` selector нь зөвхөн шууд дараагийн
sibling элемент дээр л ажилладаг тул завсарт нэмэлт element орвол
menu тогтмол эвдэрдэг.
```

**Юу өөрчлөгдсөн бэ:** Actionable зөвлөмж ("шалгах зүйл") хамгийн эхэнд, дараа нь concrete код жишээ (зөв vs буруу), хамгийн сүүлд техникийн шалтгаан. Ингэснээр Төгөлдөр шиг хэрэглэгч эхний мөрийг уншаад л асуудлаа шалгаж эхэлж чадна — техникийн тайлбарыг уншиж дуустал хүлээх шаардлагагүй.

---

## 4. BEFORE / AFTER DIFF (Course Workspace-д нийтлэх хувилбар)

```diff
## Mobile Menu

- Hamburger menu нь peer-* selector ашиглан toggle хийгддэг тул
- харгалзах sibling элементийн class order чухал.

+ ⚠️ Menu нээгдэхгүй бол: HTML дотор toggle-checkbox нь menu-тэй
+ шууд sibling байгаа эсэхийг эхлээд шалгана уу.
+
+ ✅ ЗӨВ:
+   <input type="checkbox" id="menu-toggle" class="peer hidden" />
+   <nav class="hidden peer-checked:block">...</nav>
+
+ ❌ БУРУУ (завсарт <div> орсон):
+   <input type="checkbox" id="menu-toggle" class="peer hidden" />
+   <div>
+     <nav class="hidden peer-checked:block">...</nav>
+   </div>
+
+ Шалтгаан: `peer-*` selector зөвхөн шууд дараагийн sibling дээр
+ л ажилладаг.
```

| Шалгуур | Before | After |
|---|---|---|
| Хамгийн чухал мэдээлэл байрлал | Төгсгөлд ч алга (шалтгаан л бий) | Эхний мөрөнд — юу шалгахыг шууд хэлнэ |
| Concrete жишээ | Алга | ✅/❌ код блок хоёулаа бий |
| Jargon тайлбарлагдсан эсэх | Үгүй (`peer-*`, `sibling`) | Тийм — жишээгээр харуулсан |
| Actionable эсэх | Үгүй, зөвхөн тайлбар | Тийм, шууд алхам өгсөн |

---

## 5. Дүгнэлт

Curse of Knowledge-ийн шинжлэх ухааны үндэслэл (Newton 1990 fingers-tapping experiment: tapper 51% таамаглаж байхад listener 2.5% л таамагласан) энд ч харагдаж байна — зохиогч (Cluvr багийн туршлагатай гишүүн) `peer-*` selector, PostCSS pipeline, Oxc/SWC зэрэг нэр томьёог "ойлгомжтой" гэж бодсон боловч Төгөлдөр шиг шинэхэн хэрэглэгчид эдгээр нь бүрэн jargon байсан. README-г MIF (Most Important Information First) дүрмээр дахин бичих нь уншигчид actionable мэдээллийг эхэнд нь өгч, техникийн шалтгааныг сонголтоор дараа нь уншихаар үлдээдэг.
