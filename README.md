# Landmark - Burgess Rawson Intranet

Landmark is a comprehensive intranet application designed specifically for Burgess Rawson, a leading commercial real estate company. This desktop-like web application integrates various modules and tools to streamline internal processes and enhance productivity.

## Features

- **Modern Tech Stack**: Built with Next.js, React, and TypeScript for a robust and scalable application.
- **Supabase Integration**: Utilizes Supabase for backend services, including authentication and database management.
- **Responsive Design**: Fully responsive layout that works seamlessly across desktop and mobile devices.
- **Theme Support**: Includes light and dark mode with easy theme switching.
- **Custom UI Components**: Leverages shadcn/ui for consistent and customizable UI elements.
- **Module-based Architecture**: Organized into various modules for different aspects of commercial real estate operations.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/landmark.git
   cd landmark
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Rename `.env.local.example` to `.env.local`
   - Update the Supabase URL and Anon Key in `.env.local`

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `app/`: Contains the main application code
  - `(auth)/`: Authentication-related pages and components
  - `(main)/`: Main application pages and layouts
- `components/`: Reusable React components
  - `ui/`: Shadcn UI components
  - `atoms/`: Atomic design components
  - `molecules/`: Molecular design components
- `utils/`: Utility functions and helpers
- `public/`: Static assets

## Customization

- Tailwind CSS: Customize the design system in `tailwind.config.ts`
- Shadcn UI: Modify component themes in `components.json`

## Testing

Run the test suite with:

- bash
- npm test

## Acknowledgments

- Burgess Rawson for their collaboration and insights
- The Next.js and Supabase teams for their excellent documentation and tools
