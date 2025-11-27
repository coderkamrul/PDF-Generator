import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"

const codeExamples = {
  curl: `curl -X POST https://pdfforge.com/api/v1/pdf/merge \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.png"
    ],
    "size": "A4",
    "orientation": "portrait",
    "fit": "contain"
  }'`,
  javascript: `const response = await fetch('https://pdfforge.com/api/v1/pdf/merge', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    images: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.png'
    ],
    size: 'A4',
    orientation: 'portrait',
    fit: 'contain'
  }),
});

const data = await response.json();
console.log(data.pdfUrl);`,
  python: `import requests

response = requests.post(
    'https://pdfforge.com/api/v1/pdf/merge',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
    },
    json={
        'images': [
            'https://example.com/image1.jpg',
            'https://example.com/image2.png'
        ],
        'size': 'A4',
        'orientation': 'portrait',
        'fit': 'contain'
    }
)

data = response.json()
print(data['pdfUrl'])`,
  php: `<?php
$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => 'https://pdfforge.com/api/v1/pdf/merge',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer YOUR_API_KEY',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'images' => [
            'https://example.com/image1.jpg',
            'https://example.com/image2.png'
        ],
        'size' => 'A4',
        'orientation' => 'portrait',
        'fit' => 'contain'
    ]),
]);

$response = curl_exec($ch);
$data = json_decode($response, true);

echo $data['pdfUrl'];`,
  n8n: `// In n8n HTTP Request Node:
// 
// Method: POST
// URL: https://pdfforge.com/api/v1/pdf/merge
// 
// Authentication: Header Auth
// Header Name: Authorization
// Header Value: Bearer YOUR_API_KEY
//
// Body Parameters:
{
  "images": ["{{ $json.imageUrl1 }}", "{{ $json.imageUrl2 }}"],
  "size": "A4",
  "orientation": "portrait",
  "fit": "contain"
}`,
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground">API Documentation</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Complete reference for the PDFForge API. Convert images to PDF programmatically.
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground">Authentication</h2>
            <p className="mt-2 text-muted-foreground">
              All API requests require authentication using your API key in the Authorization header.
            </p>
            <Card className="mt-4">
              <CardContent className="pt-6">
                <pre className="overflow-x-auto rounded-lg bg-secondary p-4">
                  <code className="text-sm">Authorization: Bearer YOUR_API_KEY</code>
                </pre>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">Endpoints</h2>

            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="rounded bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">POST</span>
                  <code className="text-lg">/api/v1/pdf/merge</code>
                </div>
                <CardDescription>Merge multiple images into a single PDF</CardDescription>
              </CardHeader>
              <CardContent>
                <h4 className="mb-2 font-semibold text-foreground">Request Body</h4>
                <pre className="mb-6 overflow-x-auto rounded-lg bg-secondary p-4">
                  <code className="text-sm text-foreground">{`{
  "images": ["string"],     // Array of image URLs (required)
  "size": "A4",             // "A4" | "letter" | "square" (default: "A4")
  "orientation": "portrait", // "portrait" | "landscape" (default: "portrait")
  "fit": "contain"          // "contain" | "cover" (default: "contain")
}`}</code>
                </pre>

                <h4 className="mb-2 font-semibold text-foreground">Response</h4>
                <pre className="overflow-x-auto rounded-lg bg-secondary p-4">
                  <code className="text-sm text-foreground">{`{
  "status": "success",
  "pdfId": "abc123",
  "pdfUrl": "https://pdfforge.com/api/v1/pdf/download/abc123",
  "pages": 5,
  "fileSize": "1.2 MB"
}`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="rounded bg-secondary px-2 py-1 text-xs font-bold text-secondary-foreground">
                    GET
                  </span>
                  <code className="text-lg">/api/v1/pdf/list</code>
                </div>
                <CardDescription>List all PDFs generated with your API key</CardDescription>
              </CardHeader>
              <CardContent>
                <h4 className="mb-2 font-semibold text-foreground">Response</h4>
                <pre className="overflow-x-auto rounded-lg bg-secondary p-4">
                  <code className="text-sm text-foreground">{`{
  "status": "success",
  "pdfs": [
    {
      "pdfId": "abc123",
      "filename": "document.pdf",
      "pages": 5,
      "fileSize": "1.2 MB",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="rounded bg-secondary px-2 py-1 text-xs font-bold text-secondary-foreground">
                    GET
                  </span>
                  <code className="text-lg">/api/v1/pdf/info/:pdfId</code>
                </div>
                <CardDescription>Get metadata for a specific PDF</CardDescription>
              </CardHeader>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="rounded bg-secondary px-2 py-1 text-xs font-bold text-secondary-foreground">
                    GET
                  </span>
                  <code className="text-lg">/api/v1/pdf/download/:pdfId</code>
                </div>
                <CardDescription>Download a PDF file (returns raw PDF stream)</CardDescription>
              </CardHeader>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">Code Examples</h2>
            <p className="mt-2 text-muted-foreground">Examples in various programming languages and tools</p>

            <Card className="mt-6">
              <CardContent className="pt-6">
                <Tabs defaultValue="curl">
                  <TabsList className="mb-4">
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="php">PHP</TabsTrigger>
                    <TabsTrigger value="n8n">n8n</TabsTrigger>
                  </TabsList>
                  {Object.entries(codeExamples).map(([lang, code]) => (
                    <TabsContent key={lang} value={lang}>
                      <pre className="overflow-x-auto rounded-lg bg-secondary p-4">
                        <code className="text-sm text-foreground">{code}</code>
                      </pre>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">Error Codes</h2>
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[
                    { code: "400", message: "Bad Request", description: "Invalid request body or parameters" },
                    { code: "401", message: "Unauthorized", description: "Missing or invalid API key" },
                    { code: "403", message: "Forbidden", description: "Insufficient credits or plan limits exceeded" },
                    { code: "404", message: "Not Found", description: "PDF or resource not found" },
                    { code: "429", message: "Too Many Requests", description: "Rate limit exceeded" },
                    { code: "500", message: "Internal Server Error", description: "Something went wrong on our end" },
                  ].map((error) => (
                    <div key={error.code} className="flex items-start gap-4 rounded-lg border border-border p-4">
                      <span className="rounded bg-destructive/10 px-2 py-1 text-sm font-mono text-destructive">
                        {error.code}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">{error.message}</p>
                        <p className="text-sm text-muted-foreground">{error.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">Rate Limits</h2>
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <span className="text-foreground">Free Plan</span>
                    <span className="text-muted-foreground">10 requests/day</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <span className="text-foreground">Pro Plan</span>
                    <span className="text-muted-foreground">500 requests/day</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <span className="text-foreground">Business Plan</span>
                    <span className="text-muted-foreground">Unlimited</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
