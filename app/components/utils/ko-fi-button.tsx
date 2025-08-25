export const KoFiButton: React.FC<React.ComponentProps<"a">> = (props) => {
  return (
    <a href="https://ko-fi.com/X8X21K7CE7" target="_blank" {...props}>
      <img
        style={{ border: 0, height: 36 }}
        src="https://storage.ko-fi.com/cdn/kofi1.png?v=6"
        alt="Buy Me a Coffee at ko-fi.com"
      />
    </a>
  );
};
