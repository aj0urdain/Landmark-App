# Landmark - Burgess Rawson Intranet

Landmark is a comprehensive intranet application designed specifically for Burgess Rawson, a leading commercial real estate company. This desktop-like web application integrates various modules and tools to streamline internal processes and enhance productivity.

## Features

- **Modern Tech Stack**: Built with Next.js 14, React 18, and TypeScript for a robust and scalable application.
- **Database Integration**: Utilizes a PostgreSQL backend, including authentication and database management.
- **Responsive Design**: Fully responsive layout that works seamlessly across desktop and mobile devices.
- **Theme Support**: Includes light and dark mode with easy theme switching.
- **Custom UI Components**: Leverages reusable atomic components for consistent and customizable UI elements.
- **Module-based Architecture**: Organized into various modules for different aspects of commercial real estate operations.
- **Document Generator**: Create custom reports and documents, including portfolio pages.

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

   - Update the Supabase URL and Anon Key in `.env.local`

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `app/`: Contains the main application code
- `components/`: Reusable React components
- `constants/`: Application-wide constants
- `hooks/`: Custom React hooks
- `lib/`: Utility functions and libraries
- `providers/`: React context providers
- `public/`: Static assets
- `styles/`: Global styles and CSS modules
- `types/`: TypeScript type definitions
- `utils/`: Utility functions and helpers

## Configuration Files

- `.eslintignore`: ESLint ignore configuration
- `.eslintrc.json`: ESLint configuration
- `.gitignore`: Git ignore file
- `.prettierrc`: Prettier configuration
- `components.json`: shadcn/ui components configuration
- `eslint.config.mjs`: ESLint module configuration
- `jest.config.ts`: Jest testing configuration
- `middleware.ts`: Next.js middleware
- `next.config.mjs`: Next.js configuration
- `postcss.config.js`: PostCSS configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration

## Development

- Linting: `npm run lint`
- Formatting: `npm run format`
- Type checking: `npm run type-check`

## Testing

Run the test suite with:

```bash
npm run test
```

## Deployment

The application is set up for streamlined deployment on platforms like Vercel. Make sure to set up the necessary environment variables in your deployment environment.

## License

This project is proprietary and confidential. Unauthorized copying, transferring or reproduction of the contents of this project, via any medium, is strictly prohibited.
