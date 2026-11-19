# BizRent Kigali

PRODUCT
BizRent helps people find and rent real, currently available homes and commercial spaces. Launch in Kigali, Rwanda. This is for long-term rentals only—do not build hotel, nightly booking, or short-stay flows.

WHO IT’S FOR
People browsing on phones, including users on slower connections. The experience should feel simple, trustworthy, and easy to understand without instructions.

DESIGN
Create a polished, mobile-first responsive website. Keep the interface calm and uncluttered, with clear typography, accessible contrast, generous spacing, and obvious buttons. Use a warm, trustworthy visual style appropriate for a modern Rwandan property service.

Use RWF for prices and support +250 phone formats. Make the layout ready for English, Kinyarwanda, and French. Do not make unsupported claims that properties or landlords are “verified”; show specific verification labels only when supplied.

MAIN EXPERIENCE
1. Homepage
- BizRent logo and simple navigation: Rent, List a property, Sign in.
- Prominent search panel with:
  - Residential or Commercial
  - Area/neighbourhood
  - Property type
  - Minimum and maximum monthly rent
  - Search button
- A small set of useful category shortcuts.
- Featured available listings and a short “How it works” section.
- Keep the page focused on finding a place.

2. Search results
- Show result count and a clear heading based on the search.
- Provide a compact filter panel or drawer with:
  - Residential/commercial category
  - Area
  - Monthly rent range
  - Property type
  - Bedrooms and bathrooms for residential
  - Floor area in square metres for commercial
  - Furnished, parking, and selected amenities where relevant
  - Availability
- Provide sort options: newest, lowest rent, highest rent.
- On desktop, show a results list beside a map. On mobile, show results first and a clear List / Map toggle.
- Listing cards should show photo, monthly rent, location, type, key attributes, availability status, and last availability confirmation date when available.
- Include Save control, but require sign-in only when saving.
- Filters should be easy to clear and show which filters are active.
- Include loading, no-results, and error states.

3. Map
- Display listing markers for properties with valid coordinates.
- Selecting a marker should open a small preview card for that listing.
- Selecting a preview opens the listing detail page.
- Keep the list/map experience usable on mobile.
- If map credentials or a map provider are not configured, show a clean map placeholder and keep list search usable. Do not invent property locations.

4. Listing details
- Photo gallery.
- Rent per month in RWF, deposit, recurring costs when provided, and availability.
- Location and map only to the precision the landlord has made public.
- Category-specific details: bedrooms/bathrooms for homes; floor area, permitted use, access, and service charges for commercial spaces.
- Amenities, description, and specific verification signals with dates where available.
- Prominent Contact landlord and Request a viewing buttons.
- Never imply a viewing is confirmed until the landlord confirms it.

5. Contact and viewing
- Let a visitor send an enquiry with name, phone (+250 format), and message.
- A viewing request collects preferred date/time and contact details.
- Clearly explain that a request is pending until the landlord confirms it.
- Show confirmation, pending, error, and retry states.
- Do not expose private contact information unless it is intentionally provided for the listing.

6. Sign-in and saved places
- Keep browsing public.
- Ask users to sign in only when they save listings, manage enquiries, or track viewing requests.
- Build simple screens for sign-in and a renter’s saved listings and request statuses.

CONTENT AND SAMPLE DATA
Use realistic Kigali examples and RWF prices for the visual prototype, but keep all sample properties clearly separate from live inventory in the code. Do not present fabricated listings as real or verified. Make it easy to replace sample data with API results.

IMPLEMENTATION NOTES
- Build reusable, accessible components and responsive layouts.
- Keep search/filter state in the URL so results can be shared and refreshed.
- Use clear loading, empty, error, and retry states.
- Keep the frontend ready to connect to a shared backend API later; do not hardcode business rules into visual components.
- Do not build landlord management, rent payments, subscriptions, admin tools, native apps, or short-stay booking in this renter-facing UI phase.


Once Lovable has generated the UI, send me its project files or connect the project to this workspace. I’ll inspect what it built and then implement the backend-backed functionality against the handoff’s rules, including real availability, saved searches/listings, enquiries, viewing confirmation, and access controls.

  Worked for 28s • 11:46 AM


remind him that ui shoul be simple look natural no more colrs jus verty simple aspiration is Https://payment.gbma.tech like how is built minimised not strange

Add this to the Lovable prompt:

VISUAL DIRECTION
Keep the UI very simple, natural, and familiar. Use https://payment.gbma.tech as inspiration for its minimal, straightforward feel—not as a source to copy.

Use a restrained palette: mostly white or soft neutral backgrounds, dark readable text, and one subtle accent color for important actions. Avoid extra colors, gradients, decorative effects, crowded cards, unusual layouts, and anything that feels strange or unfamiliar.

Prioritize clear labels, familiar controls, and straightforward navigation. The page should feel calm and obvious to use at a glance, especially on a phone.


  Worked for 7s • 11:49 AM


no write one like combined

Build the renter-facing website for BizRent, a rental marketplace for Rwanda. People should be able to find and rent available homes and commercial spaces. Launch in Kigali, for long-term rentals only. Do not include hotels, nightly bookings, or short-stay rentals.

The main users will browse on phones, sometimes with a slow connection. Make the website mobile-first, responsive, accessible, and very easy to understand.

VISUAL STYLE
Keep the design simple, natural, and familiar. Use https://payment.gbma.tech as inspiration for its minimal, straightforward feel; do not copy it. Use mostly white or soft neutral backgrounds, dark readable text, and one subtle accent color for important actions. Avoid extra colors, gradients, decorative effects, crowded layouts, unusual controls, and anything that feels strange. Make the interface calm and obvious at a glance.

Use RWF for prices and support +250 phone numbers. Make the content ready for English, Kinyarwanda, and French. Do not claim that a property or landlord is “verified” unless the relevant verification information is provided. Show specific checks and dates where available.

HOMEPAGE
- Simple header with BizRent logo and links for Rent, List a property, and Sign in.
- A clear search area with Residential or Commercial, neighbourhood, property type, monthly rent range, and a Search button.
- A few useful category shortcuts.
- A small selection of available listings and a brief “How it works” section.
- Keep the focus on finding a place.

SEARCH RESULTS
- Show a clear results heading and result count.
- Provide simple filters for category, neighbourhood, monthly rent, property type, and availability.
- For homes, include bedrooms and bathrooms. For commercial spaces, include floor area in square metres.
- Add optional filters for furnished, parking, and relevant amenities.
- Provide sorting by newest, lowest rent, and highest rent.
- On desktop, show the listing results beside a map. On mobile, show results first with a clear List / Map toggle.
- Each listing card should show a photo, monthly rent, location, property type, key details, availability, and last availability confirmation date when available.
- Include a Save button. Ask the user to sign in only when they try to save.
- Make active filters visible and easy to clear.
- Include loading, no-results, and error states.

MAP
- Show markers only for listings with real coordinates.
- Selecting a marker opens a small preview with the listing photo, rent, and key details. Selecting the preview opens the listing.
- Keep the map usable on mobile.
- If a map provider is not configured, show a simple placeholder and keep list search working. Never invent property locations.

LISTING DETAILS
- Show a photo gallery, monthly rent in RWF, deposit and recurring costs when provided, availability, and location.
- Show relevant details for the category: bedrooms and bathrooms for homes; floor area, permitted use, access, and service charges for commercial spaces.
- Include amenities, description, and specific verification checks with dates when provided.
- Provide clear Contact landlord and Request a viewing buttons.
- A viewing request must be labelled pending until the landlord confirms it.

CONTACT AND VIEWING
- Let visitors send an enquiry with their name, phone number using the +250 format, and a message.
- A viewing request should collect a preferred date and time plus contact details.
- Clearly explain that the request is not confirmed until the landlord responds.
- Show success, pending, error, and retry states.
- Do not expose private contact details unless the landlord chose to display them.

SIGN-IN AND SAVED LISTINGS
- Keep browsing public.
- Ask users to sign in only when they want to save listings, manage enquiries, or track viewing requests.
- Provide simple sign-in screens and a renter area for saved listings and request statuses.

SAMPLE CONTENT AND IMPLEMENTATION
- Use realistic Kigali examples and RWF prices for the visual prototype, but clearly separate sample listings from live inventory in the code. Never present fabricated listings as real or verified.
- Make it straightforward to replace sample content with real API data.
- Use reusable, accessible components and keep search filters in the URL so results can be shared.
- Include clear loading, empty, error, and retry states.
- Keep the frontend ready to connect to a shared backend API. Do not hardcode business rules into visual components.

For this renter-facing phase, do not build landlord management, rent payments, subscriptions, admin tools, native apps, or short-stay booking.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ffb02384-5e8c-5f42-bc27-a5fd7cc2cbab).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
