# PDF Generator SaaS

A professional, full-featured SaaS platform for converting images to PDF with a powerful API and web interface.

## Features

- 🔐 **Authentication**: Secure JWT-based auth with role-based access control
- 💳 **Payments**: Stripe, PayPal, and COD integration
- 📄 **PDF Generation**: Web UI and REST API
- 👑 **Admin Panel**: User management, settings, analytics
- 🎨 **Modern UI**: Built with Next.js, Tailwind CSS, and shadcn/ui
- 📊 **Dashboard**: Usage stats, file management, API keys
- 🔑 **API Access**: Generate PDFs programmatically

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB database
- Cloudinary account (for file storage)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run development server
npm run dev
```

Visit `http://localhost:3000`

### Environment Variables

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Admin Setup

1. Register an account with email: `admin@pdfforge.com`
2. This account automatically gets admin privileges
3. Access admin panel at `/admin`
4. Configure payment gateways in `/admin/settings`

## Payment Configuration

### Stripe
1. Get API keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Add Publishable Key and Secret Key in Admin Settings
3. Enable Stripe toggle

### PayPal
1. Get credentials from [PayPal Developer](https://developer.paypal.com/)
2. Add Client ID and Secret in Admin Settings
3. Enable PayPal toggle

## API Usage

Generate an API key from `/dashboard/api-keys`, then:

```bash
curl -X POST https://your-domain.com/api/convert \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "images": ["https://example.com/image.jpg"],
    "options": {
      "filename": "output.pdf",
      "pageSize": "a4",
      "orientation": "portrait"
    }
  }'
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB
- **Auth**: JWT with HTTP-only cookies
- **Payments**: Stripe, PayPal
- **Storage**: Cloudinary
- **UI**: Tailwind CSS, shadcn/ui
- **PDF**: jsPDF, Sharp

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── admin/           # Admin panel
│   ├── dashboard/       # User dashboard
│   └── (auth)/          # Auth pages
├── components/          # React components
├── lib/                 # Utilities and models
│   ├── models/         # Database models
│   └── payments/       # Payment integrations
└── public/             # Static assets
```

## License

MIT
