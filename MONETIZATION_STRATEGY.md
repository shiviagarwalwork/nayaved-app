# NayaVed Monetization Strategy

**Created:** 2026-02-02
**Status:** For Future Implementation (App currently free)

---

## Current State

The app is **free** with all features unlocked to maximize user acquisition and feedback. Subscription infrastructure (RevenueCat, PaywallScreen) is built and ready to activate when needed.

---

## Recommended Monetization Strategies

### 1. Affiliate Marketing (Already Implemented)

**Current Setup:**
- Amazon Associates: US (`nayaved-20`), India (`nayaved-21`), Canada (`nayaved0c-20`)
- Products displayed in Wellness tab

**Expansion Opportunities:**

| Partner | Commission | Website |
|---------|------------|---------|
| Kerala Ayurveda | 20% per sale | https://keralaayurveda.store/pages/affliate-program |
| Maharishi Ayurveda | 10-15% | https://mapi.com/pages/affiliate-program |
| Banyan Botanicals | 10-15% | https://www.banyanbotanicals.com/pages/affiliates |
| Vanashree Ayurveda | 20% + 10% off products | https://vanashreeayurveda.com/affiliate-program |
| Kapiva (India) | 8-12% | Popular for Indian market |
| Dr. Vaidya's (India) | 10-15% | Strong brand in India |
| iHerb | 5-10% | Global reach |

**Action Items:**
- [ ] Sign up for Kerala Ayurveda affiliate program
- [ ] Sign up for Banyan Botanicals affiliate program
- [ ] Add more products to Wellness tab with affiliate links
- [ ] Create dosha-specific product bundles

---

### 2. Ayurvedic Practitioner Marketplace

**Concept:** Connect users with real Ayurvedic practitioners for consultations

**Revenue Model:**
- Take 15-20% commission on each booking
- Practitioners pay to be featured/listed
- Users pay $30-100 per consultation

**Implementation:**
1. Create practitioner directory screen
2. Integrate booking calendar (Calendly API or custom)
3. Payment processing (Stripe Connect)
4. Video consultation integration (Twilio or Daily.co)

**Estimated Revenue:** $5-15 per booking × 100 bookings/month = $500-1,500/month

---

### 3. Corporate/B2B Wellness Programs

**Concept:** License NayaVed to companies for employee wellness

**Target Clients:**
- Yoga studios and wellness centers
- Corporate HR departments
- Health insurance companies
- Ayurvedic clinics and spas

**Pricing:**
- Small business (< 50 employees): $200/month
- Medium business (50-200 employees): $500/month
- Enterprise (200+ employees): $1,000-5,000/month

**Features for B2B:**
- Admin dashboard with anonymized wellness metrics
- Custom branding option
- Bulk user management
- Wellness challenge features

**Action Items:**
- [ ] Create B2B landing page
- [ ] Build admin dashboard
- [ ] Create pitch deck
- [ ] Reach out to yoga studios in your network

---

### 4. Physical Product Line

**Concept:** Sell branded Ayurvedic products directly

**Product Ideas:**

| Product | Cost | Sell Price | Margin |
|---------|------|------------|--------|
| Copper tongue scraper | $3 | $15 | $12 |
| Copper water cup | $8 | $25 | $17 |
| Dosha starter kit | $15 | $45 | $30 |
| Ayurvedic journal | $5 | $20 | $15 |
| Neti pot + salt | $6 | $22 | $16 |
| Abhyanga oil set | $12 | $35 | $23 |

**Fulfillment Options:**
- Dropshipping via Printful, Oberlo, or AliExpress
- Partner with Ayurvedic manufacturers
- Amazon FBA for hands-off fulfillment

**Action Items:**
- [ ] Source products from suppliers
- [ ] Create NayaVed branded packaging
- [ ] Set up Shopify store or in-app store
- [ ] Integrate with app's Wellness tab

---

### 5. Sponsored Content & Brand Partnerships

**Concept:** Ayurvedic brands pay for visibility in the app

**Opportunities:**

| Placement | Price Range |
|-----------|-------------|
| Featured product in Wellness tab | $100-300/month |
| Sponsored blog post | $200-500 per post |
| In-app banner (non-intrusive) | $50-150/month |
| Newsletter sponsorship | $100-200 per send |
| Dosha-specific product recommendation | $150-400/month |

**Brands to Approach:**
- Organic India
- Himalaya Wellness
- Patanjali (India)
- Dabur (India)
- Zandu (India)
- Forest Essentials

---

### 6. Premium Subscription (Future)

**Already Built:** RevenueCat integration, PaywallScreen, PremiumLock component

**Pricing (when ready to activate):**
- Monthly: $4.99/month
- Yearly: $39.99/year (saves 33%)

**Premium Features to Consider:**
- Unlimited AI consultations (limit free to 5/month)
- Advanced dosha reports with PDF export
- Personalized meal plans
- Guided meditation library
- Priority practitioner booking
- Ad-free experience
- Family sharing (up to 5 members)

**Activation Steps:**
1. Complete RevenueCat product setup in dashboard
2. Change `SubscriptionContext.tsx` to remove free override
3. Test purchase flow with sandbox account
4. Submit app update

---

### 7. Data Insights (Anonymized)

**Concept:** Aggregate anonymized wellness trends for research

**Potential Buyers:**
- Academic researchers studying Ayurveda
- Wellness brands for market research
- Healthcare companies

**Important:** Must comply with privacy laws, get user consent, fully anonymize data

**Revenue:** $1,000-10,000 per data report

---

### 8. Donations / Tip Jar

**Concept:** "Support our mission" voluntary contributions

**Implementation:**
- Add "Support NayaVed" button in Settings
- Integrate with Buy Me a Coffee or Ko-fi
- Or use Apple/Google IAP for tips ($1.99, $4.99, $9.99)

**Expected:** Low but steady income from passionate users

---

## Revenue Projections

### Year 1 (Free App, Focus on Growth)

| Source | Monthly | Annual |
|--------|---------|--------|
| Affiliate commissions | $50-200 | $600-2,400 |
| Donations | $20-50 | $240-600 |
| **Total** | **$70-250** | **$840-3,000** |

### Year 2 (Monetization Active)

| Source | Monthly | Annual |
|--------|---------|--------|
| Affiliate (expanded) | $200-500 | $2,400-6,000 |
| Subscriptions (500 users) | $500-1,000 | $6,000-12,000 |
| Practitioner bookings | $300-600 | $3,600-7,200 |
| Physical products | $200-400 | $2,400-4,800 |
| Sponsored content | $200-400 | $2,400-4,800 |
| **Total** | **$1,400-2,900** | **$16,800-34,800** |

### Year 3 (Scale)

| Source | Monthly | Annual |
|--------|---------|--------|
| All above (grown) | $3,000-5,000 | $36,000-60,000 |
| B2B contracts (3-5) | $1,500-5,000 | $18,000-60,000 |
| **Total** | **$4,500-10,000** | **$54,000-120,000** |

---

## Priority Action Items

### Immediate (Month 1-2)
- [x] Launch free app on App Store
- [ ] Track user acquisition and engagement
- [ ] Gather user feedback

### Short-term (Month 3-6)
- [ ] Expand affiliate partnerships
- [ ] Add more products to Wellness tab
- [ ] Start approaching yoga studios for B2B

### Medium-term (Month 6-12)
- [ ] Build practitioner marketplace
- [ ] Launch physical product line
- [ ] Approach brands for sponsorships
- [ ] Consider activating subscriptions based on user feedback

---

## Resources

### Affiliate Program Links
- Kerala Ayurveda: https://keralaayurveda.store/pages/affliate-program
- Maharishi Ayurveda: https://mapi.com/pages/affiliate-program
- Banyan Botanicals: https://www.banyanbotanicals.com/pages/affiliates
- Vanashree Ayurveda: https://vanashreeayurveda.com/affiliate-program
- The Ayurveda Experience: https://www.flexoffers.com/affiliate-programs/the-ayurveda-experience-affiliate-program/

### Research References
- Wellness App Monetization: https://growthrocks.com/blog/monetizing-wellness-apps/
- Health App Revenue Strategies: https://www.purchasely.com/blog/health-wellness-app-monetization
- Ayurvedic Affiliate Marketing: https://fastercapital.com/content/Ayurvedic-Affiliate-Marketing--Ayurvedic-Affiliate-Programs--Nurturing-Health-and-Wealth.html

---

*This document will be updated as the monetization strategy evolves.*
