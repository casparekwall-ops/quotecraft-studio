import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Settings = () => {
  const handleSave = () => toast.success("Settings saved");

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and company settings.</p>
      </div>

      <Tabs defaultValue="profile" className="max-w-3xl">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">Profile Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue="John Smith" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" defaultValue="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input defaultValue="+1 555-0100" />
              </div>
            </div>
            <Button className="mt-6" onClick={handleSave}>Save Changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="company">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">Company Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input placeholder="Your Company" />
              </div>
              <div className="space-y-2">
                <Label>Organization Number</Label>
                <Input placeholder="e.g. 12345678" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Address</Label>
                <Input placeholder="123 Business St" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="info@company.com" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="+1 555-0100" />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input placeholder="https://company.com" />
              </div>
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground">
                  Upload logo
                </div>
              </div>
            </div>
            <Button className="mt-6" onClick={handleSave}>Save Changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="branding">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-foreground">Branding</h2>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex items-center gap-3">
                  <input type="color" defaultValue="#2563EB" className="h-10 w-10 cursor-pointer rounded-lg border border-border" />
                  <Input defaultValue="#2563EB" className="max-w-32" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Default Footer Text</Label>
                <Textarea placeholder="Thank you for your business!" defaultValue="Thank you for your business! Payment is due within the terms specified above." />
              </div>
            </div>
            <Button className="mt-6" onClick={handleSave}>Save Changes</Button>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Settings;
