import { MessageType } from "@/types/message";
import { useUser } from "../context/UserContext";

type Props = {
  onSelect: (emoji: string) => void,
  message: MessageType
}
const ReactionPicker = ({ onSelect,message }: Props) => {
  const {user}=useUser();
  const emojis = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

  return (
    <div className={`absolute -top-8 ${message.user_id === user?.id ? "right-0" : "left-0"} flex space-x-1 bg-white dark:bg-gray-700 p-1 rounded-xl shadow-lg`}>
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
