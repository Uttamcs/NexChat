import { X, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile back button */}
          <button 
            onClick={() => setSelectedUser(null)}
            className="lg:hidden p-2 hover:bg-base-300 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Desktop close button */}
        <button 
          onClick={() => setSelectedUser(null)}
          className="hidden lg:block hover:bg-base-300 p-2 rounded-full transition-colors"
        >
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
