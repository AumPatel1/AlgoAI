import DashboardLayout from "@/components/dashboard-layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GitBranch, Plus, MoreHorizontal, Trash2, Edit } from "lucide-react";
import { Pathway } from "@shared/schema";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";

async function fetchPathways(): Promise<{ pathways: Pathway[] }> {
  const res = await fetch("/api/pathways");
  if (!res.ok) {
    throw new Error("Failed to fetch pathways");
  }
  return res.json();
}

async function deletePathway(id: number): Promise<void> {
  const res = await fetch(`/api/pathways/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error("Failed to delete pathway");
  }
}

export default function Pathways() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pathways"],
    queryFn: fetchPathways,
  });

  const mutation = useMutation({
    mutationFn: deletePathway,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pathways"] });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this pathway?")) {
      mutation.mutate(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Conversational Pathways</h1>
            <p className="text-gray-400">Manage your AI conversation flows.</p>
          </div>
          <Link href="/dashboard/pathways/new">
            <Button className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,49%)]">
              <Plus className="w-5 h-5 mr-2" />
              New Pathway
            </Button>
          </Link>
        </div>

        <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">Your Pathways</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-400">Loading pathways...</div>
            ) : isError ? (
              <div className="text-center py-8 text-red-400">Failed to load pathways.</div>
            ) : data?.pathways?.length === 0 ? (
              <div className="text-center py-16">
                <GitBranch className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No pathways yet</h3>
                <p className="text-gray-400 mb-6">Create your first conversational pathway to get started.</p>
                <Link href="/dashboard/pathways/new">
                  <Button className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,49%)]">
                    Create Pathway
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-400">Name</TableHead>
                    <TableHead className="text-gray-400">Description</TableHead>
                    <TableHead className="text-gray-400">Last Updated</TableHead>
                    <TableHead className="text-gray-400 w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.pathways?.map((pathway) => (
                    <TableRow key={pathway.id} className="border-white/5 hover:bg-white/5">
                      <TableCell className="font-medium text-white">{pathway.name}</TableCell>
                      <TableCell className="text-gray-300">{pathway.description}</TableCell>
                      <TableCell className="text-gray-300">
                        {format(new Date(pathway.updatedAt), "PPP p")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[hsl(0,0%,8%)] border-white/10 text-white">
                            <DropdownMenuItem className="hover:bg-white/10">
                              <Link href={`/dashboard/pathways/edit/${pathway.id}`}>
                                <div className="flex items-center">
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </div>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-400 hover:!text-red-400 hover:!bg-red-400/10"
                              onClick={() => handleDelete(pathway.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 