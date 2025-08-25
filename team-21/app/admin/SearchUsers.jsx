'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"

export const SearchUsers = () => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const form = e.currentTarget
            const formData = new FormData(form)
            const queryTerm = formData.get('search')
            router.push(pathname + '?search=' + queryTerm)
          }}
          className="flex gap-2"
        >
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">Search for users</Label>
            <Input 
              id="search" 
              name="search" 
              type="text" 
              placeholder="Search users by name, email, or username..."
              className="w-full"
            />
          </div>
          <Button type="submit" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}