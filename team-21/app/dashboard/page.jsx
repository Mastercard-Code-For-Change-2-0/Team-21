import { currentUser } from "@clerk/nextjs/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCheck, Shield, ShieldCheck, Settings, Users, Database, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { UserService } from "@/lib/services/UserService";

export default async function Dashboard() {
  const user = await currentUser();
  
  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p>Please sign in to access your dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userRole = user.publicMetadata?.role || "client";
  
  console.log("Dashboard - User Role:", userRole);
  console.log("Dashboard - Full Public Metadata:", user.publicMetadata);
  
  // Check MongoDB integration
  let mongoUser = null;
  let mongoError = null;
  try {
    mongoUser = await UserService.getUserByClerkId(user.id, userRole);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    mongoError = error.message;
  }
  
  const getRoleInfo = (role) => {
    switch (role) {
      case "admin":
        return {
          label: "Administrator",
          description: "Full system access and user management",
          icon: Shield,
          color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
          features: ["User Management", "System Configuration", "Full Access", "Analytics"]
        };
      case "moderator":
        return {
          label: "Moderator",
          description: "Enhanced permissions for content management",
          icon: ShieldCheck,
          color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
          features: ["Content Management", "User Support", "Moderation Tools", "Reports"]
        };
      default:
        return {
          label: "Client",
          description: "Regular user with basic access",
          icon: UserCheck,
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
          features: ["Profile Management", "Basic Features", "Support Access", "Personal Data"]
        };
    }
  };

  const roleInfo = getRoleInfo(userRole);
  const RoleIcon = roleInfo.icon;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Here's your personalized dashboard based on your account type.
        </p>
      </div>

      {/* User Role Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RoleIcon className="h-5 w-5" />
            Your Account Type
          </CardTitle>
          <CardDescription>
            Your current permissions and access level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <Badge className={roleInfo.color}>
                {roleInfo.label}
              </Badge>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {roleInfo.description}
              </p>
            </div>
          </div>
          
          {/* Debug Information */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded text-sm">
            <p><strong>Debug Info:</strong></p>
            <p>Role from metadata: <code>{userRole}</code></p>
            <p>Full metadata: <code>{JSON.stringify(user.publicMetadata)}</code></p>
            <p>User ID: <code>{user.id}</code></p>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Available Features:</h4>
            <div className="grid grid-cols-2 gap-2">
              {roleInfo.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MongoDB Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            MongoDB Integration
          </CardTitle>
          <CardDescription>
            Database connection and synchronization status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {mongoUser ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="font-medium">
                  {mongoUser ? 'Connected & Synced' : 'Not Synced'}
                </span>
              </div>
              <Badge variant={mongoUser ? 'default' : 'destructive'}>
                {mongoUser ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            {/* Database Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Database Role:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {userRole === 'client' ? 'user' : userRole}
                </p>
              </div>
              <div>
                <p className="font-medium">Database:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  MC_{userRole === 'client' ? 'user' : userRole}
                </p>
              </div>
            </div>

            {/* MongoDB User Data */}
            {mongoUser && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded text-sm">
                <p><strong>MongoDB Record:</strong></p>
                <p>Created: {new Date(mongoUser.createdAt).toLocaleDateString()}</p>
                <p>Last Login: {mongoUser.lastLogin ? new Date(mongoUser.lastLogin).toLocaleDateString() : 'Never'}</p>
                <p>Record ID: <code>{mongoUser._id}</code></p>
              </div>
            )}

            {/* Error Information */}
            {mongoError && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 rounded text-sm">
                <p><strong>MongoDB Error:</strong></p>
                <p className="text-red-600 dark:text-red-400">{mongoError}</p>
              </div>
            )}

            {/* Sync Button */}
            {!mongoUser && (
              <div className="mt-4">
                <Button asChild className="w-full">
                  <Link href="/api/user" target="_blank">
                    Sync to MongoDB
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Manage your account information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Admin Access (if admin) */}
        {userRole === "admin" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Admin Panel
              </CardTitle>
              <CardDescription>
                Manage users and system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Open Admin Panel
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.emailAddresses[0]?.emailAddress}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Member Since</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role-specific content */}
      {userRole === "admin" && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>
              Quick overview of system status and user management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p>You have full administrative access to the system.</p>
              <div className="flex gap-2 justify-center">
                <Link href="/admin">
                  <Button>Manage Users</Button>
                </Link>
                <Button variant="outline">System Settings</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {userRole === "moderator" && (
        <Card>
          <CardHeader>
            <CardTitle>Moderator Tools</CardTitle>
            <CardDescription>
              Content management and user support tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p>You have enhanced permissions for content management.</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline">Content Management</Button>
                <Button variant="outline">User Support</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
