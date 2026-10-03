export function LoadingSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Memuat">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
    </div>
  );
}
