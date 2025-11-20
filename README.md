# Holidaze

Modern accommodation booking frontend for the Noroff Holidaze API.  
Built with React + TypeScript, Vite, Tailwind, React Query and React Router.

Live demo: <add your deploy link here>

## Features

Visitors
- Browse a paginated list of venues
- Search by name/city text, filter by min guests and max price
- Sort by Recommended, Name (A–Z / Z–A), Newest → Oldest, Oldest → Newest
- View venue details with media, amenities and location

Customers
- Register and log in (stud.noroff.no emails)
- Create bookings
- View upcoming bookings (My bookings)
- Update profile avatar

Venue managers
- Register or log in as manager
- Create, edit and delete venues
- View upcoming bookings per managed venue
- Update profile avatar

## Tech stack

- React 18 + TypeScript
- Vite 7
- Tailwind CSS
- React Router
- React Query (TanStack Query)
- ESLint + Prettier

Node requirement: 20.19+ or 22.12+ (Vite warning if older)

## Project structure

src/
features/
auth/ authentication and context
bookings/ booking form and lists
manager/ manager pages (venues CRUD, venue bookings)
profile/ profile page (avatar)
venues/ venues list, filters, detail, helpers
lib/ shared utils (api client, date helpers)
routes/ router and guards
types.ts domain types (Venue, Booking, etc.)

## Getting started

git clone <your-repo-url>
cd holidaze
npm install
npm run dev

## Environment variables

Create a `.env` file in the project root:

VITE_API_BASE=https://v2.api.noroff.dev
VITE_API_KEY=<your-noroff-api-key>

How to get an API key
1. Go to the Noroff API docs, open “API Key” tool
2. Log in with your stud.noroff.no account
3. Copy the key and set it as VITE_API_KEY

## Scripts

npm run dev start dev server
npm run build production build to /dist
npm run preview preview production build
npm run lint run ESLint on .ts/.tsx

### Linting and formatting

Run lint:
npm run lint

Auto-fix what ESLint can fix:
npx eslint . --ext .ts,.tsx --fix

VS Code tips
- Install “ESLint” and “Prettier” extensions
- Enable “Format on Save”
- Problems panel will show rule violations (for example react-hooks/rules-of-hooks, no-explicit-any)

## Routing overview

Public
- /                        home with quick search
- /venues                  list with search, filters, sort and pagination
- /venues/:id              venue details
- /auth/login              login
- /auth/register           register (customer or manager)
- 404 page                 not found

Protected (requires login)
- /bookings                My bookings
- /profile                 Profile page (avatar)

Manager (requires manager role)
- /manager/venues          List managed venues
- /manager/venues/new      Create venue
- /manager/venues/:id/edit Edit venue
- /manager/venues/:id/bookings View bookings for this venue

## Testing

Manual user story checklist
- [ ] Browse venues with pagination
- [ ] Search by text, filter by min guests and max price
- [ ] Sort by all options (Recommended, A–Z, Z–A, Newest → Oldest, Oldest → Newest)
- [ ] Open a venue detail page
- [ ] Register as customer and as manager
- [ ] Log in and log out
- [ ] Create a booking and see it under My bookings
- [ ] Update profile avatar (valid URL)
- [ ] As manager: create, edit and delete a venue
- [ ] As manager: see upcoming bookings for a venue
- [ ] Empty states show useful messages (no results, no bookings, etc.)
- [ ] 404 route shows a friendly page

Accessibility and performance
- Run Lighthouse in Chrome DevTools (Performance, Accessibility, Best Practices, SEO)
- Run WAVE for accessibility checks
- Validate HTML output where relevant

API behaviour notes
- API list endpoints have limits; pagination is implemented client-side with `page` and `limit`
- Sort is applied after the current page is fetched; changing sort re-computes the list client-side
- A 403 Invalid API Key means the VITE_API_KEY was missing or incorrect
- Use stud.noroff.no emails for register/login

## Deployment

Any static host works (Vercel/Netlify/GitHub Pages). Example (Vercel):

1. Push to GitHub
2. Import repo in Vercel
3. Set Environment Variables:
   - VITE_API_BASE = https://v2.api.noroff.dev
   - VITE_API_KEY  = <your key>
4. Build command: `npm run build`
5. Output directory: `dist`

## Troubleshooting

- 400 “Limit cannot be greater than 100”
  The API enforces a hard cap; the app uses a safe page size and client-side pagination.

- 404 on avatar PUT
  Ensure you are calling the correct profile endpoint for the logged-in user and that the image URL is publicly accessible (https).

## License

MIT