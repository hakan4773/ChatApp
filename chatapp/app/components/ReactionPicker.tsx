const ReactionPicker: React.FC<{ onSelect: (emoji: string) => void }> = ({ onSelect }) => {
  const emojis = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

  return (
    <div className="absolute -top-8 left-0 flex space-x-1 bg-white dark:bg-gray-700 p-1 rounded-xl shadow-lg">
      {emojis.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className="hover:scale-125 transition-transform"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};
export default ReactionPicker;
