import { useRef } from "react";
import UserCard from "~/components/userCard";

interface Props {
  friends: {
    image: string | null;
    name: string;
    id: string;
    phone: string | null;
    email: string | null;
  }[];
  fetchMoreFriends: () => void;
  hasMoreFriends: boolean;
  loadingMoreFriends: boolean;
}

export default function FriendsList({
  friends,
  fetchMoreFriends,
  hasMoreFriends,
  loadingMoreFriends,
}: Props) {
  const friendsListRef = useRef<HTMLDivElement>(null);

  const onFriendsScroll = () => {
    if (!friendsListRef.current || !hasMoreFriends || loadingMoreFriends)
      return;
    const { scrollTop, scrollHeight, clientHeight } = friendsListRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      void fetchMoreFriends();
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div
        ref={friendsListRef}
        onScroll={onFriendsScroll}
        className="max-h-96 w-11/12 overflow-auto rounded-xl bg-white px-4 opacity-70 shadow-inner"
      >
        {friends.map((friend) => (
          <UserCard
            key={friend.id}
            id={friend.id}
            name={friend.name}
            image={friend.image}
          />
        ))}
        {loadingMoreFriends && (
          <div className="flex justify-center py-2">
            <div className="loading loading-spinner loading-sm" />
          </div>
        )}
      </div>
    </div>
  );
}
