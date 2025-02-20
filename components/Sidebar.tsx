"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/lib/context/navigation";

function ChatRow({
  chat,
  onDelete,
}: {
  chat: Doc<"chats">;
  onDelete: (id: Id<"chats">) => void;
}) {
  const router = useRouter();
  const { closeMobileNav } = useNavigation();
  const lastMessage = useQuery(api.messages.getLastMessage, {
    chatId: chat._id,
  });

  const handleClick = () => {
    router.push(`/dashboard/chat/${chat._id}`);
    closeMobileNav();
  };

  return (
    <div
      className="group rounded-lg border border-transparent bg-gray-800 hover:bg-gray-700 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md pl-2 pr-2 mt-5"
      onClick={handleClick}
    >
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-300 truncate flex-1 font-medium">
          {lastMessage ? (
            <>
              {lastMessage.role === "user" ? "You: " : "AI: "}
              {lastMessage.content.replace(/\\n/g, "\n")}
            </>
          ) : (
            <span className="text-gray-500">New conversation</span>
          )}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-transparent"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(chat._id);
          }}
        >
          <TrashIcon className="h-2.5 w-2.5 bg-transparent text-red-500" />
        </Button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const router = useRouter();
  const { isMobileNavOpen, closeMobileNav } = useNavigation();

  const chats = useQuery(api.chats.listChats);
  const createChat = useMutation(api.chats.createChat);
  const deleteChat = useMutation(api.chats.deleteChat);

  const handleNewChat = async () => {
    const chatId = await createChat({ title: "New Chat" });
    router.push(`/dashboard/chat/${chatId}`);
    closeMobileNav();
  };

  const handleDeleteChat = async (id: Id<"chats">) => {
    await deleteChat({ id });
    if (window.location.pathname.includes(id)) {
      router.push("/dashboard");
    }
  };

  return (
    <>
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileNav}
        />
      )}

      <div
        className={cn(
          "fixed md:inset-y-0 top-14 bottom-0 left-0 z-50 w-64 bg-gray-900 border-r border-transparent transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:top-0 flex flex-col",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-3 border-b border-transparent relative">
          <Button
            onClick={handleNewChat}
            className="absolute top-1.5 right-1.5 text-gray-400 bg-transparent hover:text-white transition-colors duration-200 p-2"
            size="icon"
          >
            <Pencil2Icon className="h-4 w-4 border-transparent" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 p-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {chats?.map((chat) => (
            <ChatRow key={chat._id} chat={chat} onDelete={handleDeleteChat} />
          ))}
        </div>
      </div>
    </>
  );
}
