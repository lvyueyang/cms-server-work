export default function LogView({ value = '' }: { value?: string }) {
  return (
    <pre>
      <code dangerouslySetInnerHTML={{ __html: value }} />
    </pre>
  );
}
