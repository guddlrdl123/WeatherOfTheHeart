export function SaveToast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-[#c8966a]/34 bg-[#101421] px-5 py-3 text-sm text-[#e0d2ba]">
      {message}
    </div>
  );
}
