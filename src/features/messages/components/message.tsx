import Conversation from "./conversation";
import UserList from "./user-list";

export default function Message() {
  return (
    <div className="flex items-start gap-x-2 relative">
      <UserList />
      <Conversation />
    </div>
  );
}
