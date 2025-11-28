"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import useSWR from "swr"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const settingsSchema = z.object({
  site: z.object({
    siteName: z.string().min(2, "Site name must be at least 2 characters"),
    siteDescription: z.string().optional(),
    contactEmail: z.string().email("Invalid email address"),
    maintenanceMode: z.boolean(),
  }),
  payment: z.object({
    stripePublicKey: z.string().optional(),
    stripeSecretKey: z.string().optional(),
    paypalClientId: z.string().optional(),
    paypalSecret: z.string().optional(),
    currency: z.string().default("USD"),
    isStripeEnabled: z.boolean(),
    isPaypalEnabled: z.boolean(),
    isCodEnabled: z.boolean(),
  }),
})

type SettingsValues = z.infer<typeof settingsSchema>

export default function AdminSettingsPage() {
  const { data: settings, isLoading, mutate } = useSWR("/api/admin/settings", fetcher)

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      site: {
        siteName: "",
        siteDescription: "",
        contactEmail: "",
        maintenanceMode: false,
      },
      payment: {
        stripePublicKey: "",
        stripeSecretKey: "",
        paypalClientId: "",
        paypalSecret: "",
        currency: "USD",
        isStripeEnabled: false,
        isPaypalEnabled: false,
        isCodEnabled: false,
      },
    },
  })

  useEffect(() => {
    if (settings) {
      form.reset({
        site: settings.site,
        payment: settings.payment,
      })
    }
  }, [settings, form])

  async function onSubmit(data: SettingsValues) {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Failed to update settings")

      toast.success("Settings updated successfully")
      mutate()
    } catch (error) {
      toast.error("Failed to update settings")
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Admin Settings"
        description="Configure global application settings and integrations"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="payment">Payment Gateways</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Manage basic site information and status.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="site.siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input placeholder="PDF Generator SaaS" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="site.siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A brief description of your site"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="site.contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input placeholder="admin@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="site.maintenanceMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Maintenance Mode
                          </FormLabel>
                          <FormDescription>
                            Disable the site for non-admin users.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Configuration</CardTitle>
                  <CardDescription>
                    Manage payment gateways and API keys.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="payment.currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <FormControl>
                            <Input placeholder="USD" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4 rounded-lg border p-4">
                    <FormField
                      control={form.control}
                      name="payment.isStripeEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Stripe</FormLabel>
                            <FormDescription>
                              Enable Stripe payments.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {form.watch("payment.isStripeEnabled") && (
                      <div className="grid gap-4 pt-4">
                        <FormField
                          control={form.control}
                          name="payment.stripePublicKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Public Key</FormLabel>
                              <FormControl>
                                <Input placeholder="pk_test_..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="payment.stripeSecretKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Secret Key</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="sk_test_..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 rounded-lg border p-4">
                    <FormField
                      control={form.control}
                      name="payment.isPaypalEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">PayPal</FormLabel>
                            <FormDescription>
                              Enable PayPal payments.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {form.watch("payment.isPaypalEnabled") && (
                      <div className="grid gap-4 pt-4">
                        <FormField
                          control={form.control}
                          name="payment.paypalClientId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Client ID</FormLabel>
                              <FormControl>
                                <Input placeholder="Client ID" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="payment.paypalSecret"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Secret</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Secret"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg border p-4">
                    <FormField
                      control={form.control}
                      name="payment.isCodEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Cash on Delivery (COD)
                            </FormLabel>
                            <FormDescription>
                              Enable manual payments.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
