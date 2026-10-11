type ProductSkeletonProps = {
  count?: number;
};

export default function ProductSkeleton({
  count = 8,
}: ProductSkeletonProps) {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6"
      aria-label="Loading products"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="min-w-0 overflow-hidden"
        >
          {/* Product image */}
          <div className="aspect-square w-full animate-pulse rounded-lg bg-gray-200" />

          {/* Product title */}
          <div className="mt-3 space-y-2">
            <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-3/5 animate-pulse rounded bg-gray-200" />
          </div>

          {/* Product price */}
          <div className="mt-3 h-5 w-2/5 animate-pulse rounded bg-gray-200" />

          {/* Product button */}
          <div className="mt-4 h-10 w-full animate-pulse rounded-md bg-gray-200" />
        </div>
      ))}
    </div>
  );
}