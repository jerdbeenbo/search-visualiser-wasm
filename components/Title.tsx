export default function Title() {
  const title: string = "Rust + WebAssembly + Next.js";
  const subTitle: string = "Search Visualiser from WASM Binary";

  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <h2 className={styles.subtitle}>{subTitle}</h2>
    </>
  );
}

const styles = {
    title: 'font-mono text-3xl p3 text-white',
    subtitle: 'font-mono text-1xl p3 text-white',
}
