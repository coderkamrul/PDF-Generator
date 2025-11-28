"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"

export default function DocsPage() {
  const [baseUrl, setBaseUrl] = useState("https://pdfforge.com")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin)
    }
  }, [])

  const codeExamples = {
    curl: `curl -X POST ${baseUrl}/api/convert \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.png"
    ],
    "options": {
      "pageSize": "a4",
      "orientation": "portrait",
      "fitMode": "fit"
    }
  }'`,
    javascript: `const response = await fetch('${baseUrl}/api/convert', {
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
    options: {
      pageSize: 'a4',
      orientation: 'portrait',
      fitMode: 'fit'
    }
  }),
});

const data = await response.json();
console.log(data.url);`,
    python: `import requests

response = requests.post(
    '${baseUrl}/api/convert',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
    },
    json={
        'images': [
            'https://example.com/image1.jpg',
            'https://example.com/image2.png'
        ],
        'options': {
            'pageSize': 'a4',
            'orientation': 'portrait',
            'fitMode': 'fit'
        }
    }
)

data = response.json()
print(data['url'])`,
    php: `<?php
$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => '${baseUrl}/api/convert',
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
        'options' => [
            'pageSize' => 'a4',
            'orientation' => 'portrait',
            'fitMode' => 'fit'
        ]
    ]),
]);

$response = curl_exec($ch);
$data = json_decode($response, true);

echo $data['url'];`,
    n8n: `// In n8n HTTP Request Node:
// 
// Method: POST
// URL: ${baseUrl}/api/convert
// 
// Authentication: Header Auth
// Header Name: Authorization
// Header Value: Bearer YOUR_API_KEY
//
// Body Parameters:
// {
//   "images": ["{{ $json.imageUrl1 }}", "{{ $json.imageUrl2 }}"],
//   "options": {
//     "pageSize": "a4",
//     "orientation": "portrait",
//     "fitMode": "fit"
//   }
// }`,
  }

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
              You can generate an API key in your dashboard under the "API Keys" section.
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
                  <code className="text-lg">/api/convert</code>
                </div>
                <CardDescription>Convert images to a single PDF</CardDescription>
              </CardHeader>
              <CardContent>
                <h4 className="mb-2 font-semibold text-foreground">Request Body</h4>
                <pre className="mb-6 overflow-x-auto rounded-lg bg-secondary p-4">
                  <code className="text-sm text-foreground">{`{
  "images": ["string"],     // Array of image URLs or Base64 strings (required)
  "options": {
    "filename": "output.pdf", // Optional filename
    "pageSize": "a4",         // "a4" | "letter" | "legal" | "square" | "2:3" (default: "a4")
    "orientation": "portrait", // "portrait" | "landscape" (default: "portrait")
    "fitMode": "fit"          // "fit" | "fill" (default: "fit")
  }
}`}</code>
                </pre>

                <h4 className="mb-2 font-semibold text-foreground">Response</h4>
                <pre className="overflow-x-auto rounded-lg bg-secondary p-4">
                  <code className="text-sm text-foreground">{`{
  "success": true,
  "url": "https://res.cloudinary.com/...", // Direct download URL
  "fileId": "abc123xyz",
  "creditsDeducted": 1,
  "remainingCredits": 99
}`}</code>
                </pre>
              </CardContent>
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
