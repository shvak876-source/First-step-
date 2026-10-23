export default function FormAlert({ error, message }: { error?: string; message?: string }) {
  return (
    <div aria-live="polite" role="status">
      {error && <p className="alert alert-error" role="alert">{error}</p>}
      {message && <p className="alert alert-ok">{message}</p>}
    </div>
  );
}
