import { redirect } from "next/navigation.js";
import { checkRole } from "@/utils/roles.js";
import { SearchUsers } from "./SearchUsers.jsx";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { removeRole, setRole } from "./_actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Shield, ShieldCheck, UserCheck, UserX, Users } from "lucide-react";

export default async function AdminDashboard({ searchParams }) {
  if (!checkRole("admin")) {
    redirect("/");
  }

  const searchQuery = searchParams?.search;
  const user = await currentUser();

  const client = await clerkClient();

  // Get users based on search or load all users with a reasonable limit
  const users = searchQuery 
    ? (await client.users.getUserList({ query: searchQuery })).data 
    : (await client.users.getUserList({ limit: 50, orderBy: '-created_at' })).data;

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive" className="flex items-center gap-1"><Shield className="h-3 w-3" />Admin</Badge>;
      case "moderator":
        return <Badge variant="secondary" className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" />Moderator</Badge>;
      default:
        return <Badge variant="outline" className="flex items-center gap-1"><UserCheck className="h-3 w-3" />User</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-8 w-8" />
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage user roles and permissions. This dashboard is restricted to users with admin privileges.
        </p>
      </div>

      {/* Search Component */}
      <SearchUsers />

      {/* Users Table */}
      {users.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              {searchQuery 
                ? `Found ${users.length} user${users.length !== 1 ? 's' : ''} matching "${searchQuery}"`
                : `Showing ${users.length} recent users`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((listUser) => (
                  <TableRow key={listUser.id}>
                    <TableCell className="font-medium">
                      {listUser.firstName} {listUser.lastName}
                      {listUser.id === user?.id && (
                        <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {
                        listUser.emailAddresses.find(
                          (email) => email.id === listUser.primaryEmailAddressId
                        )?.emailAddress
                      }
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(listUser.publicMetadata?.role)}
                    </TableCell>
                    <TableCell className="text-right">
                      {listUser.id === user?.id ? (
                        <span className="text-sm text-muted-foreground">Current User</span>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Role Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <form action={setRole} className="w-full">
                                <input type="hidden" value={listUser.id} name="id" />
                                <input type="hidden" value="admin" name="role" />
                                <button type="submit" className="w-full text-left flex items-center gap-2 px-2 py-1.5 text-sm">
                                  <Shield className="h-4 w-4" />
                                  Make Admin
                                </button>
                              </form>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <form action={setRole} className="w-full">
                                <input type="hidden" value={listUser.id} name="id" />
                                <input type="hidden" value="moderator" name="role" />
                                <button type="submit" className="w-full text-left flex items-center gap-2 px-2 py-1.5 text-sm">
                                  <ShieldCheck className="h-4 w-4" />
                                  Make Moderator
                                </button>
                              </form>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <form action={removeRole} className="w-full">
                                <input type="hidden" value={listUser.id} name="id" />
                                <button type="submit" className="w-full text-left flex items-center gap-2 px-2 py-1.5 text-sm text-destructive">
                                  <UserX className="h-4 w-4" />
                                  Remove Role
                                </button>
                              </form>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <Users className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-semibold">No users found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search terms" : "No users available to display"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
