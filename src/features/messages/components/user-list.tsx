import MemberAvatar from "@/components/member-avatar";

export default function UserList() {
  const users = [
    {
      id: 1,
      name: "Samuel Tesfaye",
      lastMessage:
        "Lorem ipsum is simply dummy text of the printing and typesetting...",
      messageSend: "9:03 AM",
      unreadCount: 3,
    },
    {
      id: 2,
      name: "Yosef Alemu",
      lastMessage: "Hello Yosef Alemu",
      messageSend: "4:50 PM",
      unreadCount: 0,
    },
    {
      id: 3,
      name: "Chala",
      lastMessage: "Gemesa",
      messageSend: "6:57 PM",
      unreadCount: 1,
    },
    {
      id: 4,
      name: "John Doe",
      lastMessage: "Hello How are you",
      messageSend: "1:51 PM",
      unreadCount: 0,
    },
    {
      id: 5,
      name: "Yosef Alemu",
      lastMessage: "Hello Yosef Alemu",
      messageSend: "4:50 PM",
      unreadCount: 2,
    },
    {
      id: 6,
      name: "Chala",
      lastMessage: "Gemesa",
      messageSend: "6:57 PM",
      unreadCount: 0,
    },
    {
      id: 7,
      name: "Samuel Tesfaye",
      lastMessage:
        "Lorem ipsum is simply dummy text of the printing and typesetting...",
      messageSend: "9:03 AM",
      unreadCount: 3,
    },
    {
      id: 8,
      name: "Yosef Alemu",
      lastMessage: "Hello Yosef Alemu",
      messageSend: "4:50 PM",
      unreadCount: 0,
    },
    {
      id: 9,
      name: "Chala",
      lastMessage: "Gemesa",
      messageSend: "6:57 PM",
      unreadCount: 1,
    },
    {
      id: 10,
      name: "John Doe",
      lastMessage: "Hello How are you",
      messageSend: "1:51 PM",
      unreadCount: 0,
    },
    {
      id: 11,
      name: "Yosef Alemu",
      lastMessage: "Hello Yosef Alemu",
      messageSend: "4:50 PM",
      unreadCount: 2,
    },
    {
      id: 12,
      name: "Chala",
      lastMessage: "Gemesa",
      messageSend: "6:57 PM",
      unreadCount: 0,
    },
  ];

  return (
    <div className="flex flex-col gap-y-2 h-[665px] absolute top-0 left-0 overflow-y-auto w-1/3 hide-scrollbar shadow-sm p-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 cursor-pointer"
        >
          <div className="flex items-center space-x-3 w-4/5">
            <MemberAvatar name={user.name} />
            <div>
              <h3 className="text-sm font-semibold">{user.name}</h3>
              <p className="text-xs text-gray-600 line-clamp-1">
                {user.lastMessage}
              </p>
            </div>
          </div>
          <div className="flex items-end space-x-4 w-1/5 flex-col justify-between h-full">
            {user.unreadCount > 0 && (
              <span className="p-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {user.unreadCount}
              </span>
            )}
            <span className="text-xs text-gray-500">{user.messageSend}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
