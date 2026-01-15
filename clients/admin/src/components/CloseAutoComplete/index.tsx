export function CloseAutoComplete() {
  return (
    <div style={{ position: 'fixed', width: 0, height: 0, overflow: 'hidden' }}>
      <input type="password" autoComplete="off" />
    </div>
  );
}
