import { Skeleton } from "@/components/ui/skeleton";

function LoadingCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <LoadingCard key={index} />
        ))}
      </div>
    </div>
  );
}
