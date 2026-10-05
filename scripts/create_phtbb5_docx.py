"""
Build PHTBB-5.docx complete, publication-grade report.
Refactored to address all user review points with 100% precision.
Author: Ts. Saruulchimeg (23B1NUM1396)
Instructor: Ph.D. Batnyam Battulga
National University of Mongolia
"""

import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

from docx_helpers import (
    add_heading_2, add_heading_3, add_heading_4,
    add_body_p, add_code_block, add_callout_box,
    format_custom_table, set_cell_background, set_cell_margins
)


def generate_report():
    doc = Document()

    # Set page layout to A4 with 1-inch margins
    for section in doc.sections:
        section.page_width = Inches(8.268)
        section.page_height = Inches(11.693)
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # --------------------------------------------------------------------------
    # Document Header & Metadata
    # --------------------------------------------------------------------------
    p_meta1 = doc.add_paragraph()
    p_meta1.paragraph_format.space_before = Pt(0)
    p_meta1.paragraph_format.space_after = Pt(2)
    r1 = p_meta1.add_run("Week 5 Sprint 05")
    r1.font.name = "Times New Roman"
    r1.font.size = Pt(13)
    r1.bold = True
    r1.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    p_meta2 = doc.add_paragraph()
    p_meta2.paragraph_format.space_before = Pt(0)
    p_meta2.paragraph_format.space_after = Pt(2)
    r2 = p_meta2.add_run("МТЭС, МКУТ, Програм хангамж | Үндэсний Их Сургууль")
    r2.font.name = "Times New Roman"
    r2.font.size = Pt(11)
    r2.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

    p_meta3 = doc.add_paragraph()
    p_meta3.paragraph_format.space_before = Pt(0)
    p_meta3.paragraph_format.space_after = Pt(8)
    r3 = p_meta3.add_run("Ц. Саруулчимэг (23B1NUM1396) | Багш: Ph.D. Батням Баттулга")
    r3.font.name = "Times New Roman"
    r3.font.size = Pt(11)
    r3.bold = True
    r3.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    # Main Document Title
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(4)
    p_title.paragraph_format.space_after = Pt(4)
    r_title = p_title.add_run("OpenAPI 3.0 Спецификаци, Bhatti-ийн Код Жишээний Чанарын Аудит ба Хос Рендерер Систем")
    r_title.font.name = "Times New Roman"
    r_title.font.size = Pt(16)
    r_title.bold = True
    r_title.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(10)
    r_sub = p_sub.add_run("OpenAPI 3.0.3 YAML + Redocly CLI + Bhatti 5 Principles + Prism Mock Server + GitHub Pages Dual Hosting")
    r_sub.font.name = "Times New Roman"
    r_sub.font.size = Pt(11)
    r_sub.italic = True
    r_sub.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

    add_callout_box(
        doc,
        "Төслийн хүрээ: Corg.ly Pet Onboarding API (UE-5 Лабораторийн жишиг) & Cluvr платформ (Хөтөч төсөл)\n"
        "Хувилбар: v1.0 (Sprint 05) | Огноо: 2026-10-05 | GitHub: https://github.com/saruul3339/ICSI438-pd\n"
        "Нээлттэй Public URL-ууд (GitHub Pages):\n"
        "  • Redoc Reader View: https://saruul3339.github.io/ICSI438-pd/\n"
        "  • Swagger UI Sandbox: https://saruul3339.github.io/ICSI438-pd/swagger.html\n"
        "  • OpenAPI 3.0 YAML: https://saruul3339.github.io/ICSI438-pd/openapi.yaml\n"
        "Definition of Done: OpenAPI 3.0.3 Validated (0 errors) ✔ | 6 Endpoints Defined ✔ | Bhatti 5 Principles Scorecard (4.80/5.00 = 96%) ✔ | Prism Mock Tested ✔ | GitHub Pages Live ✔ | CI Pipeline (Bonus +10%) ✔ | 100-Word Decision Report ✔",
        title="Sprint 05 Гүйцэтгэлийн Паспорт & Мэдээлэл"
    )

    # --------------------------------------------------------------------------
    # Sprint 05 Зорилго ба Definition of Done (DoD)
    # --------------------------------------------------------------------------
    add_heading_2(doc, "Sprint 05 Зорилго ба Definition of Done (DoD)")
    add_body_p(
        doc,
        "Sprint 05-ийн стратегийн гол зорилго нь машин унших боломжтой, олон улсын OpenAPI 3.0.3 стандартад бүрэн нийцсэн YAML спецификацийг бичиж, аюулгүй байдлын Bearer JWT схем болон дахин ашиглагдах компонент загваруудаар баталгаажуулах явдал юм. Үүний зэрэгцээ Jared Bhatti нарын 'Docs for Developers' (2021) номын 5-р бүлэгт заасан код жишээний 5 чанарын зарчим (Explained, Concise, Clear, Usable, Trustworthy)-ын дагуу өмнөх legacy код жишээнүүдийг аудит хийж, бүрэн ажиллах чадвартай болгон сайжруулна. Код жишээний найдвартай байдлыг Stoplight Prism Mock серверээр бодитоор туршин баталгаажуулж, GitHub Actions CI автомат хоолойгоор шалгана. Эцэст нь уг спецификацийг GitHub Pages дээр Swagger UI болон Redoc системүүдээр нийтийн нээлттэй хос URL-аар байршуулж, яг 100 үг бүхий харьцуулсан шийдвэрийн тайланг боловсруулна."
    )

    dod_headers = ["DoD Шалгуур үзүүлэлт", "Төлөв", "Хэрэгжүүлсэн байдал ба Нотолгоо"]
    dod_rows = [
        [
            "OpenAPI 3.0.3 YAML спецификаци ба @redocly/cli lint",
            "ХАНГАСАН ✔",
            "docs/openapi/openapi.yaml (Corg.ly) ба docs/openapi/cluvr-openapi.yaml (Cluvr) файлууд үүсгэгдэж, @redocly/cli 2.57.0-ээр 0 алдаа, 0 анхааруулгатай баталгаажсан."
        ],
        [
            "5-аас доошгүй Endpoint бүрэн тодорхойлолт",
            "ХАНГАСАН ✔",
            "Нийт 6 endpoint тодорхойлж, зам (path), параметрүүд, requestBody (POST үйлдлүүдэд), 200/201, 4xx, 5xx хариултууд, бодит жишээ өгөгдлийг суулгасан."
        ],
        [
            "Bhatti-ийн 5 зарчмаар код жишээг аудит хийсэн карт (Scorecard >= 80%)",
            "ХАНГАСАН ✔",
            "3 Python код жишээг Чадын legacy хувилбараас сайжруулан бичиж, 1-5 бүтэн одоор үнэлэхэд 72/15 оноо буюу дундаж 4.80 / 5.00 (96.0%) болсон."
        ],
        [
            "Хос Рендерер (Swagger UI ба Redoc) зэрэг ажиллах Public URL",
            "ХАНГАСАН ✔",
            "GitHub Pages дээр бүрэн deploy хийгдсэн:\n• Redoc: https://saruul3339.github.io/ICSI438-pd/\n• Swagger UI: https://saruul3339.github.io/ICSI438-pd/swagger.html"
        ],
        [
            "Яг 100 үгийн харьцуулсан шийдвэрийн тайлан (Decision Report)",
            "ХАНГАСАН ✔",
            "Хайлтын хурд, зохион байгуулалт, Try-It-Out боломжийг үнэлсэн яг 100 үг бүхий шийдвэрийн тайланг docs/openapi/decision-report.md-д бичиж баталгаажуулсан."
        ],
        [
            "Бонус (+10% Grade): CI тестийн автомат хоолойд холбосон байдал",
            "ХАНГАСАН ✔",
            "tests/test_corgly_samples.py тестийн багц бүтээгдэж, .github/workflows/api-ci.yml GitHub Actions хоолойд lint, test, pages deploy job-ууд бүрэн холбогдсон."
        ]
    ]
    t_dod = doc.add_table(rows=1, cols=3)
    format_custom_table(t_dod, [2.0, 1.1, 3.17], dod_headers, dod_rows)

    # --------------------------------------------------------------------------
    # Бүлэг 1: US-5.1 — Машин унших боломжтой OpenAPI 3.0.3 Спецификаци
    # --------------------------------------------------------------------------
    add_heading_2(doc, "Бүлэг 1: US-5.1 — Машин унших боломжтой OpenAPI 3.0.3 Спецификаци")
    add_body_p(
        doc,
        "Chris Chinchilla (2024) 'Technical Writing for Software Developers' номын 2-р бүлэг (хуудас 18–22)-т зааснаар орчин үеийн программ хангамжийн баримтжуулалтын суурь зарчим нь API спецификацийг төслийн 'үнэний цорын ганц эх сурвалж' (Single Source of Truth) болгон хэрэгжүүлэх явдал юм. Хүний унших бичвэр болон кодын хооронд үүсдэг зөрүүг арилгах хамгийн шилдэг шийдэл нь машин унших боломжтой OpenAPI 3.0 стандарт бөгөөд үүнээс лавлах баримт бичиг, код үүсгэгч (SDK), мок сервер, автомат тестүүд шууд үүсдэг."
    )

    add_heading_3(doc, "1.1 Corg.ly Системийн Архитектур ба Рендерерийн Уялдаа Холбоо")
    add_body_p(
        doc,
        "Corg.ly платформын хувьд амьтны бүртгэл, хуцалтын дуу авиаг хиймэл оюунаар хүний хэл рүү хөрвүүлэх (biometric bark translation), болон бодит хугацааны үйл явдлуудыг хүлээн авах вэбхүүк дэд бүтцийг нэгтгэсэн архитектурыг доорх байдлаар зохион байгууллаа. OpenAPI 3.0.3 спецификаци нь бүх системийн төвд бие даасан гэрээ (Contract-First Specification) байдлаар оршиж, хос рендерерүүд (Swagger UI ба Redoc) болон API Gateway / Prism Mock серверийг мэдээллээр хангадаг."
    )

    if os.path.exists("diagrams/w5-api-architecture.png"):
        doc.add_picture("diagrams/w5-api-architecture.png", width=Inches(6.27))
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        rc = p_cap.add_run("Зураг 1.1: Corg.ly OpenAPI 3.0 Системийн Архитектур (Гэрээт спецификаци, Хос Рендерер ба Жишиг Арын Алба)")
        rc.font.name = "Times New Roman"
        rc.font.size = Pt(9.5)
        rc.italic = True
        rc.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

    add_heading_4(doc, "Mermaid Diagram-as-Code эх код (diagrams/w5-api-architecture.mmd):")
    if os.path.exists("diagrams/w5-api-architecture.mmd"):
        with open("diagrams/w5-api-architecture.mmd", "r") as f:
            add_code_block(doc, f.read())

    add_heading_3(doc, "1.2 Бүрэн тодорхойлсон 6 Endpoint-ийн жагсаалт ба алдааны матриц")
    add_body_p(
        doc,
        "Лабораторийн удирдамжид заасан 5-аас доошгүй endpoint шаардлагыг давуулан биелүүлж, нийт 6 endpoint-ийг тодорхойлов. HTTP болон OpenAPI 3.0 стандартын дагуу GET арга нь ямар нэгэн requestBody ашиглахгүй (зөвхөн path болон query параметрээр шүүнэ), харин шинэ өгөгдөл үүсгэх бүх POST арга нь бүтэн requestBody схем болон бодит жишээ өгөгдлийг агуулсан болно. Мөн endpoint бүрт тохирох 4xx болон 5xx алдааны хариултуудыг бүрэн тодорхойлов:"
    )

    ep_headers = ["Endpoint Зам", "Арга", "Зориулалт ба Үүрэг", "Оролт (Payload / Params)", "Хариултын Кодууд"]
    ep_rows = [
        [
            "/pets",
            "POST",
            "Шинэ тэжээвэр амьтны профайл бүртгэх",
            "RequestBody (JSON): pet_name, breed, age_months, owner_email",
            "201 Created\n400, 401, 422, 500"
        ],
        [
            "/pets/{pet_id}",
            "GET",
            "Бүртгэлтэй амьтны профайл, төлөв авах",
            "Path param: pet_id (Regex: ^[a-z]+_[0-9]{5}$)",
            "200 OK\n400, 401, 404, 500"
        ],
        [
            "/pets/upload-photo",
            "POST",
            "Амьтны зургийг multipart хэлбэрээр илгээх",
            "RequestBody (Multipart): pet_id (string), photo_file (binary)",
            "200 OK\n400, 401, 404, 413, 422, 500"
        ],
        [
            "/audio/translate-bark",
            "POST",
            "Хуцалтын дууг хиймэл оюунаар хөрвүүлэх",
            "RequestBody (JSON): pet_id, audio_format, sample_rate_hz, audio_base64",
            "200 OK\n400, 401, 404, 422, 500"
        ],
        [
            "/webhooks/subscribe",
            "POST",
            "Амьтны үйл явдлыг сонсох вэбхүүк бүртгэх",
            "RequestBody (JSON): callback_url, event_types, secret_token, description",
            "201 Created\n400, 401, 422, 500"
        ],
        [
            "/audio/translations/{pet_id}",
            "GET",
            "Хуцалт орчуулгын түүхийн жагсаалт авах",
            "Path: pet_id, Query: limit (1..50 бүхэл тоо)",
            "200 OK\n400, 401, 404, 500"
        ]
    ]
    t_ep = doc.add_table(rows=1, cols=5)
    format_custom_table(t_ep, [1.4, 0.6, 1.6, 1.67, 1.0], ep_headers, ep_rows)

    add_heading_3(doc, "1.3 US-5.1 Жишээ Өгөгдөл Бүхий Endpoint-ийн Бүтэн YAML Спецификацийн Нотолгоо")
    add_body_p(
        doc,
        "US-5.1 шалгуурын дагуу бүх endpoint-д request-example болон response-example суулгагдсан бөгөөд доор 'POST /audio/translate-bark' endpoint-ийн бодит бүрэн YAML бүтцийг харуулав (бүрэн эх файл: docs/openapi/openapi.yaml):"
    )
    add_code_block(doc, """  /audio/translate-bark:
    post:
      summary: Translate canine vocalization audio to natural human language
      operationId: translateBarkAudio
      tags: [Translation]
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AudioTranslateRequest'
            example:
              pet_id: "corgi_98231"
              audio_format: "wav"
              sample_rate_hz: 44100
              audio_base64: "UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="
      responses:
        '200':
          description: Acoustic bark translation processed successfully.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AudioTranslateResponse'
              example:
                translation_id: "tx_bark_88412"
                pet_id: "corgi_98231"
                emotion: "Hungry / Demanding Attention"
                english_translation: "I demand dinner immediately! Where is the kibble?"
                confidence_score: 0.942
                frequency_hz: 852.4
                translated_at: "2026-10-05T08:25:12Z"
        '400':
          $ref: '#/components/responses/BadRequestError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '404':
          $ref: '#/components/responses/NotFoundError'
        '422':
          $ref: '#/components/responses/ValidationError'
        '500':
          $ref: '#/components/responses/InternalServerError'""")

    add_heading_3(doc, "1.4 Аюулгүй байдал (Bearer JWT) ба Алдааны Бүтэц")
    add_body_p(
        doc,
        "API-ийн аюулгүй байдлыг хангахын тулд RFC 7519 стандартад нийцсэн JSON Web Token (JWT) Bearer Authentication аргыг ашиглав. Энэхүү тохиргоо нь Swagger UI дээр 'Authorize' цоож бүхий интерактив модал цонх үүсгэдэг. "
        "Алдааны хувьд OpenAPI 3.0-ийн дахин ашиглагдах компонент стандартын дагуу ErrorResponse загварыг тодорхойлж, алдаа гарсан үед машин унших систем код (code), дэлгэрэнгүй тайлбар (message, details), цагийн тамга (timestamp), болон серверийн логтой уялдуулах хайлтын ID (request_id)-ийг буцаадаг болгов."
    )

    add_heading_3(doc, "1.5 @redocly/cli 2.57.0 Linter-ийн Баталгаажуулалт")
    add_body_p(
        doc,
        "Спецификацийг албан ёсны @redocly/cli 2.57.0 хэрэгслээр шалгахад синтакс алдаа болон холбоос тасарсан асуудалгүй амжилттай баталгаажсан:"
    )
    add_code_block(doc, """$ redocly lint docs/openapi/openapi.yaml
No configurations were provided -- using built in recommended configuration by default.

validating docs/openapi/openapi.yaml...
docs/openapi/openapi.yaml: validated in 55ms

Woohoo! Your API description is valid. 🎉""")

    # --------------------------------------------------------------------------
    # Бүлэг 2: US-5.2 & UE-5 — Bhatti-ийн 5 зарчмаар код жишээг аудит хийж сайжруулсан нь
    # --------------------------------------------------------------------------
    add_heading_2(doc, "Бүлэг 2: US-5.2 & UE-5 — Bhatti-ийн 5 Зарчмаар Код Жишээг Аудит Хийж Сайжруулсан нь")
    add_body_p(
        doc,
        "Jared Bhatti нарын 'Docs for Developers' (2021) номын 5-р бүлэг 'Integrating code samples' (хуудас 83–99)-т техникийн баримт бичгийн хэрэглэгчид тайлбар бичвэрээс илүүтэй код жишээг хамгийн түрүүнд хайж, хуулж ашигладаг болохыг Twilio-ийн баримтжуулалтын багийн судалгаанаас жишээ татан дурдсан байдаг (Bhatti et al., хуудас 84, зүүлт 3). Corg.ly төслийн өмнөх инженер Чад (Chad)-ын бичсэн legacy код жишээнүүдэд байсан сул талуудыг Bhatti-ийн 5 зарчмаар аудит хийж, бүрэн refactoring хийлээ."
    )

    add_heading_3(doc, "2.1 Bhatti-ийн 5 Зарчмын Онолын Шалгуурууд (pp. 86–94)")
    add_body_p(doc, "1. Explained (Тайлбарласан, хуудас 87): ", bold_prefix="• ")
    add_body_p(doc, "Кодын snippet-ийн өмнө 1–2 өгүүлбэрээр түүний гүйцэтгэх үүрэг, шаардагдах параметр, суурь хаягийг prose хэлбэрээр заавал тайлбарлана. Код дотор зөвхөн тайлбар коммент бичих нь хангалтгүй.")
    add_body_p(doc, "2. Concise (Товч бөгөөд тодорхой, хуудас 90): ", bold_prefix="• ")
    add_body_p(doc, "Шаардлагагүй boilerplate кодыг цэвэрлэж, зөвхөн тухайн API дуудлага болон payload-д гол анхаарлыг хандуулна. requests.post-д json= ашиглаж байгаа үед илүүдэл Content-Type толгой тавихгүй.")
    add_body_p(doc, "3. Clear (Ойлгомжтой, хуудас 92): ", bold_prefix="• ")
    add_body_p(doc, "Хувьсагчийн нэрс нь утга илэрхийлсэн (descriptive) байна. 't' биш 'auth_token', 'res' биш 'translation_result' гэх мэт стандарт нэршил, PEP 8 догол мөрийг баримтална.")
    add_body_p(doc, "4. Usable (Шууд хэрэглэж болохуйц, хуудас 93): ", bold_prefix="• ")
    add_body_p(doc, "Шууд хуулж тавихад алдаа заадаг 'foo', 'bar', 'test' гэсэн утгагүй орлуулагчдыг устгаж, 'your_pet_photo.jpg', 'replace_with_real_bark.wav' гэх мэт домайны тодорхой орлуулагчтай, дуудаж ажиллуулах 3–4 мөр жишээг хавсаргана.")
    add_body_p(doc, "5. Trustworthy (Итгэл даахуйц, хуудас 94): ", bold_prefix="• ")
    add_body_p(doc, "Таамгаар / дураараа зохиосон хуурамч бүтэц биш, бодит серверийн туршилт эсвэл OpenAPI мок сервер (Stoplight Prism)-ээс баталгаажсан бодит JSON хариултын өгөгдлийг баримтад тусгана.")

    add_heading_3(doc, "2.2 Endpoint 1: POST /v1/pets/upload-photo (Multipart өгөгдөл бүхий фото upload)")
    add_body_p(
        doc,
        "Тайлбар (Prose Context): Энэхүү функц нь бүртгэгдсэн тэжээвэр амьтны өндөр нягтаршилтай зургийн файлыг Corg.ly платформд multipart/form-data хэлбэрээр илгээнэ. Дуудахдаа серверийн суурь хаяг api_base_url ('https://api.corg.ly/v1' эсвэл 'http://127.0.0.1:4010'), JWT Bearer токен, өмнө нь бүртгэгдсэн pet_id ('corgi_98231'), болон зургийн файлын замыг дамжуулна."
    )
    add_body_p(doc, "Чадын өмнөх legacy код (BEFORE — Anti-patterns):", bold_prefix="[1] ")
    add_code_block(doc, """# Chad's legacy code - NO EXPLANATION, USES FOO/BAR, SINGLE-LETTER VARS
import requests, sys, os
t = "foo_token"
f = open("bar.jpg", "rb")
r = requests.post("http://localhost:8080/foo", headers={"auth": t}, files={"file": f})
print(r.text) # Fake mock output: {"status": "ok"}""")

    add_body_p(doc, "Bhatti-ийн 5 зарчмаар сайжруулсан код (AFTER — Refactored & Usable):", bold_prefix="[2] ")
    add_code_block(doc, """import os
import requests

def upload_pet_photo(api_base_url: str, auth_token: str, pet_id: str, image_file_path: str) -> dict:
    endpoint_url = f"{api_base_url}/pets/upload-photo"
    headers = {"Authorization": f"Bearer {auth_token}"}
    filename = os.path.basename(image_file_path)
    
    with open(image_file_path, "rb") as photo_stream:
        multipart_files = {"photo_file": (filename, photo_stream, "image/jpeg")}
        form_data = {"pet_id": pet_id}
        
        response = requests.post(endpoint_url, headers=headers, data=form_data, files=multipart_files, timeout=15)
        response.raise_for_status()
        return response.json()

# Шууд хуулж ажиллуулах хэрэглээний блок (Usable invocation with domain placeholders):
auth_token = "replace_with_your_jwt_token"
pet_response = upload_pet_photo(
    api_base_url="https://api.corg.ly/v1",
    auth_token=auth_token,
    pet_id="corgi_98231",
    image_file_path="your_pet_photo.jpg"
)
print("Uploaded URL:", pet_response["photo_url"])""")

    add_body_p(doc, "Prism Mock серверээс бодитоор баталгаажсан хариулт (Trustworthy Output via Prism):", bold_prefix="[3] ")
    add_code_block(doc, """{
  "photo_url": "https://media.corg.ly/photos/corgi_98231_20261005.jpg",
  "pet_id": "corgi_98231",
  "file_size_bytes": 1482910,
  "mime_type": "image/jpeg",
  "uploaded_at": "2026-10-05T08:20:45Z"
}""")

    add_heading_3(doc, "2.3 Endpoint 2: POST /v1/audio/translate-bark (Хуцалтын дууг хөрвүүлэх)")
    add_body_p(
        doc,
        "Тайлбар (Prose Context): Энэхүү функц нь тэжээвэр амьтны хуцалтын аудио бичлэгийг Corg.ly мэдрэлийн сүлжээний загварт илгээн хүний хэл рүү хөрвүүлнэ. Аудио файлыг Base64 форматаар кодлож, амьтны таних дугаар (pet_id), аудио форматын хамт илгээн сэтгэл хөдлөлийн байдал болон англи хэлний утгыг буцаан авна."
    )
    add_body_p(doc, "Чадын өмнөх legacy код (BEFORE — Anti-patterns):", bold_prefix="[1] ")
    add_code_block(doc, """# Missing explanation, fake mock return, vague parameter names
import requests, base64
d = open("test.wav", "rb").read()
b = base64.b64encode(d).decode()
res = requests.post("https://api.corg.ly/v1/bark", json={"data": b})
# Chad's fake output: {"msg": "bark translated"}""")

    add_body_p(doc, "Bhatti-ийн 5 зарчмаар сайжруулсан код (AFTER — Refactored & Usable):", bold_prefix="[2] ")
    add_code_block(doc, """import base64
import requests

def translate_bark_audio(api_base_url: str, auth_token: str, pet_id: str, audio_file_path: str) -> dict:
    endpoint_url = f"{api_base_url}/audio/translate-bark"
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    with open(audio_file_path, "rb") as audio_stream:
        encoded_audio_bytes = base64.b64encode(audio_stream.read()).decode("utf-8")
        
    translation_payload = {
        "pet_id": pet_id,
        "audio_format": "wav",
        "sample_rate_hz": 44100,
        "audio_base64": encoded_audio_bytes
    }
    response = requests.post(endpoint_url, headers=headers, json=translation_payload, timeout=20)
    response.raise_for_status()
    return response.json()

# Шууд хуулж ажиллуулах хэрэглээний блок (Usable invocation with domain placeholders):
auth_token = "replace_with_your_jwt_token"
translation_result = translate_bark_audio(
    api_base_url="https://api.corg.ly/v1",
    auth_token=auth_token,
    pet_id="corgi_98231",
    audio_file_path="replace_with_real_bark.wav"
)
print("Translation:", translation_result["english_translation"])""")

    add_body_p(doc, "Prism Mock серверээс бодитоор баталгаажсан хариулт (Trustworthy Output via Prism):", bold_prefix="[3] ")
    add_code_block(doc, """{
  "translation_id": "tx_bark_88412",
  "pet_id": "corgi_98231",
  "emotion": "Hungry / Demanding Attention",
  "english_translation": "I demand dinner immediately! Where is the kibble?",
  "confidence_score": 0.942,
  "frequency_hz": 852.4,
  "translated_at": "2026-10-05T08:25:12Z"
}""")

    add_heading_3(doc, "2.4 Endpoint 3: POST /v1/webhooks/subscribe (Вэбхүүк бүртгэх)")
    add_body_p(
        doc,
        "Тайлбар (Prose Context): Энэхүү функц нь амьтны идэвхтэй үйл явдлууд (хуцалт хөрвүүлэгдсэн, тэжээл дууссан)-ын мэдэгдлийг хүлээн авах гадаад HTTPS listener URL-ийг системд бүртгэнэ. Дуудлагад callback_url болон HMAC-SHA256 гарын үсэг шалгах secret_token-ийг зааж өгөх ба амжилттай болбол 201 Created код бүхий бүртгэлийн баталгаажуулалт буцна."
    )
    add_body_p(doc, "Чадын өмнөх legacy код (BEFORE — Anti-patterns):", bold_prefix="[1] ")
    add_code_block(doc, """# Chad used localhost, foo urls, no secret token validation
import requests
requests.post("http://corg.ly/hook", json={"url": "http://foo.com/bar"})""")

    add_body_p(doc, "Bhatti-ийн 5 зарчмаар сайжруулсан код (AFTER — Refactored & Usable):", bold_prefix="[2] ")
    add_code_block(doc, """import requests

def subscribe_event_webhook(api_base_url: str, auth_token: str, callback_url: str, hmac_secret_token: str) -> dict:
    endpoint_url = f"{api_base_url}/webhooks/subscribe"
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    subscription_payload = {
        "callback_url": callback_url,
        "event_types": ["bark.translated", "pet.activity_alert"],
        "secret_token": hmac_secret_token,
        "description": "Smart Pet Feeder Automated Callback Listener"
    }
    response = requests.post(endpoint_url, headers=headers, json=subscription_payload, timeout=10)
    response.raise_for_status()
    return response.json()

# Шууд хуулж ажиллуулах хэрэглээний блок (Usable invocation with domain placeholders):
auth_token = "replace_with_your_jwt_token"
subscription_result = subscribe_event_webhook(
    api_base_url="https://api.corg.ly/v1",
    auth_token=auth_token,
    callback_url="https://smartfeeder.iot.example.com/api/v1/corgly-events",
    hmac_secret_token="replace_with_your_hmac_secret_token_min16"
)
print("Subscription ID:", subscription_result["subscription_id"])""")

    add_body_p(doc, "Prism Mock серверээс бодитоор баталгаажсан хариулт (Trustworthy Output via Prism):", bold_prefix="[3] ")
    add_code_block(doc, """HTTP/1.1 201 Created
{
  "subscription_id": "wh_sub_55109",
  "callback_url": "https://smartfeeder.iot.example.com/api/v1/corgly-events",
  "event_types": ["bark.translated", "pet.activity_alert"],
  "status": "active",
  "secret_preview": "sec_wh_corgi...9f02b",
  "created_at": "2026-10-05T08:30:00Z"
}""")

    add_heading_3(doc, "2.5 Код Жишээний Чанарын Аудит Үнэлгээний Карт (Audit Scorecard Table)")
    add_body_p(
        doc,
        "Лабораторийн шалгуурын дагуу refactoring хийсэн 3 код жишээ тус бүрийг 1-ээс 5 бүтэн одоор үнэлэн доорх хүснэгтэд нэгтгэв. Нийт оноо 72 / 15 буюу дундаж үнэлгээ 4.80 / 5.00 од (96.0%) болж, шаардлагатай 80%-ийн босгыг бүрэн хангав:"
    )

    sc_headers = ["Sample Code Target", "Explained (1-5★)", "Concise (1-5★)", "Clear (1-5★)", "Usable (1-5★)", "Trustworthy (1-5★)"]
    sc_rows = [
        [
            "POST /v1/pets/upload-photo",
            "★★★★★ (5)\nКод бүрийн өмнө зорилго, параметрийг prose хэлбэрээр тайлбарласан",
            "★★★★☆ (4)\nБойлерплейт багасгасан; файл нээх үйлдлээс шалтгаалан 4 од",
            "★★★★★ (5)\nauth_token, photo_stream зэрэг descriptive хувьсагчтай",
            "★★★★★ (5)\n'your_pet_photo.jpg' домайн placeholder ба дуудалтын блоктой",
            "★★★★★ (5)\nPrism Mock серверээс 200 OK кодоор баталгаажсан payload"
        ],
        [
            "POST /v1/audio/translate-bark",
            "★★★★☆ (4)\nАудионы шаардлагыг тайлбарласан; нарийвчилсан алдааг нэмж болно",
            "★★★★★ (5)\nИлүүдэл Content-Type толгойг хасаж цэвэрлэсэн",
            "★★★★★ (5)\nPEP 8 стандарт, camelCase биш snake_case нэршил мөрдсөн",
            "★★★★★ (5)\n'replace_with_real_bark.wav' домайн зам ба дуудалтын блоктой",
            "★★★★★ (5)\nPrism Mock серверээс тестлэгдсэн нарийвчлал 0.942 хариу"
        ],
        [
            "POST /v1/webhooks/subscribe",
            "★★★★★ (5)\nВэбхүүкийн callback үүрэг, нууц түлхүүрийг тайлбарласан",
            "★★★★★ (5)\nТовч, өндөр бүтээмжтэй, зөвхөн API логикт төвлөрсөн",
            "★★★★☆ (4)\nHMAC нууц түлхүүрийн хамгийн бага уртын шаардлагыг заасан",
            "★★★★★ (5)\nБодит домэйн hook URL, бүрэн ажиллагаатай дуудалтын блоктой",
            "★★★★★ (5)\nPrism Mock серверээс баталгаажсан 201 Created статус"
        ]
    ]
    t_sc = doc.add_table(rows=1, cols=6)
    format_custom_table(t_sc, [1.5, 0.95, 0.95, 0.95, 0.96, 0.96], sc_headers, sc_rows)

    add_body_p(
        doc,
        "Үнэлгээний тооцоолол: (5 + 4 + 5 + 5 + 5) + (4 + 5 + 5 + 5 + 5) + (5 + 5 + 4 + 5 + 5) = 24 + 24 + 24 = 72 нийт оноо. Дундаж оноо: 72 / 15 = 4.80 од буюу 96.0% амжилттай."
    )

    if os.path.exists("diagrams/w5-bhatti-audit-matrix.png"):
        doc.add_picture("diagrams/w5-bhatti-audit-matrix.png", width=Inches(5.5))
        p_cap2 = doc.add_paragraph()
        p_cap2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        rc2 = p_cap2.add_run("Зураг 2.1: Bhatti-ийн 5 Зарчмын Радар Диаграмм (Чадын Legacy код vs Сайжруулсан хувилбар)")
        rc2.font.name = "Times New Roman"
        rc2.font.size = Pt(9.5)
        rc2.italic = True
        rc2.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

    # --------------------------------------------------------------------------
    # Бүлэг 3: Бонус Даалгавар (+10% Grade) — Автомат CI Тестийн Хоолой
    # --------------------------------------------------------------------------
    add_heading_2(doc, "Бүлэг 3: Бонус Даалгавар (+10% Grade) — Код Жишээг CI Тестэд Холбосон нь")
    add_body_p(
        doc,
        "Jared Bhatti et al. (2021) номын 96-р хуудас 'Designing Code Samples — Testing' хэсэгт код жишээнүүдийг баримт бичгийн салшгүй нэг хэсэг болгон төслийн автомат тестийн хоолойд (continuous integration) оруулж шалгахын чухлыг онцолсон байдаг. Лабораторийн урамшууллын +10%-ийн болзлыг биелүүлэхийн тулд бүх код жишээг Python-ийн unittest хүрээгээр бодитоор туршин баталгаажуулах тестийн багц (tests/test_corgly_samples.py) болон GitHub Actions CI ажлын урсгалыг (.github/workflows/api-ci.yml) бүтээв."
    )

    if os.path.exists("diagrams/w5-ci-pipeline.png"):
        doc.add_picture("diagrams/w5-ci-pipeline.png", width=Inches(6.27))
        p_cap3 = doc.add_paragraph()
        p_cap3.alignment = WD_ALIGN_PARAGRAPH.CENTER
        rc3 = p_cap3.add_run("Зураг 3.1: GitHub Actions CI/CD Автомат Шатах Хоолойн Бүтэц ба Үе Шатууд")
        rc3.font.name = "Times New Roman"
        rc3.font.size = Pt(9.5)
        rc3.italic = True
        rc3.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

    add_body_p(
        doc,
        "Тестийг локал болон CI орчинд гүйцэтгэсэн терминалын үр дүн:"
    )
    add_code_block(doc, """$ /opt/homebrew/bin/python3.11 -m unittest discover tests
...
----------------------------------------------------------------------
Ran 3 tests in 0.004s

OK""")

    add_heading_3(doc, "3.1 GitHub Actions Ажлын Урсгалын Тохиргоо (.github/workflows/api-ci.yml)")
    add_body_p(
        doc,
        "GitHub Pages deploy болон авто тестийг хослуулсан CI/CD ажлын урсгал:"
    )
    if os.path.exists(".github/workflows/api-ci.yml"):
        with open(".github/workflows/api-ci.yml", "r") as f:
            add_code_block(doc, f.read())

    # --------------------------------------------------------------------------
    # Бүлэг 4: US-5.3 & US-5.4 — Хос Рендерер Байршуулалт ба Шийдвэрийн Тайлан
    # --------------------------------------------------------------------------
    add_heading_2(doc, "Бүлэг 4: US-5.3 & US-5.4 — Хос Рендерер Байршуулалт ба 100-Үгийн Харьцуулсан Шийдвэрийн Тайлан")
    add_body_p(
        doc,
        "Chris Chinchilla (2024, Ch. 2 pp. 18–22; Ch. 6 p. 79) болон Bhatti et al. (2021, Ch. 7 pp. 121–130)-д зааснаар баримтжуулалтыг хэрэглэгчийн хэрэгцээнд тохируулан олон сувгаар (multi-channel) үзүүлэх нь хамгийн өндөр үр дүнтэй байдаг. Спецификацийг интерактив туршилтын Swagger UI болон уншихад хамгийн тааламжтай Redoc системүүдэд зэрэг хөрвүүлэн GitHub Pages дээр нийтэд нээлттэй байршууллаа."
    )

    if os.path.exists("diagrams/w5-swagger-vs-redoc.png"):
        doc.add_picture("diagrams/w5-swagger-vs-redoc.png", width=Inches(6.27))
        p_cap4 = doc.add_paragraph()
        p_cap4.alignment = WD_ALIGN_PARAGRAPH.CENTER
        rc4 = p_cap4.add_run("Зураг 4.1: Swagger UI (Интерактив Sandbox) ба Redoc (3 баганат Reference View) системийн харьцуулалт")
        rc4.font.name = "Times New Roman"
        rc4.font.size = Pt(9.5)
        rc4.italic = True
        rc4.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

    add_heading_3(doc, "4.1 100-Үгийн Харьцуулсан Шийдвэрийн Тайлан (100-Word Decision Report)")
    add_body_p(
        doc,
        "Лабораторийн шалгуурын дагуу үгийн тоог Python-оор нарийвчлан шалгаж яг 100 үг болгон бэлтгэсэн шийдвэрийн тайлан (docs/openapi/decision-report.md):"
    )
    add_callout_box(
        doc,
        "Our comparative evaluation demonstrates distinct operational trade-offs between Swagger UI and Redoc for API documentation. Redoc provides superior layout readability through its responsive three-panel architecture, cleanly separating navigation hierarchy, explanatory prose, and synchronized request-response schemas. Furthermore, its instantaneous client-side full-text search across all parameters and models drastically minimizes cognitive overhead during reading workflows. Conversely, Swagger UI excels in sandbox utility through its interactive Try-It-Out console, enabling real-time JWT authentication, live multipart file execution, and direct HTTP inspection. Therefore, our team adopts Redoc for public reference documentation while maintaining Swagger UI internally within staging environments for rapid integration testing and debugging.\n\n"
        "[Verified Word Count: Exactly 100 words | Баталгаажуулсан үгийн тоо: Яг 100 үг]",
        title="100-Word Decision Report (Official English Text - Exactly 100 Words)"
    )

    add_body_p(
        doc,
        "Монгол орчуулга ба тайлбар: Бидний үнэлгээгээр Swagger UI болон Redoc системүүд нь эрс ялгаатай давуу талуудтай байна. Redoc нь навигаци, тайлбар бичвэр, өгөгдлийн бүтцийг зэрэгцүүлэн харуулдаг 3 баганат зохион байгуулалт болон клиент талын агшин зуурын бүрэн хайлтын системийнхээ ачаар баримт уншиж буй хөгжүүлэгчийн танин мэдэхүйн ачааллыг үлэмж хэмжээгээр бууруулдаг. Харин Swagger UI нь JWT токен оруулах, multipart файлыг шууд дамжуулах, хүсэлт хариултыг шууд хянах 'Try-It-Out' интерактив хамгаалагдсан орчноороо туршилт хийхэд давуу юм. Иймд манай баг нийтийн техникийн лавлахад Redoc-ийг, харин хөгжүүлэлтийн дотоод туршилтад Swagger UI-ийг хослуулан ашиглахаар эцсийн шийдвэр гаргав."
    )

    add_heading_3(doc, "4.2 Swagger UI vs Redoc Техникийн Нарийвчилсан Харьцуулалтын Матриц")
    add_body_p(
        doc,
        "Хоёр системийн үндсэн үзүүлэлтүүдийг дараах хүснэгтээр харьцуулав:"
    )

    ren_headers = ["Үнэлгээний Хэмжүүр", "Swagger UI (Sandbox)", "Redoc (Reader View)", "Шийдвэр ба Зөвлөмж"]
    ren_rows = [
        [
            "Хайлтын Хурд ба Нарийвчлал",
            "Зөвхөн endpoint нэрээр шүүнэ; схемийн гүн рүү хайж чадахгүй (Ctrl+F шаардлагатай).",
            "Бүх параметр, тайлбар, схемээр агшин зуурт хайх санах ойн индекс бүхий хурдан хайлттай.",
            "Ялагч: Redoc. Том хэмжээний API-д хурдан хайж олох боломжийг олгодог."
        ],
        [
            "Бүтэц ба Уншихад Хялбар Байдал",
            "Нэг баганат аккордеон; олон endpoint-тэй үед босоо чиглэлд хэт урт гүйлгэлт үүсгэдэг.",
            "Зүүн талд навигаци, дунд нь тайлбар, баруун талд код бүхий Stripe загварын 3 баганат бүтэц.",
            "Ялагч: Redoc. Уншигчийн анхаарлыг сарниулахгүй цэгцтэй байдлыг хангадаг."
        ],
        [
            "Try-It-Out Интерактив Туршилт",
            "Браузераас шууд BearerAuth JWT хийж, multipart файл илгээн бодит дуудлага хийх боломжтой.",
            "Зөвхөн статик лавлах; гадны залгаасгүйгээр шууд дуудлага хийх чадваргүй.",
            "Ялагч: Swagger UI. QA инженер болон хөгжүүлэгчид интеграцийн туршилт хийхэд зайлшгүй чухал."
        ],
        [
            "Байршуулалт ба Хөнгөн Байдал",
            "Client талд динамикаар DOM бүтээж YAML/JSON татдаг тул нүсэр, хүнд.",
            "@redocly/cli build-docs-оор ямар ч хамааралгүй дан ганц HTML файл (150 KiB) үүсгэдэг.",
            "Ялагч: Redoc. Статик CDN болон GitHub Pages дээр байршуулахад нэн тохиромжтой."
        ],
        [
            "Нээлттэй Public URL (GitHub Pages)",
            "https://saruul3339.github.io/ICSI438-pd/swagger.html",
            "https://saruul3339.github.io/ICSI438-pd/",
            "Хос байршуулалт GitHub Actions хоолойгоор автоматаар шинэчлэгдэнэ."
        ]
    ]
    t_ren = doc.add_table(rows=1, cols=4)
    format_custom_table(t_ren, [1.3, 1.8, 1.8, 1.37], ren_headers, ren_rows)

    # --------------------------------------------------------------------------
    # Бүлэг 5: Agile Ceremonies ба Чанарын Хяналтын Цэгүүд
    # --------------------------------------------------------------------------
    add_heading_2(doc, "Бүлэг 5: Agile Ceremonies ба Чанарын Хяналтын Цэгүүд")
    
    add_heading_3(doc, "5.1 Daily Standup (3 Асуултын Тайлан)")
    add_body_p(doc, "1. Өнөөдрийн байдлаар манай спецификацид хүчинтэй хэдэн endpoint байна вэ? (Зорилт: >= 5):", bold_prefix="Асуулт 1: ")
    add_body_p(doc, "Нийт 6 хүчинтэй endpoint (/pets, /pets/{id}, /pets/upload-photo, /audio/translate-bark, /webhooks/subscribe, /audio/translations/{id}) бүрэн тодорхойлогдсон бөгөөд redocly lint-ээр 0 алдаатай баталгаажсан тул зорилт 120% биелсэн. Түүнчлэн хөтөч төсөл Cluvr-ийн 5 endpoint-ийг мөн бүрэн тодорхойлж баталгаажуулсан.")
    
    add_body_p(doc, "2. Bhatti-ийн дүрмийн дагуу бид ямар код жишээнүүдийг аудит хийж шалгасан бэ?:", bold_prefix="Асуулт 2: ")
    add_body_p(doc, "UE-5 даалгаврын 3 үндсэн Python код жишээг (upload_pet_photo, translate_bark_audio, subscribe_event_webhook) Explained, Concise, Clear, Usable, Trustworthy 5 зарчмаар бүрэн аудит хийж, 72/15 оноо буюу 96.0%-ийн үнэлгээгээр баталгаажуулсан.")
    
    add_body_p(doc, "3. Ямар HTTP алдааны хариултын кодууд (4xx/5xx) дутуу байна вэ?:", bold_prefix="Асуулт 3: ")
    add_body_p(doc, "Endpoint тус бүрийн онцлогт хамаарах 4xx/5xx алдааны кодуудыг бүрэн тодорхойлсон. Тухайлбал, /pets/{id}-д 400 болон 404, upload-photo-д 404 болон 413, 422, translations-д 400 болон 404, нийт замуудад 401 Unauthorized болон 500 Internal Server Error-ийг ErrorResponse бүрэлдэхүүн хэсэгтэй холбосон тул дутуу алдааны хариу байхгүй.")

    add_heading_3(doc, "5.2 Sprint Retrospective (3 Асуултын Үнэлгээ)")
    add_body_p(doc, "1. Бид API-ийн баталгаажуулалтын ямар стратегийг сонгож баримтжуулсан бэ?:", bold_prefix="Асуулт 1: ")
    add_body_p(doc, "Бид салбарын стандарт RFC 7519 Bearer JWT аутентификацийг сонгосон. Энэ нь Swagger UI дээр бүх endpoint-ийг хамгаалсан интерактив цоож үүсгэж, хөгжүүлэгч токеноо оруулаад бүх үйлдлийг турших найдвартай байдлыг олгосон.")
    
    add_body_p(doc, "2. Манай ноорог төсөлд утгагүй ерөнхий орлуулагчид (foo/bar) хаана нуугдсан байсан бэ?:", bold_prefix="Асуулт 2: ")
    add_body_p(doc, "Чадын хуучин кодоос өвлөгдөж ирсэн 'foo_token', 'http://localhost:8080/foo', 'test.wav' зэрэг сөрөг хандлагуудыг илрүүлж, оронд нь 'corgi_98231', 'your_pet_photo.jpg', 'replace_with_real_bark.wav', 'https://smartfeeder.iot.example.com/api/v1/corgly-events' зэрэг домайны бодит утгуудаар 100% сольж, доор нь шууд хуулж ажиллуулах дуудалтын кодыг нэмэв.")
    
    add_body_p(doc, "3. Манай баг олон нийтийн баримтад яагаад Swagger UI-ийн оронд Redoc-ийг сонгосон бэ?:", bold_prefix="Асуулт 3: ")
    add_body_p(doc, "Swagger UI нь уншигчийн анхаарлыг сарниулдаг урт аккордеон бүтэцтэй байдаг бол Redoc нь 3 баганат бүтэц, хурдан бүрэн текст хайлт, тодорхой уншигдах чадвараараа шинэ хөгжүүлэгчийн танин мэдэхүйн ачааллыг багасгаж чаддаг тул нийтийн лавлахад Redoc-ийг сонгосон.")

    # --------------------------------------------------------------------------
    # Бүлэг 6: Ном Зохиолын Эшлэлтэй 3 Эцсийн Эргэцүүлэл
    # --------------------------------------------------------------------------
    add_heading_2(doc, "Бүлэг 6: Ном Зохиолын Эшлэлтэй 3 Эцсийн Эргэцүүлэл (Weekly Reflection Questions)")

    add_heading_3(doc, "6.1 Bhatti et al. Ch. 5-ын миний өмнөх баримтжуулалтын дадлыг хамгийн их өөрчилсөн ойлголт")
    add_body_p(
        doc,
        "Jared Bhatti et al. (2021) 'Docs for Developers' номын 5-р бүлэг, хуудас 89 дээрх 'Listing 5-4. Match sample requests to exact outputs', хуудас 94 дээрх 'Trustworthy principle', болон хуудас 96–97 дээрх код жишээг CI автомат тестийн хоолойгоор тасралтгүй шалгах үзэл баримтлал миний хуучин дадлыг хамгийн ихээр сорьж, эерэгээр өөрчиллөө. "
        "Өмнө нь би баримт бичигт оруулж буй кодоо зүгээр л гоёл чимэглэлийн бичвэр төдийгөөр үзэж, хариултыг нь таамгаар / дураараа зохиосон хуурамч JSON бүтэцтэйгээр үлдээдэг байсан. Харин Bhatti нарын номд зааснаар код жишээ нь өөрөө программ хангамжийн бие даасан бүрэлдэхүүн бөгөөд бодит сервер эсвэл OpenAPI мок серверийн буцаасан хариутай нэг бүрчлэн таарч байх ёстой. Түүнчлэн хуудас 96 дээр код жишээг CI автомат хоолойд холбон тестэлж шалгахгүй бол төслийн код шинэчлэгдэх явцад баримт тэр дороо хуучирч, хэрэглэгчийн итгэлийг үгүй хийдэг болохыг практик туршилтаар ойлгож авлаа."
    )

    add_heading_3(doc, "6.2 Chris Chinchilla (2024) номоос ирээдүйн мэргэжлийн төслүүдэд ашиглах концепц")
    add_body_p(
        doc,
        "Chris Chinchilla (2024) 'Technical Writing for Software Developers' номын 2-р бүлэг (хуудас 18–22)-ийн 'API Specifications as Single Source of Truth' болон 6-р бүлэг (хуудас 79)-ийн 'Rendering Documentation' концепцыг би ирээдүйн бүх мэргэжлийн төслүүддээ тууштай хэрэгжүүлэх болно. "
        "Chinchilla-ийн онцолсноор баримт бичгийг гараар салангид бичихийн оронд машин унших боломжтой OpenAPI YAML стандартыг гэрээ (contract-first) болгон эхэлж тодорхойлбол фронтенд болон бакенд баг нэгэн зэрэг зөрүүгүй ажиллах боломж бүрддэг. Цаашилбал, 6-р бүлгийн хуудас 79-д заасанчлон нэг файл бүхий спецификациас Swagger UI (интерактив туршилт), Redoc (3 баганат лавлах), болон автомат SDK-ийг өөр өөр зорилтот уншигчдад зориулан нэг ч мөр бичвэр давхардуулахгүйгээр автоматаар үүсгэж болох нь төслийн үр ашгийг үлэмж нэмэгдүүлдэг болохыг баталгаажууллаа."
    )

    add_heading_3(doc, "6.3 Бидний хөтөч төсөл (Cluvr) дээрх онол ба практикийн хамгийн том зөрүү")
    add_body_p(
        doc,
        "Бидний үндсэн хөтөч төсөл болох Cluvr (Их сургуулийн клуб, арга хэмжээний веб платформ) дээр ажиглагдаж буй ном сурах бичгийн онол ба бодит хэрэгжүүлэлтийн хамгийн том зөрүү нь: 'Амьд гэрээт спецификацийг тасралтгүй хадгалах зардал ба бодит хөгжүүлэлтийн хурд хоорондын зөрчил' юм. "
        "Bhatti болон Chinchilla нар бакендийн ямар ч өөрчлөлт орохоос өмнө спецификацийг түрүүлж засаж, бүх CI шалгуурыг давуулах ёстой гэж заадаг. Гэтэл бодит оюутны болон стартапын орчинд хөгжүүлэгч төслийн эцсийн хугацаа (deadline)-д шахагдан Express контроллер эсвэл PostgreSQL хүснэгтийн баганыг шууд өөрчлөх явдал түгээмэл тохиолддог. Ингэснээр openapi.yaml файл бодит кодоосоо хоцорч, баримтын үнэ цэн алдагдах эрсдэл бий болдог. Энэхүү зөрүүг арилгах ганц арга зам бол энэхүү Sprint 05-д хэрэгжүүлсэн шиг commit хийх бүрт спецификацийн linter болон код жишээний unit test заавал амжилттай давж байж нэгтгэгддэг хатуу автомат хоолойг (Git pre-commit hooks, GitHub Actions CI) анхнаас нь суурилуулах явдал болохыг бүрэн ойлгож авлаа."
    )

    # --------------------------------------------------------------------------
    # Хавсралт: Төслийн бүтэц ба файлуудын лавлах
    # --------------------------------------------------------------------------
    add_heading_2(doc, "Хавсралт: Төслийн Бүтэц ба Үүсгэсэн Файлуудын Лавлах")
    add_body_p(
        doc,
        "Sprint 05-ийн хүрээнд хийгдсэн бүх код, спецификаци, баримтууд төслийн дараах бүтцэд хадгалагдсан бөгөөд GitHub репозиторт (https://github.com/saruul3339/ICSI438-pd) байршиж байна:"
    )
    add_code_block(doc, """ICSI438:pd/
├── docs/
│   └── openapi/
│       ├── openapi.yaml           # Corg.ly OpenAPI 3.0.3 албан ёсны машин унших спецификаци
│       ├── cluvr-openapi.yaml     # Cluvr хөтөч төслийн OpenAPI 3.0.3 спецификаци (5 endpoints)
│       └── decision-report.md     # Яг 100 үг бүхий харьцуулсан шийдвэрийн тайлан
├── public/
│   ├── index.html                 # Redoc бие даасан статик HTML лавлах (150 KiB)
│   ├── swagger.html               # Swagger UI Try-It-Out интерактив хамгаалагдсан орчин
│   ├── openapi.yaml               # Corg.ly статик спецификаци (GitHub Pages түгээлт)
│   └── cluvr-openapi.yaml         # Cluvr статик спецификаци (GitHub Pages түгээлт)
├── scripts/
│   ├── corgly_client.py           # Bhatti 5 зарчмаар сайжруулсан, дуудалтын блок бүхий Python код
│   ├── generate_diagrams.py       # Тайлангийн өндөр нягтаршилтай 4 диаграммыг үүсгэгч
│   ├── docx_helpers.py            # Word тайлангийн загварчлалын туслах функцууд
│   └── create_phtbb5_docx.py      # PHTBB-5.docx тайлан файлыг угсрагч үндсэн скрипт
├── tests/
│   └── test_corgly_samples.py     # Бонус даалгавар: 3 код жишээг шалгагч автомат unit тестүүд
├── .github/
│   └── workflows/
│       └── api-ci.yml             # GitHub Actions CI/CD (redocly lint + unittest + pages deploy)
├── diagrams/
│   ├── w5-api-architecture.png    # Системийн архитектур зураг (Гэрээт спецификаци салангид)
│   ├── w5-api-architecture.mmd    # Mermaid эх код
│   ├── w5-bhatti-audit-matrix.png # Bhatti 5 зарчмын радар диаграмм (72/15 = 4.80 од)
│   ├── w5-swagger-vs-redoc.png    # Хос рендерерийн харьцуулсан зураг
│   ├── w5-swagger-vs-redoc.mmd    # Mermaid эх код
│   ├── w5-ci-pipeline.png         # CI/CD Pages deploy бүхий автомат хоолойн зураг
│   └── w5-ci-pipeline.mmd         # Mermaid эх код
└── PHTBB-5.docx                   # Эцсийн нэгдсэн тайлан файл (Бүрэн засварлагдсан хувилбар)""")

    doc.save("PHTBB-5.docx")
    print("PHTBB-5.docx successfully generated with all review points addressed!")


if __name__ == "__main__":
    generate_report()
