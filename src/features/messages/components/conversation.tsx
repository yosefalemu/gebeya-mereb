"use client";
import CustomInputLabel from "@/components/inputs/custom-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";

export default function Conversation() {
  const conversationList = [
    {
      id: 0,
      message: "Hello how are you",
      time: "1:19PM",
      createdBy: "John Doe",
    },
    {
      id: 1,
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      time: "1:20PM",
      createdBy: "John Doe",
    },
    {
      id: 2,
      message: "I'm fine, thank you!",
      time: "1:21PM",
      createdBy: "You",
    },
    { id: 3, message: "What about you?", time: "1:22PM", createdBy: "You" },
    {
      id: 4,
      message: "I'm doing well, thanks for asking!",
      time: "1:23PM",
      createdBy: "John Doe",
    },
    {
      id: 5,
      message: "Any plans for the weekend?",
      time: "1:24PM",
      createdBy: "John Doe",
    },
    {
      id: 6,
      message: "Yes, I'm going hiking.",
      time: "1:25PM",
      createdBy: "You",
    },
    {
      id: 7,
      message: "That sounds fun!",
      time: "1:26PM",
      createdBy: "John Doe",
    },
    { id: 8, message: "I love hiking too!", time: "1:27PM", createdBy: "You" },
  ];

  const form = useForm({
    defaultValues: {
      message: "",
    },
  });
  return (
    <div className="flex flex-col gap-y-2 h-[665px] absolute top-0 right-0 overflow-y-auto w-2/3 p-2 hide-scrollbar">
      <div className="flex flex-col gap-y-4">
        {conversationList.map((conversation) => (
          <div
            key={conversation.id}
            className={cn(
              "w-1/2 min-h-fit p-2 px-4 flex flex-col gap-0",
              conversation.createdBy === "You"
                ? "self-end rounded-tl-lg rounded-bl-lg rounded-tr-lg bg-amber-300/50"
                : "self-start rounded-tr-lg rounded-br-lg rounded-tl-lg bg-green-300/50"
            )}
          >
            {conversation.message}
            <p className="text-xs self-end">{conversation.time}</p>
          </div>
        ))}
      </div>
      <Form {...form}>
        <div className="border-t flex items-center gap-x-1.5 px-2 py-3">
          <form onSubmit={() => console.log("SUBMITTED")} className="flex-1">
            <CustomInputLabel
              fieldTitle="message"
              nameInSchema="message"
              placeHolder="Type your message here..."
              showTilte={false}
              className=""
            />
          </form>
          <Button size="icon" className="rounded-full h-10 w-10 cursor-pointer">
            <Send />
          </Button>
        </div>
      </Form>
    </div>
  );
}
