export function LoadingText({ children = "불러오는 중..." }: { children?: React.ReactNode }) {
  return <p className="py-6 text-center text-sm text-muted-foreground">{children}</p>;
}
