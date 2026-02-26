---
title: We Started Using Microsoft Clarity on Every Site. Here's Why It's Become Our Default.
description: We were looking for a free alternative to Hotjar and stumbled on Microsoft Clarity. Six months later it's on every site we build. Here's what it showed us — and why we think more small businesses should know it exists.
date: 2026-03-10
category: Tools
readTime: 5 min read
canonical: https://web-orb.uk/blog/microsoft-clarity-free-heatmap-tool/
ogTitle: We Started Using Microsoft Clarity on Every Site — Here's Why | WebOrb
---

A while back we were setting up analytics on a client site and needed a heatmap tool — something to show us where users were clicking, how far they were scrolling, where they were getting confused and dropping off.

[Hotjar](https://www.hotjar.com) was the obvious choice. Everyone uses Hotjar. But the free plan had session limits that made it nearly useless for most small sites, and the paid plan starts at €32/month. For a small business site with a few hundred visitors a month, that felt like a lot for what we needed.

So we tried [Microsoft Clarity](https://clarity.microsoft.com).

It's been on every site we build since.

---

## What Microsoft Clarity actually does

Clarity is a behaviour analytics tool. It records how real users interact with your website — not aggregated numbers, but actual session recordings you can watch back. On top of that, it generates heatmaps that show you exactly where people click and how far they scroll on each page.

Here's what you're looking at:

**Session recordings** — you can watch a real visitor navigate your site, see their mouse movements, where they paused, where they got stuck, what they clicked. It sounds intense but it's anonymised — no personal data, no identifiers. Just the behaviour.

**Heatmaps** — aggregate click maps (where people tap on mobile, where they click on desktop), scroll maps (how far down a page most people actually get), and area maps that break down engagement by section.

**Rage clicks** — Clarity automatically flags sessions where a user clicked the same spot rapidly, usually a sign of frustration. Often because something looks clickable but isn't, or because a button isn't working as expected.

**Dead clicks** — clicks that landed on non-interactive elements. These are quiet UX problems most people never notice.

**JavaScript errors** — it catches front-end errors happening in real sessions, so you can find and fix bugs that users are hitting silently.

---

## What we've actually found using it

The kind of things Clarity surfaces that you'd never spot otherwise:

A client's contact page had a phone number that wasn't set up as a clickable link on mobile — it just looked like text. The heatmap showed a cluster of taps on that number. Rage clicks. People were repeatedly tapping it expecting it to dial and nothing was happening. Five-minute fix.

On another site we noticed most users on mobile were dropping off before seeing the main call-to-action button. It was below the fold and the scroll map showed most people never got there. We moved the button up. Enquiries from that page went up noticeably in the following weeks.

These aren't things you'd find in Google Analytics. Analytics tells you what happened — people left the page. Clarity shows you why.

---

## The part that still surprises people: it's completely free

Not "free tier with limits". Not a trial. Microsoft Clarity is **free, with no session cap, no recording limits, and no paid plan to upgrade to**.

Clarity competes directly with [Hotjar](https://www.hotjar.com) and [FullStory](https://www.fullstory.com), both of which charge significant monthly fees for comparable features. Microsoft funds Clarity as a data business — the anonymised aggregate insights help improve Bing and Microsoft's ad products. You get the tool, they get the aggregate data.

If that trade-off concerns you, worth reading their privacy policy. For most business sites tracking UX improvements, it's a non-issue.

---

## How to get it on your site

1. Create a free account at [clarity.microsoft.com](https://clarity.microsoft.com)
2. Add your site and copy the tracking script
3. Paste it into your site's `<head>` (or use the [Google Tag Manager integration](https://tagmanager.google.com) if you already have GTM set up)
4. Done — recordings start immediately

It also integrates directly with [Google Analytics 4](https://analytics.google.com), so you can segment Clarity recordings by GA4 audience or event. That's genuinely useful if you want to watch sessions from, say, only users who came from Google Search.

---

## Who it's for

Any website that gets human visitors. Seriously. Even a low-traffic local business site with 200 visitors a month will generate useful Clarity data within a week or two.

If you're spending money on ads, Clarity is especially valuable — you can watch exactly what people do after clicking your ad and see whether your landing page is actually working.

<div class="post-tip">
  <p><strong>We add Microsoft Clarity to every client site we build</strong> — setup, integration with Google Analytics, and a walkthrough so you know what you're looking at. It takes about 10 minutes and the data it produces is genuinely useful. <a href="/#contact">Ask us about it.</a></p>
</div>

---

It's become one of those tools we'd now feel odd not having on a site. Not because it's complicated or clever — because it answers the question "why aren't people doing what I want them to do?" in a way that almost nothing else does, for free.

If you haven't tried it, it takes 15 minutes to set up. Worth it.
