import DashboardLayout from "@/components/dashboard-layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pathway, InsertPathway } from "@shared/schema";
import { useRoute, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPathwaySchema } from "@shared/schema";
import { z } from "zod";
import { useEffect } from "react";

type PathwayFormData = z.infer<typeof insertPathwaySchema>;

async function fetchPathway(id: string): Promise<{ pathway: Pathway }> {
  const res = await fetch(`/api/pathways/${id}`);
  if (!res.ok) throw new Error("Failed to fetch pathway");
  return res.json();
}

async function createPathway(data: InsertPathway): Promise<{ pathway: Pathway }> {
  const res = await fetch("/api/pathways", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create pathway");
  return res.json();
}

async function updatePathway({ id, data }: { id: string; data: Partial<InsertPathway> }): Promise<{ pathway: Pathway }> {
  const res = await fetch(`/api/pathways/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update pathway");
  return res.json();
}

export default function PathwayEditor() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [isEdit, params] = useRoute("/dashboard/pathways/edit/:id");
  const id = params?.id;

  const { data: pathwayData, isLoading: isLoadingPathway } = useQuery({
    queryKey: ["pathway", id],
    queryFn: () => fetchPathway(id!),
    enabled: !!isEdit && !!id,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PathwayFormData>({
    resolver: zodResolver(insertPathwaySchema),
  });

  useEffect(() => {
    if (pathwayData) {
      const pathway = pathwayData.pathway;
      reset({
        name: pathway.name,
        description: pathway.description || "",
        nodes: pathway.nodes ? JSON.stringify(pathway.nodes, null, 2) : "[]",
      });
    }
  }, [pathwayData, reset]);

  const mutation = useMutation({
    mutationFn: (data: PathwayFormData) => {
      const parsedData = {
        ...data,
        nodes: JSON.parse(data.nodes as string),
      };
      if (isEdit) {
        return updatePathway({ id: id!, data: parsedData });
      }
      return createPathway(parsedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pathways"] });
      setLocation("/dashboard/pathways");
    },
  });

  const onSubmit = (data: PathwayFormData) => {
    mutation.mutate(data);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-white">
          {isEdit ? "Edit Pathway" : "Create New Pathway"}
        </h1>
        <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">Pathway Details</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingPathway ? (
              <div>Loading...</div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-300">Name</Label>
                  <Input id="name" {...register("name")} className="bg-transparent border-white/20 text-white placeholder-gray-400" />
                  {errors.name && <p className="text-red-400 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="description" className="text-gray-300">Description</Label>
                  <Textarea id="description" {...register("description")} className="bg-transparent border-white/20 text-white placeholder-gray-400" />
                  {errors.description && <p className="text-red-400 mt-1">{errors.description.message}</p>}
                </div>
                <div>
                  <Label htmlFor="nodes" className="text-gray-300">Nodes (JSON editor)</Label>
                  <Textarea
                    id="nodes"
                    {...register("nodes")}
                    rows={15}
                    className="font-mono bg-transparent border-white/20 text-white placeholder-gray-400"
                    defaultValue="[]"
                  />
                  {errors.nodes && <p className="text-red-400 mt-1">{errors.nodes.message}</p>}
                </div>
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setLocation("/dashboard/pathways")}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,49%)]" disabled={mutation.isPending}>
                    {mutation.isPending ? "Saving..." : "Save Pathway"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 