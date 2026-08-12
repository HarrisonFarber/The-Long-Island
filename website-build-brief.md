# Website Build Brief — The Long Island Cleanout Company

Use this as the spec/prompt for building the site. It covers everything requested, plus the design system already established in the homepage and payment-page mockups (`index.html`, `invoice.html`) so the finished build matches them.

---

## 1. Project Overview

Build a full-stack marketing + lead-generation + operations website for **The Long Island Cleanout Company**, a junk removal, property cleanout, and hauling business serving Nassau & Suffolk County, NY.

- **Tagline:** "We clean it out. You move forward."
- **Business email:** longislandcleanoutcompany@gmail.com *(Google Workspace on a real domain is recommended once one is purchased — see Section 10)*
- **Primary goal:** generate leads/quote requests that convert into paid jobs. The site is also the landing target linked from the owner's Google Business Profile, so SEO and mobile performance matter as much as the design.
- **No domain purchased yet** — factor domain + hosting setup into the build (see Section 10).

---

## 2. Brand & Design System

Two reference mockups already exist and should be treated as the source of truth for visual style: a homepage (`index.html`) and a customer payment/invoice page (`invoice.html`). Match their design tokens exactly:

**Color tokens**
```
--navy:       #0B2140   (primary — header, footer, dark sections)
--navy-2:     #14315C   (secondary navy, gradients)
--green:      #6FAE2E   (CTA / action color)
--green-dark: #4F8A1C   (hover states)
--paper:      #F3F6F5   (page background)
--paper-2:    #E9EEEC   (alt section background)
--ink:        #101B2D   (body text)
--ink-soft:   #4A5568   (secondary text)
--sky:        #CFE3F2   (light accent backgrounds, icon wells)
```

**Typography**
- Display / headings: `Anton` (Google Fonts), uppercase, tight letter-spacing
- Labels / eyebrows / nav: `Barlow Condensed`, weight 600–700, uppercase, letter-spaced
- Body: `Inter`, weights 400–600

**Layout signature elements (carry through to every page)**
- Angled section dividers (`clip-path` ramps) instead of straight edges, evoking loading ramps/motion
- A simplified Long Island silhouette (SVG path already built) used as a watermark and in the service-area map
- A numbered 3-step process graphic for "How It Works" — only use numbering where content is genuinely sequential
- Rounded-corner cards (6–10px radius), soft shadow (`0 20px 40px -20px rgba(11,33,64,0.35)`) on elevated elements
- CTA buttons: green fill, navy text, uppercase Barlow Condensed, slight lift + darken on hover

Logo assets (from the existing brand logo — navy/green circular badge with LI silhouette and box truck) should be exported in SVG + PNG at multiple sizes for favicon, nav, and Open Graph image use.

---

## 3. Site Map

| Page | Purpose |
|---|---|
| `/` Home | Hero, services overview, how it works, service area, gallery preview, testimonials, quote CTA |
| `/services` | Expanded detail per service (Junk Removal, Property Cleanouts, Hauling) — good for individual SEO targeting |
| `/quote` | Full "Get a Quote" form (can also live as a homepage section, but a dedicated URL helps SEO/ads) |
| `/gallery` | Before/after job photos |
| `/about` | Company story, crew, local trust signals |
| `/contact` | Address, hours, embedded map, phone/email |
| `/pay/[invoiceId]` | Customer-facing payment page per invoice (see `invoice.html` reference) |
| `/admin` (auth-protected) | Internal dashboard — see Section 6 |

---

## 4. Feature Checklist

**Front-end (public site)**
- [ ] Professional responsive homepage matching the design system above
- [ ] Services page/sections
- [ ] Get a Quote form: name, phone, email, property address, service type, preferred date, notes, **multiple photo uploads** with client-side preview
- [ ] Customer contact info + address in header/footer + Contact page
- [ ] Mobile-first responsive layout, tested down to 375px width
- [ ] Click-to-call floating button on mobile
- [ ] LocalBusiness structured data (JSON-LD) — template already drafted, needs real address/phone filled in
- [ ] `sitemap.xml` and `robots.txt`
- [ ] Fast image loading (lazy-load gallery/job photos, compressed formats)

**Back-end / operations**
- [ ] Database storing leads/quote requests with photo attachments (object storage, e.g. S3 or Cloudflare R2, not DB blobs)
- [ ] Admin dashboard (auth-protected) to view and manage incoming requests
- [ ] Ability to send a quote (amount + notes) back to a customer, and track its status
- [ ] Payment integration (see Section 7)
- [ ] Email + SMS notifications (see Section 8)
- [ ] Google Business Profile linkage + SEO setup (see Section 9)

---

## 5. Data Model

**`leads`** (a submitted quote request)
```
id, created_at, name, phone, email, address, service_type,
preferred_date, notes, photo_urls[], status
  status enum: new | quoted | accepted | scheduled | completed | paid | closed_lost
```

**`quotes`**
```
id, lead_id, amount, sent_at, expires_at, accepted_at, notes
```

**`jobs`**
```
id, lead_id, scheduled_date, crew, completed_at, before_photo_urls[], after_photo_urls[]
```

**`invoices`**
```
id, job_id, line_items[] (description, amount), total, status (unpaid|paid),
payment_link_url, paid_at, payment_method
```

Every status change (`new` → `quoted` → `accepted` → `scheduled` → `completed` → `paid`) should be the trigger point for the relevant notification (Section 8) — build notifications off state transitions, not as an afterthought bolted onto the UI.

---

## 6. Admin Dashboard Spec

Auth-protected (owner + any staff logins). Core views:

1. **Requests inbox** — table/list of leads sorted by newest, filterable by status, with thumbnail of uploaded photos, click-through to detail view
2. **Lead detail** — full submission info, photo gallery, a field to enter a quote amount + notes, "Send Quote" action (triggers email/SMS to customer with a link to accept)
3. **Quotes/Jobs tracker** — kanban or status-column view: New → Quoted → Accepted → Scheduled → Completed → Paid
4. **Invoicing** — on marking a job "Completed," generate an invoice and a payment link (Stripe Payment Link API call), send it to the customer automatically
5. **Simple reporting** — monthly totals: leads received, quotes sent, conversion rate, revenue collected (useful for the owner to see what's actually generating income)

---

## 7. Payment Integration

Two payment moments to support:

- **In-person, on completion:** crew collects card payment on-site via **Stripe Tap to Pay on iPhone** or a **Square reader**. Pick one provider and stay consistent — Stripe covers both online and in-person under one account if that's preferred; Square's hardware is more plug-and-play if the owner wants a dedicated reader.
- **Remote, by link:** for deposits or customers who want to pay later, generate a **Stripe Payment Link** (or full Checkout session) per invoice and send it via the notification system below. Reference `invoice.html` for the page layout customers should land on.

Webhook requirement: listen for Stripe's `checkout.session.completed` / `payment_intent.succeeded` events to auto-update the invoice/job status to "paid" and fire the receipt notification — don't rely on manual status updates for this step.

---

## 8. Notifications

| Trigger | Notify | Channel |
|---|---|---|
| New quote request submitted | Owner/admin | Email + SMS |
| Quote sent to customer | Customer | Email + SMS with accept link |
| Quote accepted | Owner/admin | Email + SMS |
| Job scheduled | Customer | SMS reminder day-of |
| Invoice sent | Customer | Email + SMS with payment link |
| Payment received | Customer (receipt) + Owner | Email |

Recommended providers: **Resend** or **SendGrid** for email, **Twilio** for SMS. Both have straightforward APIs for triggered, transactional messages (as opposed to marketing sends).

---

## 9. SEO & Google Business Profile

- Fill in the LocalBusiness JSON-LD template (already drafted in `index.html`) with real business name, address, phone, hours once finalized
- Set up **Google Search Console**, submit `sitemap.xml`
- Create and verify the **Google Business Profile**, and make sure the website URL, phone, and address exactly match what's on the site (consistency matters for local ranking)
- Individual service pages (`/services/junk-removal`, etc.) targeting "junk removal [town]" style long-tail terms perform well for this kind of local business
- Collect and display real Google reviews once the business has a few — swap out the placeholder testimonials on the homepage
- Compress and lazy-load all photos; Core Web Vitals affect local search ranking too

---

## 10. Recommended Tech Stack

- **Frontend:** Next.js (React) — good SEO support via server-side rendering, easy deployment
- **Backend:** Next.js API routes or a small Node/Express service, PostgreSQL database (Supabase or Neon are both easy managed options for a project this size)
- **File storage:** Cloudflare R2 or AWS S3 for uploaded job photos
- **Auth (admin only):** simple email/password or magic-link auth — no need for anything elaborate for a single-owner business
- **Hosting:** Vercel (pairs naturally with Next.js) or Cloudflare Pages
- **Domain:** not yet purchased — buy through Google Domains successor (Squarespace Domains) or Namecheap; something like `longislandcleanoutcompany.com` or a shorter variant if available
- **Business email:** once the domain is live, set up Google Workspace so email can move from the current Gmail address to something like `info@longislandcleanoutcompany.com`

---

## 11. Assets Needed Before Launch

- [ ] Domain name purchased
- [ ] Logo files exported (SVG + PNG, multiple sizes, transparent background)
- [ ] Real business phone number, address, and hours
- [ ] Stripe (and/or Square) account created and verified
- [ ] Twilio + Resend/SendGrid accounts created
- [ ] A handful of real job photos for the gallery once the first few jobs are done

---

*Reference files: `index.html` (homepage design) and `invoice.html` (payment page design) — match their exact CSS tokens, fonts, and component styling throughout the rest of the build.*
